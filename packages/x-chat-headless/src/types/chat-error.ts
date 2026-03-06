export type ChatErrorSource = 'send' | 'stream' | 'history' | 'render' | 'adapter';

export interface ChatError {
  code: string;
  message: string;
  source: ChatErrorSource;
  recoverable: boolean;
  retryable?: boolean;
  details?: Record<string, unknown>;
}
