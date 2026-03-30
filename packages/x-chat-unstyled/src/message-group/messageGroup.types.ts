'use client';
import type { ChatRole } from '@mui/x-chat-headless';
import type { ChatVariant } from '../chat/internals/ChatVariantContext';

export interface MessageGroupOwnerState {
  isFirst: boolean;
  isLast: boolean;
  authorRole?: ChatRole;
  authorId?: string;
  variant: ChatVariant;
}
