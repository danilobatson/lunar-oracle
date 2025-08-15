// NEXUS: Shared Command Types - One source of truth for all platforms
export interface CommandContext {
  platform: 'slack' | 'telegram' | 'discord';
  userId: string;
  channelId: string;
  teamId?: string;
  tier: 'free' | 'owl' | 'quantum' | 'oracle' | 'mystic' | 'sovereign';
}

export interface CommandResponse {
  success: boolean;
  message: string;
  chunks?: string[];
  embed?: any;
  buttons?: any[];
  error?: string;
}

export interface OwlAnalyzeParams {
  symbol: string;
  context: CommandContext;
}

export interface OwlTrendingParams {
  limit?: number;
  context: CommandContext;
}

export interface OwlAlertsParams {
  symbol?: string;
  action?: 'add' | 'remove' | 'list';
  context: CommandContext;
}

// Platform-specific formatting variants
export type PlatformVariant = {
  slack: {
    useBlocks: boolean;
    maxChunkSize: 4000;
    supportEmoji: true;
    supportFormatting: true;
  };
  telegram: {
    useMarkdown: boolean;
    maxChunkSize: 4096;
    supportEmoji: true;
    supportFormatting: true;
  };
  discord: {
    useEmbeds: boolean;
    maxChunkSize: 2000;
    supportEmoji: true;
    supportFormatting: true;
  };
};
