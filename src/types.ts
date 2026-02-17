export enum MessageType {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system', // For simulated scanning logs
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: number;
}

export interface PricingTier {
  name: string;
  setupFee: string;
  retainer: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface ScoutState {
  isScanning: boolean;
  scanProgress: number;
  targetUrl: string | null;
}
