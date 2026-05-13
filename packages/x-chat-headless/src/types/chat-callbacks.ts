import type {
  ChatDataMessagePart,
  ChatDynamicToolInvocation,
  ChatMessagePart,
  ChatToolInvocation,
} from './chat-message-parts';
import type {
  ChatDateTimeString,
  ChatDraftAttachment,
  ChatMessage,
  ChatUser,
} from './chat-entities';
import type { ChatMessageMetadata } from './chat-type-registry';

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

export interface UseChatSendMessageInput {
  id?: string;
  conversationId?: string;
  parts: ChatMessagePart[];
  metadata?: ChatMessageMetadata;
  author?: ChatUser;
  createdAt?: ChatDateTimeString;
  attachments?: ChatDraftAttachment[];
}
