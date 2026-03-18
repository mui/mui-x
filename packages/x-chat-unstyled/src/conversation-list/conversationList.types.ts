'use client';
import type { ChatConversation } from '@mui/x-chat-headless';

export interface ConversationListRootOwnerState {
  conversationCount: number;
  activeConversationId?: string;
}

export interface ConversationListItemOwnerState {
  conversation: ChatConversation;
  selected: boolean;
  unread: boolean;
  focused: boolean;
}

export interface ConversationListItemAvatarOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListTitleOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListPreviewOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListTimestampOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListUnreadBadgeOwnerState extends ConversationListItemOwnerState {}
