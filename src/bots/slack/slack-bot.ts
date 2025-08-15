import { App, LogLevel } from '@slack/bolt';
import { handleOwlAnalyze, handleOwlTrending, handleOwlAlerts, handleOwlStatus, handleOwlHelp } from '../../shared/commands/handlers';
import { CommandContext } from '../../shared/commands/types';

// NEXUS Slack WebSocket Bot - SAME commands as Telegram (underscores)!
const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  appToken: process.env.SLACK_APP_TOKEN!,
  socketMode: true,
  logLevel: LogLevel.INFO,
});

// Helper: Create command context from Slack event
function createContext(event: any): CommandContext {
  return {
    platform: 'slack',
    userId: event.user_id,
    channelId: event.channel_id,
    teamId: event.team_id,
    tier: 'free', // TODO: Look up actual subscription tier
  };
}

// Helper: Send chunked response to Slack
async function sendChunkedResponse(respond: any, chunks: string[], isEphemeral = false) {
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    const chunkText = chunks.length > 1
      ? `${chunk}\n\n_Part ${i + 1} of ${chunks.length}_`
      : chunk;

    await respond({
      text: chunkText,
      response_type: isEphemeral ? 'ephemeral' : 'in_channel',
    });

    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

// Command: /owl_analyze [symbol] - SAME AS TELEGRAM ✅
app.command('/owl_analyze', async ({ command, ack, respond }) => {
  await ack();

  const symbol = command.text.trim().toUpperCase();
  if (!symbol) {
    await respond({
      text: '🦉 Please provide a crypto symbol: `/owl_analyze BTC`',
      response_type: 'ephemeral',
    });
    return;
  }

  await respond({
    text: `🦉 The Quantum Owl awakens to analyze ${symbol}... ✨`,
    response_type: 'ephemeral',
  });

  const context = createContext(command);
  const result = await handleOwlAnalyze({ symbol, context });

  if (result.success && result.chunks) {
    await sendChunkedResponse(respond, result.chunks, false);
  } else {
    await respond({
      text: result.error || '🦉 The Owl\'s vision is clouded. Please try again.',
      response_type: 'ephemeral',
    });
  }
});

// Command: /owl_trending - SAME AS TELEGRAM ✅
app.command('/owl_trending', async ({ command, ack, respond }) => {
  await ack();

  await respond({
    text: '🦉 Scanning quantum trending patterns across all platforms... ✨',
    response_type: 'ephemeral',
  });

  const context = createContext(command);
  const result = await handleOwlTrending({ context });

  if (result.success && result.chunks) {
    await sendChunkedResponse(respond, result.chunks, false);
  } else {
    await respond({
      text: '🦉 Unable to scan trending patterns. Please try again.',
      response_type: 'ephemeral',
    });
  }
});

// Command: /owl_alerts - SAME AS TELEGRAM ✅
app.command('/owl_alerts', async ({ command, ack, respond }) => {
  await ack();

  const args = command.text.trim().split(' ');
  const action = args[0]?.toLowerCase() || 'list';
  const symbol = args[1]?.toUpperCase();

  const context = createContext(command);
  const result = await handleOwlAlerts({ context, action, symbol });

  if (result.success && result.chunks) {
    await sendChunkedResponse(respond, result.chunks, true);
  } else {
    await respond({
      text: '🦉 Alert system temporarily unavailable.',
      response_type: 'ephemeral',
    });
  }
});

// Command: /owl_status - SAME AS TELEGRAM ✅
app.command('/owl_status', async ({ command, ack, respond }) => {
  await ack();

  const context = createContext(command);
  const result = await handleOwlStatus(context);

  if (result.success && result.chunks) {
    await sendChunkedResponse(respond, result.chunks, true);
  } else {
    await respond({
      text: '🦉 Unable to retrieve account status.',
      response_type: 'ephemeral',
    });
  }
});

// Command: /owl_help - SAME AS TELEGRAM ✅
app.command('/owl_help', async ({ command, ack, respond }) => {
  await ack();

  const context = createContext(command);
  const result = await handleOwlHelp(context);

  if (result.success && result.chunks) {
    await sendChunkedResponse(respond, result.chunks, true);
  } else {
    await respond({
      text: '🦉 Help system temporarily unavailable.',
      response_type: 'ephemeral',
    });
  }
});

// App home opened - welcome message with updated commands
app.event('app_home_opened', async ({ event, client }) => {
  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `🦉 *Welcome to NEXUS Quantum Owl*\n\nYour mystical crypto oracle providing institutional-grade intelligence that AIXBT charges $78K for!\n\n✨ *Available Commands (SAME as Telegram):*\n• \`/owl_analyze BTC\` - Rich crypto analysis\n• \`/owl_trending\` - Top trending cryptos\n• \`/owl_alerts\` - Manage price alerts\n• \`/owl_status\` - Account status\n• \`/owl_help\` - Full command guide\n\n🔮 *The Owl sees 24-48 hours ahead of market movements*\n\n📈 Ready to dominate crypto? Start with \`/owl_analyze BTC\`!`
            }
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error publishing home tab:', error);
  }
});

export default app;
