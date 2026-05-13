'use client';
import type { ChatConversation } from '../types/chat-entities';

export interface ConversationOwnerState {
  conversationId?: string;
  hasConversation: boolean;
  conversation: ChatConversation | null;
}

export interface ConversationRootOwnerState extends ConversationOwnerState {}

export interface ConversationHeaderOwnerState extends ConversationOwnerState {}

export interface ConversationTitleOwnerState extends ConversationOwnerState {}

export interface ConversationSubtitleOwnerState extends ConversationOwnerState {}

export interface ConversationHeaderInfoOwnerState extends ConversationOwnerState {}

export interface ConversationHeaderActionsOwnerState extends ConversationOwnerState {}
