import type { ChatMessagePart } from './chat-message-parts';
import type {
  ChatConversationMetadata,
  ChatMessageMetadata,
  ChatUserMetadata,
} from './chat-type-registry';

export type ChatRole = 'system' | 'user' | 'assistant';

export type ChatMessageStatus =
  | 'pending'
  | 'sending'
  | 'streaming'
  | 'sent'
  | 'error'
  | 'cancelled';

export type ConversationReadState = 'read' | 'unread';

// ISO 8601 date-time string.
export type ChatDateTimeString = string;

export interface ChatUser {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  /** The role this user plays in the conversation. Use `'user'` for the local human sender and `'assistant'` for AI participants. */
  role?: ChatRole;
  metadata?: ChatUserMetadata;
}

export interface ChatConversation {
  id: string;
  title?: string;
  subtitle?: string;
  participants?: ChatUser[];
  unreadCount?: number;
  readState?: ConversationReadState;
  lastMessageAt?: ChatDateTimeString;
  metadata?: ChatConversationMetadata;
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  role: ChatRole;
  parts: ChatMessagePart[];
  metadata?: ChatMessageMetadata;
  createdAt?: ChatDateTimeString;
  updatedAt?: ChatDateTimeString;
  status?: ChatMessageStatus;
  author?: ChatUser;
  editedAt?: ChatDateTimeString;
}

export type ChatDraftAttachmentStatus = 'queued' | 'uploading' | 'uploaded' | 'error';

export interface ChatDraftAttachment {
  localId: string;
  file: File;
  previewUrl?: string;
  status: ChatDraftAttachmentStatus;
  progress?: number;
}
