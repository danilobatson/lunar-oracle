// CRITICAL: Load environment variables FIRST, before any other imports
import * as dotenv from 'dotenv';
import { join } from 'path';

console.log('🔑 Loading environment variables...');
dotenv.config({ path: join(process.cwd(), '.env.local') });

// Verify environment variables are loaded
const requiredEnvVars = [
  'SLACK_BOT_TOKEN',
  'SLACK_SIGNING_SECRET',
  'SLACK_APP_TOKEN'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n💡 Make sure these are set in your .env.local file');
  process.exit(1);
}

console.log('✅ All required environment variables loaded');
console.log(`🔑 Bot Token: ${process.env.SLACK_BOT_TOKEN?.substring(0, 15)}...`);
console.log(`🔑 App Token: ${process.env.SLACK_APP_TOKEN?.substring(0, 15)}...`);
console.log(`🔑 Signing Secret: ${process.env.SLACK_SIGNING_SECRET?.substring(0, 10)}...`);

// NOW we can import the bot (which will use the loaded environment variables)
console.log('🚀 Importing and starting Slack bot...');

// Import and start the bot runner
import('./run-slack-bot');
