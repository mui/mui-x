import type {
  ChatDataMessagePart,
  ChatDynamicToolInvocation,
  ChatToolInvocation,
} from './chat-message-parts';
import type { ChatMessage } from './chat-entities';

export interface ChatOnToolCallPayload {
  toolCall: ChatToolInvocation | ChatDynamicToolInvocation;
}

export type ChatOnToolCall = (payload: ChatOnToolCallPayload) => void | Promise<void>;

export type ChatOnData = (part: ChatDataMessagePart) => void | Promise<void>;

export interface ChatOnFinishPayload {
  message: ChatMessage;
  messages: ChatMessage[];
  isAbort: boolean;
  isDisconnect: boolean;
  isError: boolean;
  finishReason?: string;
}

export type ChatOnFinish = (payload: ChatOnFinishPayload) => void | Promise<void>;

export interface ChatAddToolApproveResponseInput {
  id: string;
  approved: boolean;
  reason?: string;
}
