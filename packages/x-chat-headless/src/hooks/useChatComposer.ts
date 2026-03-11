'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';
import { chatSelectors } from '../selectors';
import type { ChatDraftAttachment } from '../types/chat-entities';
import type { ChatInternalState } from '../types/chat-state';
import { useChatStore } from './useChatStore';

export interface UseChatComposerValue {
  value: string;
  setValue(value: string): void;
  attachments: ChatDraftAttachment[];
  addAttachment(file: File): void;
  removeAttachment(localId: string): void;
  clear(): void;
  submit(): Promise<void>;
  isSubmitting: boolean;
}

function createLocalId() {
  return crypto.randomUUID();
}

export function useChatComposer<Cursor = string>(): UseChatComposerValue {
  const store = useChatStore<Cursor>();
  const { actions } = useChatRuntimeContext<Cursor>();
  const selectComposerValue = chatSelectors.composerValue as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.composerValue>;
  const selectComposerAttachments = chatSelectors.composerAttachments as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.composerAttachments>;
  const selectIsStreaming = chatSelectors.isStreaming as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.isStreaming>;
  const value = useStore(store, selectComposerValue);
  const attachments = useStore(store, selectComposerAttachments);
  const isSubmitting = useStore(store, selectIsStreaming);

  const setValue = React.useCallback(
    (nextValue: string) => {
      store.setComposerValue(nextValue);
    },
    [store],
  );

  const addAttachment = React.useCallback(
    (file: File) => {
      store.addComposerAttachment({
        localId: createLocalId(),
        file,
        status: 'queued',
      });
    },
    [store],
  );

  const removeAttachment = React.useCallback(
    (localId: string) => {
      store.removeComposerAttachment(localId);
    },
    [store],
  );

  const clear = React.useCallback(() => {
    store.clearComposer();
  }, [store]);

  const submit = React.useCallback(async () => {
    const nextValue = store.state.composerValue;
    const nextAttachments = store.state.composerAttachments;

    if (nextValue.trim() === '') {
      return;
    }

    const messageId = createLocalId();

    await actions.sendMessage({
      id: messageId,
      parts: [{ type: 'text', text: nextValue }],
      attachments: [...nextAttachments],
    });

    if (store.state.messagesById[messageId]?.status === 'sent') {
      store.clearComposer();
    }
  }, [actions, store]);

  return React.useMemo(
    () => ({
      value,
      setValue,
      attachments,
      addAttachment,
      removeAttachment,
      clear,
      submit,
      isSubmitting,
    }),
    [addAttachment, attachments, clear, isSubmitting, removeAttachment, setValue, submit, value],
  );
}
