'use client';
import * as React from 'react';
import type { ChatStore } from '../../store';

export type ChatStoreInContext<Cursor = string> = ChatStore<Cursor>;

export const ChatStoreContext = React.createContext<ChatStoreInContext<any> | null>(null);

export function useChatStoreContext<Cursor = string>(
  optional: true,
): ChatStoreInContext<Cursor> | null;
export function useChatStoreContext<Cursor = string>(optional?: false): ChatStoreInContext<Cursor>;
export function useChatStoreContext<Cursor = string>(optional = false) {
  const context = React.useContext(ChatStoreContext);

  if (context == null && !optional) {
    throw new Error(
      'MUI X Chat: useChatStoreContext must be used within a <ChatProvider> component',
    );
  }

  return context as ChatStoreInContext<Cursor> | null;
}
