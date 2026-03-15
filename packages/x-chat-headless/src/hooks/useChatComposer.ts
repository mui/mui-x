'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';
import { chatSelectors } from '../selectors';
import type { ChatDraftAttachment } from '../types/chat-entities';
import type { ChatInternalState } from '../types/chat-state';
import { createLocalId } from '../internals/createLocalId';
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

function createAttachmentPreviewUrl(file: File) {
  if (!file.type.startsWith('image/')) {
    return undefined;
  }

  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return undefined;
  }

  return URL.createObjectURL(file);
}

function revokeAttachmentPreviewUrl(previewUrl: string) {
  if (typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
    return;
  }

  URL.revokeObjectURL(previewUrl);
}

export function useChatComposer<Cursor = string>(): UseChatComposerValue {
  const store = useChatStore<Cursor>();
  const { actions } = useChatRuntimeContext<Cursor>();
  const ownedPreviewUrlsRef = React.useRef(new Map<string, string>());
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

  React.useEffect(() => {
    const activeAttachmentIds = new Set(attachments.map((attachment) => attachment.localId));

    for (const [localId, previewUrl] of ownedPreviewUrlsRef.current.entries()) {
      if (activeAttachmentIds.has(localId)) {
        continue;
      }

      revokeAttachmentPreviewUrl(previewUrl);
      ownedPreviewUrlsRef.current.delete(localId);
    }
  }, [attachments]);

  React.useEffect(
    () => () => {
      for (const previewUrl of ownedPreviewUrlsRef.current.values()) {
        revokeAttachmentPreviewUrl(previewUrl);
      }

      ownedPreviewUrlsRef.current.clear();
    },
    [],
  );

  const addAttachment = React.useCallback(
    (file: File) => {
      const localId = createLocalId();
      const previewUrl = createAttachmentPreviewUrl(file);

      if (previewUrl) {
        ownedPreviewUrlsRef.current.set(localId, previewUrl);
      }

      store.addComposerAttachment({
        localId,
        file,
        previewUrl,
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

    if (store.state.isStreaming || store.state.composerIsComposing || nextValue.trim() === '') {
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
