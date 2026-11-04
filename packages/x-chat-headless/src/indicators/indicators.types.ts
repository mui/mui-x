'use client';
import type * as React from 'react';
import type { ChatUser } from '../types/chat-entities';

export interface TypingIndicatorOwnerState {
  activeConversationId?: string;
  users: ChatUser[];
  count: number;
  /**
   * The label announcing who is typing.
   */
  label: string;
}

export interface StreamingIndicatorOwnerState {
  /**
   * `'waiting'` – a response is in flight but no assistant message exists yet.
   * `'streaming'` – the surrounding assistant message is streaming.
   * `null` – hidden.
   */
  phase: 'waiting' | 'streaming' | null;
  /**
   * The id of the message.
   */
  messageId?: string;
}

export interface UnreadMarkerOwnerState {
  /**
   * The id of the message.
   */
  messageId: string;
  hasBoundary: boolean;
  /**
   * The label of the marker.
   */
  label: React.ReactNode;
}

export interface ScrollToBottomAffordanceOwnerState {
  isAtBottom: boolean;
  unseenMessageCount: number;
  /**
   * The label of the button.
   */
  label: string;
}
