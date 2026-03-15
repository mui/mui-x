'use client';
import * as React from 'react';
import type { ThreadOwnerState } from '../thread.types';

const ThreadContext = React.createContext<ThreadOwnerState>({
  conversationId: undefined,
  hasConversation: false,
  conversation: null,
});

export function ThreadContextProvider(props: {
  children: React.ReactNode;
  value: ThreadOwnerState;
}) {
  const { children, value } = props;

  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>;
}

export function useThreadContext() {
  return React.useContext(ThreadContext);
}
