'use client';
import * as React from 'react';
import type { ChatUser } from '../types/chat-entities';

export interface TypingIndicatorOwnerState {
  activeConversationId?: string;
  users: ChatUser[];
  count: number;
  label: string;
}

export interface UnreadMarkerOwnerState {
  messageId: string;
  hasBoundary: boolean;
  label: React.ReactNode;
}

export interface ScrollToBottomAffordanceOwnerState {
  isAtBottom: boolean;
  unseenMessageCount: number;
  label: string;
}
