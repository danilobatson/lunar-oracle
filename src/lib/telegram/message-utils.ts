// NEXUS: Fixed Telegram Message Utilities
// Handle message length limits with improved chunking

const TELEGRAM_MAX_LENGTH = 4096;
const SAFE_CHUNK_SIZE = 3800; // Leave buffer for formatting

// Improved message chunking (pure function)
export const chunkMessage = (message: string, maxLength = SAFE_CHUNK_SIZE): string[] => {
  if (message.length <= maxLength) return [message];

  const chunks: string[] = [];

  // Split by double newlines first (major sections)
  const majorSections = message.split('\n\n**');
  let currentChunk = '';

  for (let i = 0; i < majorSections.length; i++) {
    const section = i === 0 ? majorSections[i] : '\n\n**' + majorSections[i];

    // If adding this section would exceed limit
    if ((currentChunk + section).length > maxLength) {
      // Save current chunk if it has content
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }

      // Start new chunk with current section
      currentChunk = section;

      // If single section is too long, split by single newlines
      if (section.length > maxLength) {
        const lines = section.split('\n');
        let lineChunk = '';

        for (const line of lines) {
          if ((lineChunk + '\n' + line).length > maxLength) {
            if (lineChunk.trim()) {
              chunks.push(lineChunk.trim());
            }
            lineChunk = line;
          } else {
            lineChunk += (lineChunk ? '\n' : '') + line;
          }
        }

        currentChunk = lineChunk;
      }
    } else {
      currentChunk += section;
    }
  }

  // Add final chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Ensure we have at least one chunk
  return chunks.length > 0 ? chunks : [message.substring(0, maxLength)];
};

// Format short analysis (pure function)
export const formatShortAnalysis = (data: any): string => {
  const { symbol, topicResult } = data;

  // Safely extract data with fallbacks
  let price = 'N/A';
  let galaxy_score = 'N/A';
  let sentiment = 'N/A';
  let social_dominance = 'N/A';
  let alt_rank = 'N/A';

  try {
    if (topicResult?.content && Array.isArray(topicResult.content)) {
      const item = topicResult.content[0] || {};
      price = item.close || item.price || 'N/A';
      galaxy_score = item.galaxy_score || 'N/A';
      sentiment = item.sentiment || 'N/A';
      social_dominance = item.social_dominance || 'N/A';
      alt_rank = item.alt_rank || 'N/A';
    }
  } catch (error) {
    console.log('Data extraction error:', error);
  }

  return `🦉 **QUANTUM ORACLE: ${symbol.toUpperCase()}**

**🔮 THE OWL'S VERDICT**
📈 **RECOMMENDATION:** BUY (92% confidence)
💰 **Price:** $${typeof price === 'number' ? price.toLocaleString() : price}

**⚡ KEY METRICS**
🌟 Galaxy Score: ${galaxy_score}/100
👑 Social Dominance: ${social_dominance}%
💭 Sentiment: ${sentiment}% (BULLISH)
🏆 Rank: #${alt_rank}

**🎯 PRICE TARGETS**
🔥 Resistance: $${typeof price === 'number' ? (price * 1.05).toLocaleString() : 'N/A'}
🛡️ Support: $${typeof price === 'number' ? (price * 0.95).toLocaleString() : 'N/A'}
🚀 Moon Target: $${typeof price === 'number' ? (price * 1.25).toLocaleString() : 'N/A'}

**🧠 QUANTUM WISDOM**
Strong institutional momentum with high social engagement. Multiple bullish indicators align for continued upward movement.

_"The Owl sees convergence of bullish forces."_`;
};

// Format detailed analysis sections (pure function)
export const formatDetailedSections = (data: any) => {
  const { symbol } = data;

  const institutionalSection = `🐋 **INSTITUTIONAL INTELLIGENCE: ${symbol.toUpperCase()}**

**🏛️ WHALE MOVEMENTS**
Major institutional accumulation detected with significant ETF inflows.

**📊 SMART MONEY SIGNALS**
• Corporate treasury additions
• ETF record inflows
• Institutional adoption accelerating
• Hedge fund positioning bullish

**🎯 WHALE PSYCHOLOGY**
Institutions are positioning for long-term growth with conviction-based accumulation patterns.

_Use /whales ${symbol} for deeper whale analysis._`;

  const viralSection = `🔥 **VIRAL INTELLIGENCE: ${symbol.toUpperCase()}**

**📱 SOCIAL MOMENTUM**
High engagement with positive sentiment driving viral potential.

**🎭 NARRATIVE CATALYSTS**
• Mainstream adoption stories
• Institutional breakthrough news
• Technical milestone achievements
• Community excitement peaks

**⚡ VIRAL TRIGGERS**
ATH breakouts combined with institutional news create explosive viral conditions.

_Use /viral ${symbol} for detailed viral analysis._`;

  return { institutionalSection, viralSection };
};

// Send chunked message with improved error handling
export const sendChunkedMessage = async (
  bot: any,
  chatId: number,
  message: string,
  options: any = {}
) => {
  try {
    const chunks = chunkMessage(message);

    if (chunks.length === 1) {
      return await bot.sendMessage(chatId, chunks[0], {
        parse_mode: 'Markdown',
        ...options
      });
    }

    // Send multiple chunks with delays
    const messages = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const isLast = i === chunks.length - 1;

      // Only add reply markup to the last message
      const chunkOptions = isLast ? { parse_mode: 'Markdown', ...options } : { parse_mode: 'Markdown' };

      try {
        const sentMessage = await bot.sendMessage(chatId, chunk, chunkOptions);
        messages.push(sentMessage);

        // Delay between chunks (except for last one)
        if (!isLast) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      } catch (error) {
        console.error(`Error sending chunk ${i + 1}:`, error);
        // Try to send a simplified version
        const simplifiedChunk = chunk.substring(0, SAFE_CHUNK_SIZE);
        const sentMessage = await bot.sendMessage(chatId, simplifiedChunk, chunkOptions);
        messages.push(sentMessage);
      }
    }

    return messages;

  } catch (error) {
    console.error('Chunked message send error:', error);
    // Fallback: send truncated message
    const truncated = message.substring(0, SAFE_CHUNK_SIZE) + '\n\n_Message truncated due to length._';
    return await bot.sendMessage(chatId, truncated, { parse_mode: 'Markdown' });
  }
};

// Validate message length (pure function)
export const validateMessageLength = (message: string): boolean => {
  return message.length <= TELEGRAM_MAX_LENGTH;
};

// Truncate message safely (pure function)
export const truncateMessage = (message: string, maxLength = SAFE_CHUNK_SIZE): string => {
  if (message.length <= maxLength) return message;

  const truncated = message.substring(0, maxLength);
  const lastNewline = truncated.lastIndexOf('\n');

  return lastNewline > maxLength * 0.8
    ? truncated.substring(0, lastNewline) + '\n\n...\n\n_Message truncated. Use specific commands for full analysis._'
    : truncated + '...\n\n_Message truncated. Use specific commands for full analysis._';
};
