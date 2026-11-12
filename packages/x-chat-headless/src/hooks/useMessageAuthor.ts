'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { resolveMessageAuthor } from '../internals/messageAuthor';
import { chatSelectors } from '../selectors';
import { useChatStore } from './useChatStore';

export function useMessageAuthor(messageId: string) {
  const store = useChatStore();
  const localeText = useChatLocaleText();
  const message = useStore(store, chatSelectors.message, messageId);
  const activeConversation = useStore(store, chatSelectors.activeConversation);

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
    [
      store.parameters,
      localeText.messageAuthorUserLabel,
      localeText.messageAuthorAssistantLabel,
      localeText.messageAuthorSystemLabel,
    ],
  );

  return React.useMemo(
    () =>
      resolveMessageAuthor(message ?? null, {
        currentUser: parametersWithLocale.currentUser,
        members: parametersWithLocale.members,
        activeConversation,
        getMessageAuthorId: parametersWithLocale.getMessageAuthorId,
        getMessageAuthorDisplayName: parametersWithLocale.getMessageAuthorDisplayName,
        getMessageAuthorAvatarUrl: parametersWithLocale.getMessageAuthorAvatarUrl,
        roleDisplayNames: parametersWithLocale.roleDisplayNames,
      }),
    [message, activeConversation, parametersWithLocale],
  );
}
