'use client';
import type { ChatStore } from '../store';
import { useChatStoreContext } from '../internals/useChatStoreContext';

export function useChatStore<Cursor = string>(): ChatStore<Cursor> {
  const store = useChatStoreContext<Cursor>(true);

  if (store == null) {
    throw new Error('MUI X Chat: useChatStore must be used within a <ChatProvider> component');
  }

  return store;
}
