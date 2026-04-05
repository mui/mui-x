'use client';
import * as React from 'react';

export interface MessageListContextValue {
  isAtBottom: boolean;
  unseenMessageCount: number;
  scrollToBottom(options?: { behavior?: ScrollBehavior }): void;
}

const MessageListContext = React.createContext<MessageListContextValue>({
  isAtBottom: true,
  unseenMessageCount: 0,
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
