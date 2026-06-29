'use client';
import * as React from 'react';
import type { ConversationOwnerState } from '../conversation.types';

const ConversationContext = React.createContext<ConversationOwnerState>({
  conversationId: undefined,
  hasConversation: false,
  conversation: null,
});

export function ConversationContextProvider(props: {
  children: React.ReactNode;
  value: ConversationOwnerState;
}) {
  const { children, value } = props;

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
}

export function useConversationContext() {
  return React.useContext(ConversationContext);
}
