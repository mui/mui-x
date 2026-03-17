'use client';
import * as React from 'react';

export interface MessageListRootOwnerState {
  messageCount: number;
  virtualization: boolean;
  isAtBottom: boolean;
}

export interface MessageListDateDividerOwnerState {
  messageId: string;
  hasBoundary: boolean;
  label: React.ReactNode;
}
