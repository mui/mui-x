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
  metadata?: Record<string, unknown>;
}

export interface ChatConversation {
  id: string;
  title?: string;
  subtitle?: string;
  participants?: ChatUser[];
  unreadCount?: number;
  readState?: ConversationReadState;
  lastMessageAt?: ChatDateTimeString;
  metadata?: Record<string, unknown>;
}

// SRV-34 replaces this broad shape with the full discriminated union.
export interface UIMessagePart {
  type: string;
}

export interface UIMessage<Metadata = Record<string, unknown>> {
  id: string;
  conversationId?: string;
  role: ChatRole;
  parts: UIMessagePart[];
  metadata?: Metadata;
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
