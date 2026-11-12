'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { resolveMessageAuthor } from '../internals/messageAuthor';
import { chatSelectors } from '../selectors';
import type { ChatInternalState } from '../types/chat-state';
import { useChatStore } from './useChatStore';

// Rows only need participants, so conversation patches like read state or title don't re-render them.
const selectActiveParticipants = (state: ChatInternalState) =>
  chatSelectors.activeConversation(state)?.participants;

const selectAuthorParametersVersion = (state: ChatInternalState<unknown>) =>
  state.authorParametersVersion;

export function useMessageAuthor(messageId: string) {
  const store = useChatStore();
  const localeText = useChatLocaleText();
  const message = useStore(store, chatSelectors.message, messageId);
  const participants = useStore(store, selectActiveParticipants);
  // `store.parameters` is not reactive; this version changes when author parameters do.
  const authorParametersVersion = useStore(store, selectAuthorParametersVersion);

  // Inject locale-driven role display names into the resolver parameters so the
  // fallback when no author signal is available reflects the active locale.
  const parametersWithLocale = React.useMemo(
    () => ({
      ...store.parameters,
      roleDisplayNames: {
        user: localeText.messageAuthorUserLabel,
        assistant: localeText.messageAuthorAssistantLabel,
        system: localeText.messageAuthorSystemLabel,
        ...store.parameters.roleDisplayNames,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      store,
      authorParametersVersion,
      localeText.messageAuthorUserLabel,
      localeText.messageAuthorAssistantLabel,
      localeText.messageAuthorSystemLabel,
    ],
  );

  return React.useMemo(
    () =>
      resolveMessageAuthor(message ?? null, {
        ...parametersWithLocale,
        activeConversation: { participants },
      }),
    [message, participants, parametersWithLocale],
  );
}
