'use client';
import * as React from 'react';
import { useStore, useStoreEffect } from '@mui/x-internals/store';
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
  // URLs the composer currently owns (still attached to the draft).
  const ownedPreviewUrlsRef = React.useRef(new Map<string, string>());
  // URLs that have been transferred to a sent message (#7). Each entry is
  // keyed by `messageId` and holds the local-id → previewUrl mapping for
  // attachments that message references. We revoke them when the message is
  // removed from the store, or on unmount.
  const messageOwnedPreviewUrlsRef = React.useRef(new Map<string, Map<string, string>>());
  const selectComposerValue = chatSelectors.composerValue as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.composerValue>;
  const selectComposerAttachments = chatSelectors.composerAttachments as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.composerAttachments>;
  const selectIsStreaming = chatSelectors.isStreaming as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.isStreaming>;
  const selectMessageIds = chatSelectors.messageIds as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.messageIds>;
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

  // Revoke URLs once the message that owns them is removed from the store.
  useStoreEffect(store, selectMessageIds, (previousIds, nextIds) => {
    if (messageOwnedPreviewUrlsRef.current.size === 0) {
      return;
    }

    const nextIdSet = new Set(nextIds);

    for (const messageId of previousIds) {
      if (nextIdSet.has(messageId)) {
        continue;
      }

      const urlMap = messageOwnedPreviewUrlsRef.current.get(messageId);

      if (!urlMap) {
        continue;
      }

      for (const previewUrl of urlMap.values()) {
        revokeAttachmentPreviewUrl(previewUrl);
      }

      messageOwnedPreviewUrlsRef.current.delete(messageId);
    }
  });

  React.useEffect(
    () => () => {
      for (const previewUrl of ownedPreviewUrlsRef.current.values()) {
        revokeAttachmentPreviewUrl(previewUrl);
      }
      ownedPreviewUrlsRef.current.clear();

      for (const urlMap of messageOwnedPreviewUrlsRef.current.values()) {
        for (const previewUrl of urlMap.values()) {
          revokeAttachmentPreviewUrl(previewUrl);
        }
      }
      messageOwnedPreviewUrlsRef.current.clear();
    },
    [],
  );

  const addAttachment = React.useCallback(
    (file: File) => {
      const localId = createLocalId();
      const previewUrl = createAttachmentPreviewUrl(file);

      try {
        store.addComposerAttachment({
          localId,
          file,
          previewUrl,
          status: 'queued',
        });

        if (previewUrl) {
          ownedPreviewUrlsRef.current.set(localId, previewUrl);
        }
      } catch (error) {
        if (previewUrl) {
          revokeAttachmentPreviewUrl(previewUrl);
        }

        throw error;
      }
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

    // Optimistic clear: transfer preview URL ownership from the composer to
    // the outgoing message, then clear the composer immediately so the UI
    // feels responsive. The URLs are still referenced by the message parts
    // we're about to send, so we must NOT revoke them now (#7) — they live
    // until the message itself is removed from the store (or the composer
    // unmounts).
    const transferredUrls = new Map<string, string>();
    for (const attachment of nextAttachments) {
      const ownedUrl = ownedPreviewUrlsRef.current.get(attachment.localId);
      if (ownedUrl) {
        transferredUrls.set(attachment.localId, ownedUrl);
        ownedPreviewUrlsRef.current.delete(attachment.localId);
      }
    }
    if (transferredUrls.size > 0) {
      messageOwnedPreviewUrlsRef.current.set(messageId, transferredUrls);
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
      // Reclaim ownership of the transferred URLs back to the composer so
      // they're cleaned up via the composer-attachment lifecycle if the user
      // eventually removes them.
      const previouslyTransferred = messageOwnedPreviewUrlsRef.current.get(messageId);
      messageOwnedPreviewUrlsRef.current.delete(messageId);

      store.setComposerValue(nextValue);
      for (const attachment of nextAttachments) {
        store.addComposerAttachment(attachment);
        const previewUrl = previouslyTransferred?.get(attachment.localId) ?? attachment.previewUrl;
        if (previewUrl) {
          ownedPreviewUrlsRef.current.set(attachment.localId, previewUrl);
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
