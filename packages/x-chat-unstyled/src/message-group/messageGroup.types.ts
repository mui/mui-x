'use client';
import type { ChatRole } from '@mui/x-chat-headless';

export interface MessageGroupOwnerState {
  isFirst: boolean;
  isLast: boolean;
  authorRole?: ChatRole;
  authorId?: string;
}
