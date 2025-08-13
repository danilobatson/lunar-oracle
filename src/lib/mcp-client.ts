// Working MCP client with proper TypeScript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export async function createMcpClient(): Promise<Client> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY;

    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_LUNARCRUSH_API_KEY not found in environment variables');
    }

    console.log('🔄 Initializing MCP client with SSE transport...');

    // Create SSE transport for LunarCrush MCP server - EXACT same URL pattern
    const transport = new SSEClientTransport(
      new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
    );

    // Create MCP client with proper configuration - EXACT same config
    const client = new Client(
      {
        name: 'lunar-oracle-client',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Connect to the server
    await client.connect(transport);

    console.log('✅ MCP client connected successfully');
    return client;

  } catch (error) {
    console.error('❌ MCP client initialization failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`MCP connection failed: ${errorMessage}`);
  }
}

// Execute MCP tool calls with proper error handling and TypeScript
export async function executeToolCall(client: Client, toolName: string, args: any): Promise<any> {
  try {
    console.log(`🔄 Executing MCP tool: ${toolName} with args:`, args);

    const result = await client.callTool({
      name: toolName,
      arguments: args
    });

    console.log(`✅ MCP tool ${toolName} executed successfully`);
    return result;

  } catch (error) {
    console.error(`❌ MCP tool call failed: ${toolName}`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Tool ${toolName} failed: ${errorMessage}`);
  }
}

export default { createMcpClient, executeToolCall };
