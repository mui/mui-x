'use client';
import { useStore } from '@mui/x-internals/store';
import type { ChatError } from '../types/chat-error';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

/**
 * Returns the `ChatError` associated with the given message id, or `null` when
 * there is no error for that message. Message-scoped errors are stored
 * independently from the global runtime error so multiple failed messages can
 * retain their own error state at the same time.
 */
export function useMessageError(messageId: string): ChatError | null {
  const store = useChatStore();
  const error = useStore(store, chatSelectors.messageError, messageId);

  return error ?? null;
}
