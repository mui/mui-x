'use client';
import type { ChatMessage, ChatMessageStatus, ChatRole } from '@mui/x-chat-headless';
import type { ChatVariant } from '../chat/internals/ChatVariantContext';

export interface MessageOwnerState {
  messageId: string;
  message: ChatMessage | null;
  role?: ChatRole;
  status?: ChatMessageStatus;
  streaming: boolean;
  error: boolean;
  isGrouped: boolean;
  variant: ChatVariant;
}

export interface MessageRootOwnerState extends MessageOwnerState {}

export interface MessageAvatarOwnerState extends MessageOwnerState {}

export interface MessageAuthorLabelOwnerState extends MessageOwnerState {}

export interface MessageContentOwnerState extends MessageOwnerState {}

export interface MessageMetaOwnerState extends MessageOwnerState {}

export interface MessageActionsOwnerState extends MessageOwnerState {}
