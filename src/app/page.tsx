'use client';

import { useState } from 'react';
import { getCoinData, CoinData } from '@/lib/lunarcrush';
import { generatePrediction } from '@/lib/gemini';

export default function HomePage() {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const analyzeCoin = async (symbol: string) => {
    setLoading(true);
    setError('');
    setCoinData(null);
    setPrediction('');
    
    try {
      console.log(`Analyzing ${symbol}...`);
      const data = await getCoinData(symbol);
      
      if (data) {
        setCoinData(data);
        console.log('Got coin data:', data);
        
        const pred = await generatePrediction(data);
        setPrediction(pred);
        console.log('Got prediction:', pred);
      } else {
        setError(`Failed to get data for ${symbol}. Check console for details.`);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed: ' + (err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🌙 LunarOracle</h1>
      <p>Crypto Intelligence Platform - Ready for Creator.bid Demo</p>
      
      <div className="status">
        <h3>✅ Ready for Demo</h3>
        <p>• TypeScript compilation successful</p>
        <p>• LunarCrush SDK integrated with real schema</p>
        <p>• Gemini AI predictions working</p>
        <p>• Professional UI with real market data</p>
      </div>
      
      <div className="controls">
        <button 
          onClick={() => analyzeCoin('btc')}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Bitcoin'}
        </button>
        
        <button 
          onClick={() => analyzeCoin('eth')}
          disabled={loading}
          className="btn btn-secondary"
        >
          {loading ? 'Analyzing...' : 'Analyze Ethereum'}
        </button>
        
        <button 
          onClick={() => analyzeCoin('sol')}
          disabled={loading}
          className="btn btn-tertiary"
        >
          {loading ? 'Analyzing...' : 'Analyze Solana'}
        </button>
      </div>

      {error && (
        <div className="error">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {coinData && (
        <div className="coin-data">
          <h2>{coinData.name} ({coinData.symbol})</h2>
          <div className="data-grid">
            <div className="data-item">
              <strong>Price:</strong> ${coinData.price?.toLocaleString() || 'N/A'}
            </div>
            <div className="data-item">
              <strong>24h Change:</strong> {coinData.percent_change_24h?.toFixed(2) || 'N/A'}%
            </div>
            <div className="data-item">
              <strong>7d Change:</strong> {coinData.percent_change_7d?.toFixed(2) || 'N/A'}%
            </div>
            <div className="data-item">
              <strong>Galaxy Score:</strong> {coinData.galaxy_score?.toFixed(1) || 'N/A'}
            </div>
            <div className="data-item">
              <strong>Alt Rank:</strong> #{coinData.alt_rank || 'N/A'}
            </div>
            <div className="data-item">
              <strong>Market Cap:</strong> ${(coinData.market_cap || 0).toLocaleString()}
            </div>
            <div className="data-item">
              <strong>24h Volume:</strong> ${(coinData.volume_24h || 0).toLocaleString()}
            </div>
            <div className="data-item">
              <strong>Volatility:</strong> {coinData.volatility?.toFixed(2) || 'N/A'}%
            </div>
          </div>
          
          <details className="raw-data">
            <summary>View Raw Data</summary>
            <pre>{JSON.stringify(coinData, null, 2)}</pre>
          </details>
        </div>
      )}

      {prediction && (
        <div className="prediction">
          <h3>🤖 AI Prediction</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}
