'use client';
import type { ReactNode } from 'react';
import type { ChatUser } from '@mui/x-chat-headless';

export interface TypingIndicatorOwnerState {
  activeConversationId?: string;
  users: ChatUser[];
  count: number;
  label: string;
}

export interface UnreadMarkerOwnerState {
  messageId: string;
  hasBoundary: boolean;
  label: ReactNode;
}

export interface ScrollToBottomAffordanceOwnerState {
  isAtBottom: boolean;
  unseenMessageCount: number;
  label: string;
}
