'use client';
import type { ChatConversation } from '@mui/x-chat-headless';

export interface ThreadOwnerState {
  conversationId?: string;
  hasConversation: boolean;
  conversation: ChatConversation | null;
}

export interface ThreadRootOwnerState extends ThreadOwnerState {}

export interface ThreadHeaderOwnerState extends ThreadOwnerState {}

export interface ThreadTitleOwnerState extends ThreadOwnerState {}

export interface ThreadSubtitleOwnerState extends ThreadOwnerState {}

export interface ThreadActionsOwnerState extends ThreadOwnerState {}
