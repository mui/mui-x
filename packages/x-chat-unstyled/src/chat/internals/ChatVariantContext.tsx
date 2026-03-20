'use client';
import * as React from 'react';

export type ChatVariant = 'default' | 'compact';

const ChatVariantContext = React.createContext<ChatVariant>('default');

export function ChatVariantProvider(props: {
  children: React.ReactNode;
  variant: ChatVariant;
}) {
  const { children, variant } = props;

  return <ChatVariantContext.Provider value={variant}>{children}</ChatVariantContext.Provider>;
}

export function useChatVariant(): ChatVariant {
  return React.useContext(ChatVariantContext);
}
