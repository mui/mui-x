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
  /** Optional avatar URL for the conversation. When provided, this takes precedence over participant avatars in the conversation list. */
  avatarUrl?: string;
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

export type ChatAttachmentRejectionReason = 'mime-type' | 'file-size' | 'file-count';

export interface ChatAttachmentRejection {
  file: File;
  reason: ChatAttachmentRejectionReason;
}

export interface ChatAttachmentsConfig {
  /**
   * Accepted MIME types for file attachments.
   * Supports exact types (e.g. `'application/pdf'`) and wildcard
   * subtypes (e.g. `'image/*'`). File extension patterns (e.g. `'.pdf'`)
   * are **not** supported — use MIME types only.
   * @default undefined (all file types accepted)
   */
  acceptedMimeTypes?: string[];
  /**
   * Maximum number of files that can be attached to a single message.
   * @default undefined (unlimited)
   */
  maxFileCount?: number;
  /**
   * Maximum size of each file in bytes.
   * @default undefined (unlimited)
   */
  maxFileSize?: number;
  /**
   * Callback invoked when one or more files are rejected during attachment.
   * Receives an array of rejection objects describing which files failed
   * and why.
   * @param {ChatAttachmentRejection[]} rejections The list of rejected files with reasons.
   */
  onAttachmentReject?: (rejections: ChatAttachmentRejection[]) => void;
}
