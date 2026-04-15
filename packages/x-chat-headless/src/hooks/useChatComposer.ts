'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';
import { chatSelectors } from '../selectors';
import type { ChatDraftAttachment } from '../types/chat-entities';
import type { ChatInternalState } from '../types/chat-state';
import type { ChatMessagePart } from '../types/chat-message-parts';
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
    const hasText = nextValue.trim() !== '';
    const hasAttachments = nextAttachments.length > 0;

    if (
      store.state.isStreaming ||
      store.state.composerIsComposing ||
      (!hasText && !hasAttachments)
    ) {
      return;
    }

    const parts: ChatMessagePart[] = [];

    if (hasText) {
      parts.push({ type: 'text', text: nextValue });
    }

    for (const attachment of nextAttachments) {
      parts.push({
        type: 'file',
        mediaType: attachment.file.type || 'application/octet-stream',
        url: attachment.previewUrl ?? URL.createObjectURL(attachment.file),
        filename: attachment.file.name,
      });
    }

    const messageId = createLocalId();

    // Optimistic clear: release preview URL ownership and clear composer
    // immediately so the UI feels responsive.  The URLs are still
    // referenced by the message parts we are about to send, so we must
    // NOT revoke them — just stop tracking ownership.
    for (const attachment of nextAttachments) {
      ownedPreviewUrlsRef.current.delete(attachment.localId);
    }
    store.clearComposer();

    await actions.sendMessage({
      id: messageId,
      parts,
      attachments: [...nextAttachments],
      author: store.currentUser,
    });

    // If the send errored, restore the draft so the user can retry —
    // but only when the composer is still empty (the user hasn't started
    // typing a new message while the send was in flight).
    const messageStatus = store.state.messagesById[messageId]?.status;

    if (
      messageStatus === 'error' &&
      store.state.composerValue === '' &&
      store.state.composerAttachments.length === 0
    ) {
      store.setComposerValue(nextValue);
      for (const attachment of nextAttachments) {
        store.addComposerAttachment(attachment);
        // Re-claim preview URL ownership so cleanup revokes them if needed.
        if (attachment.previewUrl) {
          ownedPreviewUrlsRef.current.set(attachment.localId, attachment.previewUrl);
        }
      }
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
