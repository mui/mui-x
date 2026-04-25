'use client';
import { useStore } from '@mui/x-internals/store';
import type { ChatError } from '../types/chat-error';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

/**
 * Returns the `ChatError` associated with the given message id, or `null` when
 * there is no error for that message. An error is considered associated with
 * the message when `state.error.details.messageId` matches the id and the
 * corresponding message has `status === 'error'`.
 */
export function useMessageError(messageId: string): ChatError | null {
  const store = useChatStore();
  const error = useStore(store, chatSelectors.messageError, messageId);

  return error ?? null;
}
