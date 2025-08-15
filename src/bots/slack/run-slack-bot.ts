// Environment variables are already loaded by start.ts
import app from './slack-bot';

(async () => {
  try {
    console.log('🦉 NEXUS Slack Bot starting...');
    console.log('🔌 Using WebSocket mode (no URL required)');

    await app.start();

    console.log('');
    console.log('✅ NEXUS Quantum Owl is now online in Slack!');
    console.log('🎯 Ready to receive /owl-* commands');
    console.log('');
    console.log('Available commands:');
    console.log('  /owl-analyze [symbol] - Mystical crypto analysis');
    console.log('  /owl-trending - Top trending cryptos');
    console.log('  /owl-alerts - Manage price alerts');
    console.log('  /owl-status - Account status');
    console.log('  /owl-help - Command help');
    console.log('');
    console.log('🔮 The Quantum Owl awakens! Press Ctrl+C to stop.');

  } catch (error) {
    console.error('❌ Failed to start NEXUS Slack bot:', error);
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('1. Check your .env.local file has all Slack tokens');
    console.error('2. Verify your Slack app has Socket Mode enabled');
    console.error('3. Make sure the App Token starts with "xapp-"');
    console.error('4. Ensure Bot Token starts with "xoxb-"');
    console.error('');
    console.error('Environment check:');
    console.error('SLACK_BOT_TOKEN:', process.env.SLACK_BOT_TOKEN ? '✅ Found' : '❌ Missing');
    console.error('SLACK_APP_TOKEN:', process.env.SLACK_APP_TOKEN ? '✅ Found' : '❌ Missing');
    console.error('SLACK_SIGNING_SECRET:', process.env.SLACK_SIGNING_SECRET ? '✅ Found' : '❌ Missing');

    process.exit(1);
  }
})();
