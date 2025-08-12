// LunarCrush Enhanced Service with Resource Management
import { requestThrottle } from './request-throttle';

// Types remain the same
export interface SocialMetrics {
	galaxy_score: number;
	alt_rank: number;
	social_volume_24h: number;
	interactions_24h: number;
	sentiment: number;
	social_dominance: number;
	market_cap?: number;
	price?: number;
	volume_24h?: number;
	percent_change_24h?: number;
}

export interface PredictionData {
	symbol: string;
	current_price: number;
	social_metrics: SocialMetrics;
	ai_prediction: {
		price_target_24h: number;
		price_target_7d: number;
		confidence_score: number;
		risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
		reasoning: string;
		position_size_recommendation: number;
	};
	timestamp: string;
	data_sources: {
		lunarcrush_api: 'REAL' | 'FAILED';
		gemini_ai: 'REAL' | 'FAILED';
	};
}

export interface CryptoSearchResult {
	symbol: string;
	name: string;
	current_price?: number;
	market_cap?: number;
	galaxy_score?: number;
}

export interface TimeframePrediction {
	timeframe: '1h' | '4h' | '24h' | '7d' | '30d';
	price_target: number;
	confidence_score: number;
	reasoning: string;
	risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
	volume_expectation: number;
}

export interface MultitimeframePredictionData extends PredictionData {
	multi_timeframe: {
		predictions: TimeframePrediction[];
		confidence_trend: 'INCREASING' | 'DECREASING' | 'STABLE';
		overall_trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
		best_entry_timeframe: string;
		risk_timeline: {
			short_term: 'LOW' | 'MEDIUM' | 'HIGH';
			medium_term: 'LOW' | 'MEDIUM' | 'HIGH';
			long_term: 'LOW' | 'MEDIUM' | 'HIGH';
		};
	};
}

// Resource-managed LunarCrush Enhanced Service
class LunarCrushEnhanced {
	private readonly WORKER_BASE_URL = 'https://lunarcrush.cryptoguard-api.workers.dev';

	private logResourceUsage(operation: string, symbol?: string) {
		console.log(`🔋 RESOURCE MANAGED: ${operation}${symbol ? ` - ${symbol}` : ''}`);
		console.log(`📊 Throttle Status:`, requestThrottle.getStatus());
		console.log(`💡 This prevents Worker CPU exhaustion from rapid requests`);
	}

	async searchCrypto(query: string): Promise<CryptoSearchResult[]> {
		this.logResourceUsage('SEARCH', query);

		try {
			// Use throttled request to prevent Worker overload
			const response = await requestThrottle.throttledRequest<any>(
				`${this.WORKER_BASE_URL}/search`,
				{
					method: 'POST',
					body: JSON.stringify({ query })
				},
				`search-${query.toLowerCase()}`
			);

			// LLM will handle this using MCP tools
			console.log(`🤖 LLM: Use MCP:Search or MCP:Cryptocurrencies for "${query}"`);

			return response.results || [];

		} catch (error) {
			console.error('❌ Resource-managed search failed:', error);

			// Provide guidance for LLM
			console.log(`🤖 LLM: Worker overloaded, use direct MCP tools instead`);
			throw new Error(`Worker CPU exhausted. LLM should use MCP tools directly.`);
		}
	}

	async getCryptoAnalysis(symbol: string): Promise<PredictionData> {
		this.logResourceUsage('ANALYSIS', symbol);

		try {
			// Use throttled request with longer cache key for analysis
			const response = await requestThrottle.throttledRequest<PredictionData>(
				`${this.WORKER_BASE_URL}/analyze`,
				{
					method: 'POST',
					body: JSON.stringify({ symbol })
				},
				`analyze-${symbol.toLowerCase()}`
			);

			console.log(`✅ Resource-managed analysis completed for ${symbol}`);
			return response;

		} catch (error) {
			console.error('❌ Resource-managed analysis failed:', error);

			// Provide fallback guidance for LLM
			console.log(`🤖 LLM: Worker overloaded, use MCP:Topic + AI analysis directly`);
			throw new Error(`Worker CPU exhausted. LLM should use MCP:Topic for ${symbol} data.`);
		}
	}

	async getMultitimeframeAnalysis(
		symbol: string,
		baseAnalysis: PredictionData
	): Promise<MultitimeframePredictionData> {
		this.logResourceUsage('MULTI_TIMEFRAME', symbol);

		try {
			// Use throttled request for multi-timeframe analysis
			const response = await requestThrottle.throttledRequest<MultitimeframePredictionData>(
				`${this.WORKER_BASE_URL}/multi-timeframe`,
				{
					method: 'POST',
					body: JSON.stringify({ symbol, baseAnalysis })
				},
				`multiframe-${symbol.toLowerCase()}`
			);

			console.log(`✅ Resource-managed multi-timeframe analysis completed for ${symbol}`);
			return response;

		} catch (error) {
			console.error('❌ Resource-managed multi-timeframe failed:', error);

			// Provide fallback guidance for LLM
			console.log(`🤖 LLM: Worker overloaded, use MCP:Time_Series + AI for ${symbol}`);
			throw new Error(`Worker CPU exhausted. LLM should use MCP:Topic_Time_Series for ${symbol}.`);
		}
	}

	// Debug method to check resource status
	getResourceStatus() {
		return {
			throttleStatus: requestThrottle.getStatus(),
			workerUrl: this.WORKER_BASE_URL,
			resourceManagement: 'ACTIVE'
		};
	}
}

// Export the resource-managed service
export const lunarCrushEnhanced = new LunarCrushEnhanced();
export const lunarCrushMultiTimeframe = lunarCrushEnhanced;
