'use client';
import type { ReactNode } from 'react';

export interface MessageListRootOwnerState {
  messageCount: number;
  virtualization: boolean;
  isAtBottom: boolean;
}

export interface MessageListDateDividerOwnerState {
  messageId: string;
  hasBoundary: boolean;
  label: ReactNode;
}
