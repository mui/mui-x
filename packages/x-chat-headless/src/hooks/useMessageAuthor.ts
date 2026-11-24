'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { resolveMessageAuthor } from '../internals/messageAuthor';
import { chatSelectors } from '../selectors';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatInternalState } from '../types/chat-state';
import { useChatStore } from './useChatStore';

// Rows only need participants, so conversation patches like read state or title don't re-render them.
export const selectActiveParticipants = (state: ChatInternalState) =>
  chatSelectors.activeConversation(state)?.participants;

const selectAuthorParametersVersion = (state: ChatInternalState<unknown>) =>
  state.authorParametersVersion;

// Callers pass the message they already subscribe to with `useMessage`.
export function useMessageAuthor(message: ChatMessage | null) {
  const store = useChatStore();
  const localeText = useChatLocaleText();
  const participants = useStore(store, selectActiveParticipants);
  // `store.parameters` is not reactive; this version changes when author parameters do.
  const authorParametersVersion = useStore(store, selectAuthorParametersVersion);

  // Read `store.parameters` inside the memo so rows cache only the resolved author,
  // not the parameter arrays of the render that built it.
  return React.useMemo(
    () => {
      const { roleDisplayNames } = store.parameters;
      return resolveMessageAuthor(message, {
        ...store.parameters,
        activeConversation: { participants },
        // `??` per role, so an explicit `undefined` override falls back to the locale like a missing key.
        roleDisplayNames: {
          user: roleDisplayNames?.user ?? localeText.messageAuthorUserLabel,
          assistant: roleDisplayNames?.assistant ?? localeText.messageAuthorAssistantLabel,
          system: roleDisplayNames?.system ?? localeText.messageAuthorSystemLabel,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      message,
      participants,
      store,
      authorParametersVersion,
      localeText.messageAuthorUserLabel,
      localeText.messageAuthorAssistantLabel,
      localeText.messageAuthorSystemLabel,
    ],
  );
}
