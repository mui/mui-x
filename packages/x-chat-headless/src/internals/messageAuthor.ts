import type {
  ChatConversation,
  ChatMessage,
  ChatMessageAuthorGetterProps,
  ChatRole,
  ChatUser,
} from '../types/chat-entities';

export interface ResolvedMessageAuthor {
  id?: string;
  displayName?: string;
  avatarUrl?: string;
  isOwnMessage?: boolean;
}

// Final fallback when neither the locale-driven `roleDisplayNames` parameter
// (provided by `useMessageAuthor`) nor any other author signal is available.
// Used for non-React call sites (selectors, store helpers) that don't have a
// `ChatLocaleText` in scope.
const DEFAULT_ROLE_DISPLAY_NAMES: Record<ChatRole, string> = {
  user: 'User',
  assistant: 'Assistant',
  system: 'System',
};

function getRoleDisplayName(
  role: ChatRole | undefined,
  roleDisplayNames: Partial<Record<ChatRole, string>> | undefined,
): string | undefined {
  if (!role) {
    return undefined;
  }
  return roleDisplayNames?.[role] ?? DEFAULT_ROLE_DISPLAY_NAMES[role];
}

export interface ResolveMessageAuthorParameters extends ChatMessageAuthorGetterProps {
  currentUser?: ChatUser;
  members?: ChatUser[];
  activeConversation?: ChatConversation;
  /**
   * Optional locale-driven labels used as the last resort when no other author
   * signal resolves a displayName. `useMessageAuthor` populates this from
   * `localeText.messageAuthor{User,Assistant,System}Label`.
   */
  roleDisplayNames?: Partial<Record<ChatRole, string>>;
}

function normalizeOptionalString(value: string | null | undefined): string | undefined {
  return value == null || value === '' ? undefined : value;
}

function resolveMessageAuthorId(
  message: ChatMessage,
  parameters: ChatMessageAuthorGetterProps,
): string | undefined {
  return normalizeOptionalString(
    parameters.getMessageAuthorId?.(message) ?? message.author?.id ?? undefined,
  );
}

function resolveMatchedMember(
  authorId: string | undefined,
  parameters: ResolveMessageAuthorParameters,
): ChatUser | undefined {
  if (!authorId) {
    return undefined;
  }

  if (parameters.currentUser?.id === authorId) {
    return parameters.currentUser;
  }

  const member = parameters.members?.find((candidate) => candidate.id === authorId);
  if (member) {
    return member;
  }

  return parameters.activeConversation?.participants?.find(
    (candidate) => candidate.id === authorId,
  );
}

export function resolveMessageAuthor(
  message: ChatMessage | null,
  parameters: ResolveMessageAuthorParameters,
): ResolvedMessageAuthor | null {
  if (!message) {
    return null;
  }

  const id = resolveMessageAuthorId(message, parameters);
  const matchedMember = resolveMatchedMember(id, parameters);
  // Display-name fallback chain:
  //   1. consumer getter (`getMessageAuthorDisplayName`)
  //   2. per-message `author.displayName`
  //   3. matched member's `displayName`
  //   4. `currentUser.displayName` (only for `role: 'user'` messages that have
  //      no explicit author identity — this lets a `currentUser` configured at
  //      the ChatProvider level retroactively name outgoing messages that were
  //      sent without per-message author metadata)
  //   5. locale-driven role label (`messageAuthor{User,Assistant,System}Label`)
  const currentUserFallback =
    message.role === 'user' && id == null ? parameters.currentUser?.displayName : undefined;
  const displayName =
    normalizeOptionalString(
      parameters.getMessageAuthorDisplayName?.(message) ??
        message.author?.displayName ??
        matchedMember?.displayName ??
        currentUserFallback,
    ) ?? getRoleDisplayName(message.role, parameters.roleDisplayNames);
  const avatarUrl = normalizeOptionalString(
    parameters.getMessageAuthorAvatarUrl?.(message) ??
      message.author?.avatarUrl ??
      matchedMember?.avatarUrl,
  );

  if (id == null && displayName == null && avatarUrl == null) {
    return null;
  }

  // When `currentUser` is configured, the author's id determines ownership.
  // Otherwise fall back to the role so single-user-vs-assistant chats — where
  // messages typically carry no author info — keep the legacy alignment.
  const isOwnMessage =
    parameters.currentUser?.id != null
      ? id != null && parameters.currentUser.id === id
      : message.role === 'user';

  return {
    id,
    displayName,
    avatarUrl,
    isOwnMessage,
  };
}

export function getMessageWithResolvedAuthor(
  message: ChatMessage | null,
  parameters: ResolveMessageAuthorParameters,
): ChatMessage | null {
  if (!message) {
    return null;
  }

  const resolvedAuthor = resolveMessageAuthor(message, parameters);
  if (!resolvedAuthor) {
    return message;
  }

  const nextAuthor = {
    ...(message.author ?? {}),
    ...(resolvedAuthor.id != null ? { id: resolvedAuthor.id } : {}),
    ...(resolvedAuthor.displayName != null ? { displayName: resolvedAuthor.displayName } : {}),
    ...(resolvedAuthor.avatarUrl != null ? { avatarUrl: resolvedAuthor.avatarUrl } : {}),
  } as ChatUser;

  const authorChanged =
    message.author?.id !== nextAuthor.id ||
    message.author?.displayName !== nextAuthor.displayName ||
    message.author?.avatarUrl !== nextAuthor.avatarUrl;

  if (!authorChanged) {
    return message;
  }

  return {
    ...message,
    author: nextAuthor,
  };
}

export function getMessageAuthorGroupingKey(
  message: ChatMessage | null,
  parameters: ResolveMessageAuthorParameters,
): string | undefined {
  if (!message) {
    return undefined;
  }

  return resolveMessageAuthor(message, parameters)?.id ?? message.role ?? undefined;
}
