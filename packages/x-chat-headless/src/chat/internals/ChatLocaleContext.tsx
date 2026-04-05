'use client';
import * as React from 'react';
import { CHAT_DEFAULT_LOCALE_TEXT, type ChatLocaleText } from './chatLocaleText';

const ChatLocaleContext = React.createContext<ChatLocaleText>(CHAT_DEFAULT_LOCALE_TEXT);

export function ChatLocaleProvider(props: {
  children: React.ReactNode;
  localeText?: Partial<ChatLocaleText>;
}) {
  const { children, localeText } = props;
  const value = React.useMemo<ChatLocaleText>(
    () => ({
      ...CHAT_DEFAULT_LOCALE_TEXT,
      ...localeText,
    }),
    [localeText],
  );

  return <ChatLocaleContext.Provider value={value}>{children}</ChatLocaleContext.Provider>;
}

export function useChatLocaleText() {
  return React.useContext(ChatLocaleContext);
}
