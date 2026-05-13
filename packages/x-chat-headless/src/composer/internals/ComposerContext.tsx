'use client';
import * as React from 'react';
import type { ChatError } from '../../types/chat-error';
import type { ChatDraftAttachment, ChatAttachmentsConfig } from '../../types/chat-entities';
import type { ComposerOwnerState } from '../composer.types';

export interface ComposerContextValue extends ComposerOwnerState {
  value: string;
  setValue(value: string): void;
  submit(): Promise<void>;
  addAttachment(file: File): void;
  removeAttachment(localId: string): void;
  attachments: ChatDraftAttachment[];
  attachmentConfig?: ChatAttachmentsConfig;
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
  removeAttachment: () => {},
  attachments: [],
  attachmentConfig: undefined,
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
