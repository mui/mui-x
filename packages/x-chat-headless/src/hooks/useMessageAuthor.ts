'use client';
import { useStore } from '@mui/x-internals/store';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

export function useMessageAuthor(messageId: string) {
  const store = useChatStore();

  return useStore(store, chatSelectors.messageAuthor, messageId, store.parameters);
}
