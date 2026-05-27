'use client';
import { useStore } from '@mui/x-internals/store';
import type { ChatMessage } from '../types/chat-entities';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

export function useMessageIds(): string[] {
  const store = useChatStore();

  return useStore(store, chatSelectors.messageIds);
}

export function useMessage(id: string): ChatMessage | null {
  const store = useChatStore();
  const message = useStore(store, chatSelectors.message, id);

  return message ?? null;
}
