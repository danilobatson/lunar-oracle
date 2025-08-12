import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generatePrediction = async (coinData: any): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze this cryptocurrency data and provide a brief prediction:
    
Symbol: ${coinData.symbol}
Price: $${coinData.price}
24h Change: ${coinData.percent_change_24h}%
Galaxy Score: ${coinData.galaxy_score}
Social Volume: ${coinData.social_volume}

Provide a 2-3 sentence prediction with confidence level.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    return 'Analysis unavailable at this time.';
  }
};
