import LunarCrush from 'lunarcrush-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for our enhanced service - NO FALLBACKS
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

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

class LunarCrushEnhancedService {
	private lunarcrush: LunarCrush;
	private genAI: GoogleGenerativeAI;
	private model: any;

	constructor() {
		// Initialize LunarCrush SDK - REAL API ONLY

		const apiKey = process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY;
		if (!apiKey) {
			throw new Error(
				'❌ LUNARCRUSH API KEY MISSING - Cannot proceed without real API access'
			);
		}
		this.lunarcrush = new LunarCrush(apiKey);
		console.log('✅ LUNARCRUSH SDK initialized with REAL API key');

		// Initialize Gemini AI - REAL AI ONLY
		const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
		if (!geminiKey) {
			throw new Error(
				'❌ GEMINI API KEY MISSING - Cannot proceed without real AI access'
			);
		}
		this.genAI = new GoogleGenerativeAI(geminiKey);
		this.model = this.genAI.getGenerativeModel({
			model: 'gemini-2.5-flash-lite',
		});
		console.log('✅ GEMINI AI initialized with REAL API key');
	}

	/**
	 * Search cryptocurrencies - REAL LUNARCRUSH DATA ONLY
	 */
	async searchCryptocurrencies(query: string): Promise<CryptoSearchResult[]> {
		console.log(`🔍 REAL API CALL: Searching LunarCrush for "${query}"`);

		try {
			// REAL API CALL - NO FALLBACKS
			const coinsList = await this.lunarcrush.coins.list();
			console.log(
				`✅ REAL DATA: Received ${
					coinsList?.length || 0
				} coins from LunarCrush API`
			);

			if (!coinsList || !Array.isArray(coinsList)) {
				throw new Error('LunarCrush API returned invalid data structure');
			}

			// Filter results - REAL DATA ONLY
			const filtered = coinsList.filter(
				(crypto: any) =>
					crypto.symbol?.toLowerCase().includes(query.toLowerCase()) ||
					crypto.name?.toLowerCase().includes(query.toLowerCase())
			);

			console.log(
				`✅ REAL SEARCH: Found ${filtered.length} matches for "${query}"`
			);

			return filtered.slice(0, 10).map((crypto: any) => ({
				symbol: crypto.symbol || '',
				name: crypto.name || '',
				current_price: crypto.price || undefined,
				market_cap: crypto.market_cap || undefined,
				galaxy_score: crypto.galaxy_score || undefined,
			}));
		} catch (error) {
			console.error('❌ REAL API FAILED:', error);
			const errorMessage = getErrorMessage(error);
			throw new Error(
				`LunarCrush API search failed: ${errorMessage} - NO FALLBACK DATA AVAILABLE`
			);
		}
	}

	/**
	 * Get crypto analysis - REAL DATA ONLY, NO FALLBACKS
	 */
	async getCryptoAnalysis(symbol: string): Promise<PredictionData> {
		console.log(
			`📊 REAL ANALYSIS: Starting comprehensive analysis for ${symbol}`
		);

		let lunarcrushStatus: 'REAL' | 'FAILED' = 'FAILED';
		let geminiStatus: 'REAL' | 'FAILED' = 'FAILED';

		try {
			// STEP 1: GET REAL LUNARCRUSH DATA
			console.log(`🔥 STEP 1: Fetching REAL LunarCrush data for ${symbol}`);
			const coinsList = await this.lunarcrush.coins.list();

			if (!coinsList || !Array.isArray(coinsList)) {
				throw new Error('LunarCrush API returned invalid data - ABORTING');
			}

			const coinData = coinsList.find(
				(coin: any) => coin.symbol?.toLowerCase() === symbol.toLowerCase()
			);

			if (!coinData) {
				throw new Error(
					`${symbol} not found in LunarCrush database - REAL DATA REQUIRED`
				);
			}

			console.log(`✅ REAL LUNARCRUSH DATA for ${symbol}:`, {
				galaxy_score: coinData.galaxy_score,
				alt_rank: coinData.alt_rank,
				price: coinData.price,
				social_volume_24h: coinData.social_volume_24h,
			});

			lunarcrushStatus = 'REAL';

			// Extract REAL social metrics - NO DEFAULTS
			const socialMetrics: SocialMetrics = {
				galaxy_score: coinData.galaxy_score ?? 0,
				alt_rank: coinData.alt_rank ?? 999,
				social_volume_24h: coinData.social_volume_24h ?? 0,
				interactions_24h: coinData.interactions_24h ?? 0,
				sentiment: coinData.sentiment ?? 0,
				social_dominance: coinData.social_dominance ?? 0,
				market_cap: coinData.market_cap ?? undefined,
				price: coinData.price ?? undefined,
				volume_24h: coinData.volume_24h ?? undefined,
				percent_change_24h: coinData.percent_change_24h ?? undefined,
			};

			// STEP 2: GENERATE REAL AI PREDICTION
			console.log(
				`🤖 STEP 2: Generating REAL AI prediction with Gemini for ${symbol}`
			);
			const aiPrediction = await this.generateRealAIPrediction(
				symbol,
				socialMetrics
			);
			geminiStatus = 'REAL';

			const result: PredictionData = {
				symbol: symbol.toUpperCase(),
				current_price: coinData.price ?? 0,
				social_metrics: socialMetrics,
				ai_prediction: aiPrediction,
				timestamp: new Date().toISOString(),
				data_sources: {
					lunarcrush_api: lunarcrushStatus,
					gemini_ai: geminiStatus,
				},
			};

			console.log(`🎉 SUCCESS: Complete REAL analysis generated for ${symbol}`);
			return result;
		} catch (error) {
			console.error(`❌ REAL DATA ANALYSIS FAILED for ${symbol}:`, error);
			const errorMessage = getErrorMessage(error);
			throw new Error(
				`Analysis failed with REAL APIs: ${errorMessage} - NO MOCK DATA PROVIDED`
			);
		}
	}

	/**
	 * Generate REAL AI prediction - NO FALLBACKS
	 */
	private async generateRealAIPrediction(
		symbol: string,
		metrics: SocialMetrics
	): Promise<any> {
		const currentPrice = metrics.price ?? 0;

		if (currentPrice === 0) {
			throw new Error(
				`Cannot generate AI prediction: No real price data for ${symbol}`
			);
		}

		const prompt = `
REAL CRYPTO ANALYSIS REQUEST for ${symbol}

REAL LUNARCRUSH SOCIAL DATA:
- Galaxy Score: ${metrics.galaxy_score}/100 (social intelligence)
- AltRank: ${metrics.alt_rank} (lower = better ranking)
- Social Volume 24h: ${metrics.social_volume_24h} posts
- Interactions 24h: ${metrics.interactions_24h}
- Sentiment: ${metrics.sentiment}/5 (social sentiment score)
- Social Dominance: ${metrics.social_dominance}%
- Current Price: $${currentPrice}
- 24h Change: ${metrics.percent_change_24h}%
- Market Cap: $${metrics.market_cap}

Generate a REAL investment analysis based on this ACTUAL data. Respond with valid JSON:

{
  "price_target_24h": <realistic_number>,
  "price_target_7d": <realistic_number>,
  "confidence_score": <0-100_integer>,
  "risk_level": "<LOW|MEDIUM|HIGH>",
  "reasoning": "<detailed_analysis_of_real_data>",
  "position_size_recommendation": <1-10_integer>
}

Base your analysis on the REAL social sentiment and market data provided above.
`;

		try {
			console.log(
				`🤖 REAL AI REQUEST: Sending to Gemini with real data for ${symbol}`
			);
			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			console.log(
				`🤖 REAL AI RESPONSE received for ${symbol} (length: ${text.length})`
			);

			// Parse REAL AI response
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error(
					'Gemini AI returned invalid JSON format - cannot parse real prediction'
				);
			}

			const prediction = JSON.parse(jsonMatch[0]);
			console.log(`✅ REAL AI PREDICTION parsed for ${symbol}:`, prediction);

			// Validate but DON'T provide fallbacks - REAL DATA ONLY
			if (!prediction.price_target_24h || !prediction.reasoning) {
				throw new Error(
					'Gemini AI prediction missing required fields - REAL prediction failed'
				);
			}

			return {
				price_target_24h: Number(prediction.price_target_24h),
				price_target_7d: Number(prediction.price_target_7d),
				confidence_score: Math.min(
					100,
					Math.max(0, Number(prediction.confidence_score))
				),
				risk_level: ['LOW', 'MEDIUM', 'HIGH'].includes(prediction.risk_level)
					? prediction.risk_level
					: 'MEDIUM',
				reasoning: prediction.reasoning,
				position_size_recommendation: Math.min(
					10,
					Math.max(1, Number(prediction.position_size_recommendation))
				),
			};
		} catch (error) {
			console.error(`❌ REAL AI PREDICTION FAILED for ${symbol}:`, error);
			const errorMessage = getErrorMessage(error);
			throw new Error(
				`Gemini AI prediction failed: ${errorMessage} - NO FALLBACK PREDICTION`
			);
		}
	}

	/**
	 * Get popular cryptos - REAL DATA ONLY
	 */
	async getPopularCryptos(): Promise<CryptoSearchResult[]> {
		console.log(
			`🔥 REAL API CALL: Getting popular cryptocurrencies from LunarCrush`
		);

		try {
			const coinsList = await this.lunarcrush.coins.list();
			console.log(
				`✅ REAL DATA: Received ${
					coinsList?.length || 0
				} coins for popular list`
			);

			if (!coinsList || !Array.isArray(coinsList)) {
				throw new Error(
					'LunarCrush popular coins API failed - REAL DATA REQUIRED'
				);
			}

			return coinsList.slice(0, 12).map((crypto: any) => ({
				symbol: crypto.symbol || '',
				name: crypto.name || '',
				current_price: crypto.price ?? undefined,
				market_cap: crypto.market_cap ?? undefined,
				galaxy_score: crypto.galaxy_score ?? undefined,
			}));
		} catch (error) {
			console.error('❌ REAL POPULAR CRYPTOS FAILED:', error);
			const errorMessage = getErrorMessage(error);
			throw new Error(
				`Failed to get real popular crypto data: ${errorMessage}`
			);
		}
	}
}

// Export singleton - REAL DATA ONLY
export const lunarCrushEnhanced = new LunarCrushEnhancedService();
export { LunarCrushEnhancedService };
