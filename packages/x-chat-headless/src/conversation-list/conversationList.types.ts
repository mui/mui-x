'use client';
import type { ChatConversation } from '../types/chat-entities';

export type ConversationListVariant = 'default' | 'compact';

export interface ConversationListRootOwnerState {
  conversationCount: number;
  activeConversationId?: string;
  variant: ConversationListVariant;
}

export interface ConversationListItemOwnerState {
  conversation: ChatConversation;
  selected: boolean;
  unread: boolean;
  focused: boolean;
  variant?: ConversationListVariant;
}

export interface ConversationListItemAvatarOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListTitleOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListPreviewOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListTimestampOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListUnreadBadgeOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListItemContentOwnerState extends ConversationListItemOwnerState {}

export interface ConversationListItemActionsOwnerState extends ConversationListItemOwnerState {}
