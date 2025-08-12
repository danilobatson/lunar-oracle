// Simple LunarCrush Enhanced Service - Direct MCP Calls Only
// LLM will use MCP tools directly: mcp.cryptocurrencies(), mcp.topic(), etc.

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

// Simple service - LLM handles everything via MCP tools
class LunarCrushEnhanced {

	// Search - LLM will use MCP tools
	async searchCrypto(query: string): Promise<CryptoSearchResult[]> {
		console.log(`🤖 LLM: Use MCP tools for crypto search "${query}"`);
		console.log(`📡 Available: mcp.cryptocurrencies(opts), mcp.list('cryptocurrencies'), mcp.search('${query}')`);

		// LLM will handle this request using MCP tools directly
		throw new Error('LLM_MCP_REQUEST: Use MCP tools to search cryptocurrencies');
	}

	// Analysis - LLM will use MCP tools
	async getCryptoAnalysis(symbol: string): Promise<PredictionData> {
		console.log(`🤖 LLM: Use MCP tools for crypto analysis "${symbol}"`);
		console.log(`📡 Available: mcp.topic('${symbol}'), mcp.timeSeries('${symbol}', opts)`);

		// LLM will handle this request using MCP tools directly
		throw new Error('LLM_MCP_REQUEST: Use MCP tools to analyze cryptocurrency');
	}

	// Multi-timeframe - LLM will use MCP tools
	async getMultitimeframeAnalysis(
		symbol: string,
		baseAnalysis: PredictionData
	): Promise<MultitimeframePredictionData> {
		console.log(`🤖 LLM: Use MCP tools for multi-timeframe analysis "${symbol}"`);
		console.log(`📡 Available: mcp.timeSeries('${symbol}', opts), mcp.topic('${symbol}')`);

		// LLM will handle this request using MCP tools directly
		throw new Error('LLM_MCP_REQUEST: Use MCP tools for multi-timeframe analysis');
	}
}

export const lunarCrushEnhanced = new LunarCrushEnhanced();
export const lunarCrushMultiTimeframe = lunarCrushEnhanced;
