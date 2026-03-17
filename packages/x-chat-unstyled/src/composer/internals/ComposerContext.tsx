'use client';
import * as React from 'react';
import type { ChatError, ChatDraftAttachment } from '@mui/x-chat-headless';
import type { ComposerOwnerState } from '../composer.types';

export interface ComposerContextValue extends ComposerOwnerState {
  value: string;
  setValue(value: string): void;
  submit(): Promise<void>;
  addAttachment(file: File): void;
  attachments: ChatDraftAttachment[];
  error: ChatError | null;
  setComposerIsComposing(value: boolean): void;
}

const defaultOwnerState: ComposerOwnerState = {
  isSubmitting: false,
  hasValue: false,
  isStreaming: false,
  attachmentCount: 0,
  disabled: false,
};

const ComposerContext = React.createContext<ComposerContextValue>({
  ...defaultOwnerState,
  value: '',
  setValue: () => {},
  submit: async () => {},
  addAttachment: () => {},
  attachments: [],
  error: null,
  setComposerIsComposing: () => {},
});

export function ComposerContextProvider(props: {
  children: React.ReactNode;
  value: ComposerContextValue;
}) {
  const { children, value } = props;

  return <ComposerContext.Provider value={value}>{children}</ComposerContext.Provider>;
}

export function useComposerContext() {
  return React.useContext(ComposerContext);
}
