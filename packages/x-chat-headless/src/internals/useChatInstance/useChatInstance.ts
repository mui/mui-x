'use client';
import * as React from 'react';
import { useStoreEffect } from '@mui/x-internals/store';
import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import { chatSelectors } from '../../selectors';
import {
  ChatStore,
  type ChatStoreParameters,
  type ControlledModel,
  type ChatStoreConstructor,
} from '../../store';
import type { ChatInternalState } from '../../types';

export function useChatInstance<Cursor = string>(
  parameters: ChatStoreParameters<Cursor>,
  StoreClass?: ChatStoreConstructor<Cursor>,
): ChatStore<Cursor> {
  const ResolvedStoreClass = StoreClass ?? ChatStore;
  const syncingControlledModelsRef = React.useRef<Set<ControlledModel> | null>(null);
  const storeRef = React.useRef<ChatStore<Cursor> | null>(null);

  if (storeRef.current == null) {
    storeRef.current = new ResolvedStoreClass(parameters);
  }

  const store = storeRef.current;
  const selectMessages = chatSelectors.messages as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.messages>;
  const selectConversations = chatSelectors.conversations as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.conversations>;
  const selectActiveConversationId = chatSelectors.activeConversationId as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.activeConversationId>;
  const selectComposerValue = chatSelectors.composerValue as (
    state: ChatInternalState<Cursor>,
  ) => ReturnType<typeof chatSelectors.composerValue>;

  useAssertModelConsistency({
    warningPrefix: 'MUI X Chat',
    componentName: 'ChatProvider',
    propName: 'messages',
    controlled: parameters.messages,
    defaultValue: parameters.initialMessages ?? [],
  });
  useAssertModelConsistency({
    warningPrefix: 'MUI X Chat',
    componentName: 'ChatProvider',
    propName: 'conversations',
    controlled: parameters.conversations,
    defaultValue: parameters.initialConversations ?? [],
  });
  useAssertModelConsistency({
    warningPrefix: 'MUI X Chat',
    componentName: 'ChatProvider',
    propName: 'activeConversationId',
    controlled: parameters.activeConversationId,
    defaultValue: parameters.initialActiveConversationId,
  });
  useAssertModelConsistency({
    warningPrefix: 'MUI X Chat',
    componentName: 'ChatProvider',
    propName: 'composerValue',
    controlled: parameters.composerValue,
    defaultValue: parameters.initialComposerValue ?? '',
  });

  // Resync controlled models when the parameters reference changes.
  React.useEffect(() => {
    const syncingControlledModels = new Set<ControlledModel>();

    if (parameters.messages !== undefined) {
      syncingControlledModels.add('messages');
    }

    if (parameters.conversations !== undefined) {
      syncingControlledModels.add('conversations');
    }

    if (parameters.activeConversationId !== undefined) {
      syncingControlledModels.add('activeConversationId');
    }

    if (parameters.composerValue !== undefined) {
      syncingControlledModels.add('composerValue');
    }

    syncingControlledModelsRef.current = syncingControlledModels;
    store.updateStateFromParameters(parameters);
    syncingControlledModelsRef.current = null;
  }, [parameters, store]);

  // When a controlled model was mutated internally (e.g. addMessage in controlled mode),
  // the parent re-renders but may pass the same controlled prop references, so the
  // effect above won't fire. Resync here to restore the parent's authoritative values.
  React.useEffect(() => {
    if (!store.hasDirtyControlledModels) {
      return;
    }

    const syncingControlledModels = new Set<ControlledModel>();

    if (parameters.messages !== undefined) {
      syncingControlledModels.add('messages');
    }

    if (parameters.conversations !== undefined) {
      syncingControlledModels.add('conversations');
    }

    if (parameters.activeConversationId !== undefined) {
      syncingControlledModels.add('activeConversationId');
    }

    if (parameters.composerValue !== undefined) {
      syncingControlledModels.add('composerValue');
    }

    syncingControlledModelsRef.current = syncingControlledModels;
    store.updateStateFromParameters(parameters);
    syncingControlledModelsRef.current = null;
  });

  useStoreEffect(store, selectMessages, (_, nextMessages) => {
    if (!syncingControlledModelsRef.current?.has('messages')) {
      store.parameters.onMessagesChange?.(nextMessages);
    }
  });

  useStoreEffect(store, selectConversations, (_, nextConversations) => {
    if (!syncingControlledModelsRef.current?.has('conversations')) {
      store.parameters.onConversationsChange?.(nextConversations);
    }
  });

  useStoreEffect(store, selectActiveConversationId, (_, nextActiveConversationId) => {
    if (!syncingControlledModelsRef.current?.has('activeConversationId')) {
      store.parameters.onActiveConversationChange?.(nextActiveConversationId);
    }
  });

  useStoreEffect(store, selectComposerValue, (_, nextComposerValue) => {
    if (!syncingControlledModelsRef.current?.has('composerValue')) {
      store.parameters.onComposerValueChange?.(nextComposerValue);
    }
  });

  React.useEffect(() => store.disposeEffect(), [store]);

  return store;
}
