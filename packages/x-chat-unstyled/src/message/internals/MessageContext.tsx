'use client';
import * as React from 'react';
import type { MessageOwnerState } from '../message.types';

const MessageContext = React.createContext<MessageOwnerState>({
  messageId: '',
  message: null,
  role: undefined,
  status: undefined,
  streaming: false,
  error: false,
  isGrouped: false,
  variant: 'default',
  showAvatar: false,
});

export function MessageContextProvider(props: {
  children: React.ReactNode;
  value: MessageOwnerState;
}) {
  const { children, value } = props;

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export function useMessageContext() {
  return React.useContext(MessageContext);
}
