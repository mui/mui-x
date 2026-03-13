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

export interface ConversationListItemTextOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListItemMetaOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListItemAvatarOwnerState extends ConversationListItemOwnerState {}
