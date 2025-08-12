'use client';

import React, { useState, useEffect } from 'react';
import { testLunarCrushSDK, testCORS } from '@/lib/lunarcrush-debug';

export default function CORSDebug() {
    const [results, setResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addResult = (message: string) => {
        setResults(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
        console.log(message);
    };

    const testSDK = async () => {
        setIsLoading(true);
        setResults([]);

        try {
            addResult('🔍 Testing LunarCrush SDK...');
            const coins = await testLunarCrushSDK();
            addResult(`✅ SDK Success! Got ${coins?.length || 0} coins`);
            addResult(`📊 Sample: ${JSON.stringify(coins?.slice(0, 2), null, 2)}`);
        } catch (error) {
            addResult(`❌ SDK Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        setIsLoading(false);
    };

    const testDirectFetch = async () => {
        setIsLoading(true);
        setResults([]);

        try {
            addResult('🔍 Testing direct fetch...');
            const data = await testCORS();
            addResult(`✅ Direct fetch Success!`);
            addResult(`📊 Data: ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            addResult(`❌ Direct fetch Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        setIsLoading(false);
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">CORS Debug Tool</h2>

            <div className="space-x-4 mb-6">
                <button
                    onClick={testSDK}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Test SDK
                </button>

                <button
                    onClick={testDirectFetch}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Test Direct Fetch
                </button>
            </div>

            <div className="bg-gray-900 p-4 rounded max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                    <p className="text-gray-400">Click a button to run tests...</p>
                ) : (
                    results.map((result, index) => (
                        <div key={index} className="text-sm text-gray-300 mb-1 font-mono">
                            {result}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
