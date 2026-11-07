'use client';
import type * as React from 'react';

export interface MessageListRootOwnerState {
  messageCount: number;
  isAtBottom: boolean;
}

export interface MessageListDateDividerOwnerState {
  /**
   * The id of the message.
   */
  messageId: string;
  hasBoundary: boolean;
  label: React.ReactNode;
}
