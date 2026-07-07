'use client';
import type { ChatRole } from '../types/chat-entities';
import type { ChatVariant } from '../chat/internals/ChatVariantContext';
import type { ChatDensity } from '../chat/internals/ChatDensityContext';

export interface MessageGroupOwnerState {
  isFirst: boolean;
  isFirstInList: boolean;
  isLast: boolean;
  authorRole?: ChatRole;
  authorId?: string;
  /**
   * Whether the group's leading message is from the current user.
   * Falls back to `authorRole === 'user'` when no `currentUser` is configured.
   */
  isOwnMessage: boolean;
  variant: ChatVariant;
  density: ChatDensity;
}
