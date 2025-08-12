const https = require('https');

console.log('🔍 Testing LunarCrush API from Node.js (no CORS restrictions)...');

const options = {
	hostname: 'lunarcrush.cryptoguard-api.workers.dev',
	path: '/graphql',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: 'Bearer xiewyr89anbiwnkyefnowoqezeme7ssdr5l86e6a',
	},
};

const postData = JSON.stringify({
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
});

const req = https.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`✅ Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log('✅ Response:', JSON.stringify(parsed, null, 2));
        } catch (error) {
            console.log('❌ Response (raw):', data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
});

req.write(postData);
req.end();
