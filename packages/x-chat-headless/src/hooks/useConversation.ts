'use client';
import { useStore } from '@mui/x-internals/store';
import type { ChatConversation } from '../types/chat-entities';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

export function useConversations(): ChatConversation[] {
  const store = useChatStore();

  return useStore(store, chatSelectors.conversations);
}

export function useConversation(id: string): ChatConversation | null {
  const store = useChatStore();
  const conversation = useStore(store, chatSelectors.conversation, id);

  return conversation ?? null;
}
