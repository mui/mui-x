'use client';
import type { ChatRole } from '@mui/x-chat-headless';
import type { ChatVariant } from '../chat/internals/ChatVariantContext';
import type { ChatDensity } from '../chat/internals/ChatDensityContext';

export interface MessageGroupOwnerState {
  isFirst: boolean;
  isLast: boolean;
  authorRole?: ChatRole;
  authorId?: string;
  variant: ChatVariant;
  density: ChatDensity;
}
