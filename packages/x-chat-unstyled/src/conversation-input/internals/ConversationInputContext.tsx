'use client';
import * as React from 'react';
import type { ChatError, ChatDraftAttachment } from '@mui/x-chat-headless';
import type { ConversationInputOwnerState } from '../conversation-input.types';

export interface ConversationInputContextValue extends ConversationInputOwnerState {
  value: string;
  setValue(value: string): void;
  submit(): Promise<void>;
  addAttachment(file: File): void;
  attachments: ChatDraftAttachment[];
  error: ChatError | null;
  setComposerIsComposing(value: boolean): void;
}

const defaultOwnerState: ConversationInputOwnerState = {
  isSubmitting: false,
  hasValue: false,
  isStreaming: false,
  attachmentCount: 0,
  disabled: false,
};

const ConversationInputContext = React.createContext<ConversationInputContextValue>({
  ...defaultOwnerState,
  value: '',
  setValue: () => {},
  submit: async () => {},
  addAttachment: () => {},
  attachments: [],
  error: null,
  setComposerIsComposing: () => {},
});

export function ConversationInputContextProvider(props: {
  children: React.ReactNode;
  value: ConversationInputContextValue;
}) {
  const { children, value } = props;

  return (
    <ConversationInputContext.Provider value={value}>{children}</ConversationInputContext.Provider>
  );
}

export function useConversationInputContext() {
  return React.useContext(ConversationInputContext);
}
