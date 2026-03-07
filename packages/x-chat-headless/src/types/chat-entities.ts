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

// Consumers can augment this module to add app-specific user metadata.
export interface ChatUserMetadata {}

// Consumers can augment this module to add app-specific conversation metadata.
export interface ChatConversationMetadata {}

// Consumers can augment this module to add app-specific message metadata.
export interface ChatMessageMetadata {}

// Consumers can augment this module to register custom message parts.
export interface ChatCustomMessagePartMap {}

// Consumers can augment this module to register typed tool definitions.
export interface ChatToolDefinitionMap {}

// Consumers can augment this module to register typed data parts.
export interface ChatDataPartMap {}

export interface ChatUser {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
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

// SRV-34 replaces this broad built-in placeholder with the full discriminated union.
export interface ChatBuiltInMessagePart {
  type: string;
}

export type ChatCustomMessagePart = ChatCustomMessagePartMap[keyof ChatCustomMessagePartMap];

export type ChatMessagePart = ChatBuiltInMessagePart | ChatCustomMessagePart;

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
