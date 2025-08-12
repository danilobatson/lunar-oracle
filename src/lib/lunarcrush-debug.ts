import LunarCrush from 'lunarcrush-sdk';

export async function testLunarCrushSDK() {
    console.log('🔍 Testing LunarCrush SDK directly...');

    try {
        // Initialize with the API key
        const lc = new LunarCrush('xiewyr89anbiwnkyefnowoqezeme7ssdr5l86e6a');

        console.log('✅ SDK initialized');

        // Test the coins.list() method
        console.log('📊 Calling coins.list()...');
        const coins = await lc.coins.list();

        console.log('✅ SDK call successful!');
        console.log('📊 First 3 coins:', coins?.slice(0, 3));

        return coins;
    } catch (error) {
        console.error('❌ SDK test failed:', error);

        // Log the full error details
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        throw error;
    }
}

export async function testCORS() {
    console.log('🔍 Testing direct fetch to GraphQL endpoint...');

    try {
        const response = await fetch('https://lunarcrush.cryptoguard-api.workers.dev/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer xiewyr89anbiwnkyefnowoqezeme7ssdr5l86e6a'
            },
            body: JSON.stringify({
                query: `
                    query GetCoinsList {
                        getCoinsList(limit: 3) {
                            symbol
                            name
                            price
                            galaxy_score
                        }
                    }
                `
            })
        });

        console.log('✅ Direct fetch status:', response.status);
        console.log('✅ Direct fetch headers:', [...response.headers.entries()]);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Direct fetch data:', data);
            return data;
        } else {
            const errorText = await response.text();
            console.log('❌ Direct fetch error:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('❌ Direct fetch failed:', error);
        throw error;
    }
}
