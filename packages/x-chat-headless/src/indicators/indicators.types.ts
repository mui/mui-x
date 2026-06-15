'use client';
import * as React from 'react';
import type { ChatUser } from '../types/chat-entities';

export interface TypingIndicatorOwnerState {
  activeConversationId?: string;
  users: ChatUser[];
  count: number;
  label: string;
}

export interface StreamingIndicatorOwnerState {
  /**
   * `'waiting'` – a response is in flight but no assistant message exists yet.
   * `'streaming'` – the surrounding assistant message is streaming.
   * `null` – hidden.
   */
  phase: 'waiting' | 'streaming' | null;
  messageId?: string;
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
