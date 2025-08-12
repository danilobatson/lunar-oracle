// Request Throttling Service - Prevents Worker CPU Exhaustion
// This prevents rapid requests from overwhelming the Cloudflare Worker

interface QueuedRequest<T = any> {
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
  timestamp: number;
}

class RequestThrottleService {
  private pendingRequests = new Map<string, Promise<any>>();
  private requestQueue = new Map<string, QueuedRequest[]>();
  private lastRequestTime = new Map<string, number>();
  private readonly MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests per endpoint
  private readonly MAX_CONCURRENT_REQUESTS = 2; // Max concurrent requests per endpoint
  private readonly REQUEST_TIMEOUT = 30000; // 30 second timeout

  constructor() {
    // Clean up old requests every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();

    // Clean up old queue entries (older than 5 minutes)
    for (const [key, queue] of this.requestQueue.entries()) {
      this.requestQueue.set(
        key,
        queue.filter(item => now - item.timestamp < 300000)
      );
      if (this.requestQueue.get(key)?.length === 0) {
        this.requestQueue.delete(key);
      }
    }
  }

  private getRequestKey(url: string, method: string = 'GET'): string {
    try {
      const urlObj = new URL(url);
      return `${method}:${urlObj.pathname}`;
    } catch {
      return `${method}:${url}`;
    }
  }

  async throttledRequest<T>(
    url: string,
    options: RequestInit = {},
    cacheKey?: string
  ): Promise<T> {
    const method = options.method || 'GET';
    const requestKey = cacheKey || this.getRequestKey(url, method);

    console.log(`🚥 THROTTLE REQUEST: ${requestKey}`);

    // Check if we have a pending request for the same endpoint
    if (this.pendingRequests.has(requestKey)) {
      console.log(`⏳ Request already pending for ${requestKey}, waiting...`);
      try {
        return await this.pendingRequests.get(requestKey);
      } catch (error) {
        console.log(`❌ Pending request failed for ${requestKey}, retrying...`);
        // Continue to make new request if pending one failed
      }
    }

    // Check minimum interval between requests
    const lastRequest = this.lastRequestTime.get(requestKey) || 0;
    const timeSinceLastRequest = Date.now() - lastRequest;

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏱️ Throttling ${requestKey}: waiting ${waitTime}ms`);
      await new Promise<void>(resolve => setTimeout(resolve, waitTime));
    }

    // Create the actual request promise
    const requestPromise = this.makeRequest<T>(url, options);

    // Store the pending request
    this.pendingRequests.set(requestKey, requestPromise);
    this.lastRequestTime.set(requestKey, Date.now());

    try {
      const result = await requestPromise;
      console.log(`✅ Request completed for ${requestKey}`);
      return result;
    } catch (error) {
      console.error(`❌ Request failed for ${requestKey}:`, error);
      throw error;
    } finally {
      // Clean up the pending request
      this.pendingRequests.delete(requestKey);
    }
  }

  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - Worker may be overwhelmed');
      }

      throw error;
    }
  }

  // Get status for debugging
  getStatus() {
    return {
      pendingRequests: Array.from(this.pendingRequests.keys()),
      queueSizes: Object.fromEntries(
        Array.from(this.requestQueue.entries()).map(([key, queue]) => [key, queue.length])
      ),
      lastRequestTimes: Object.fromEntries(this.lastRequestTime.entries())
    };
  }
}

// Export singleton instance
export const requestThrottle = new RequestThrottleService();
