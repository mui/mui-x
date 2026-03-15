'use client';
import * as React from 'react';

export interface MessageListContextValue {
  isAtBottom: boolean;
  scrollToBottom(): void;
}

const MessageListContext = React.createContext<MessageListContextValue>({
  isAtBottom: true,
  scrollToBottom: () => {},
});

export function MessageListContextProvider(props: {
  children: React.ReactNode;
  value: MessageListContextValue;
}) {
  const { children, value } = props;

  return <MessageListContext.Provider value={value}>{children}</MessageListContext.Provider>;
}

export function useMessageListContext() {
  return React.useContext(MessageListContext);
}

