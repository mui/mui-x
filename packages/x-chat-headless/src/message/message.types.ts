'use client';
import type { ChatMessage, ChatMessageStatus, ChatRole } from '../types/chat-entities';
import type { ChatVariant } from '../chat/internals/ChatVariantContext';
import type { ChatDensity } from '../chat/internals/ChatDensityContext';

export interface MessageOwnerState {
  messageId: string;
  message: ChatMessage | null;
  role?: ChatRole;
  status?: ChatMessageStatus;
  streaming: boolean;
  error: boolean;
  isGrouped: boolean;
  variant: ChatVariant;
  density: ChatDensity;
  /**
   * Whether the message has an avatar to display.
   * Drives the `--MuiChatMessage-avatarSize` CSS variable so the opposite-side
   * phantom column collapses when no avatar is present.
   */
  showAvatar: boolean;
}

export interface MessageRootOwnerState extends MessageOwnerState {}

export interface MessageAvatarOwnerState extends MessageOwnerState {}

export interface MessageAuthorLabelOwnerState extends MessageOwnerState {}

export interface MessageContentOwnerState extends MessageOwnerState {}

export interface MessageMetaOwnerState extends MessageOwnerState {}

export interface MessageActionsOwnerState extends MessageOwnerState {}
