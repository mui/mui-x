'use client';
import type * as React from 'react';

export interface MessageListRootOwnerState {
  messageCount: number;
  isAtBottom: boolean;
}

export interface MessageListDateDividerOwnerState {
  messageId: string;
  hasBoundary: boolean;
  label: React.ReactNode;
}
