export type ChatErrorSource = 'send' | 'stream' | 'history' | 'render' | 'adapter';

export type ChatErrorCode =
  | 'HISTORY_ERROR'
  | 'SEND_ERROR'
  | 'STREAM_ERROR'
  | 'REALTIME_ERROR';

export interface ChatError {
  code: ChatErrorCode;
  message: string;
  source: ChatErrorSource;
  recoverable: boolean;
  retryable?: boolean;
  details?: Record<string, unknown>;
}
