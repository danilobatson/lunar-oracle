import { GoogleGenerativeAI } from '@google/generative-ai';
import { CoinData } from './lunarcrush';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generatePrediction = async (
	coinData: CoinData
): Promise<string> => {
	try {
		const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

		const prompt = `Analyze this cryptocurrency data and provide a brief prediction:

Symbol: ${coinData.symbol}
Name: ${coinData.name}
Price: $${coinData.price}
24h Change: ${coinData.percent_change_24h}%
7d Change: ${coinData.percent_change_7d}%
Galaxy Score: ${coinData.galaxy_score}
Alt Rank: ${coinData.alt_rank}
Market Cap: $${coinData.market_cap}
24h Volume: $${coinData.volume_24h}
Volatility: ${coinData.volatility}%

Provide a 2-3 sentence prediction with confidence level (1-10).`;

		const result = await model.generateContent(prompt);
		return result.response.text();
	} catch (error) {
		console.error('Gemini error:', error);
		return 'AI analysis unavailable at this time.';
	}
};
