import type {
  ChatConversation,
  ChatMessage,
  ChatMessageAuthorGetterProps,
  ChatUser,
} from '../types/chat-entities';

export interface ResolvedMessageAuthor {
  id?: string;
  displayName?: string;
  avatarUrl?: string;
}

interface ResolveMessageAuthorParameters extends ChatMessageAuthorGetterProps {
  currentUser?: ChatUser;
  members?: ChatUser[];
  activeConversation?: ChatConversation;
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

  return parameters.activeConversation?.participants?.find((candidate) => candidate.id === authorId);
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
  const displayName = normalizeOptionalString(
    parameters.getMessageAuthorDisplayName?.(message) ??
      message.author?.displayName ??
      matchedMember?.displayName,
  );
  const avatarUrl = normalizeOptionalString(
    parameters.getMessageAuthorAvatarUrl?.(message) ??
      message.author?.avatarUrl ??
      matchedMember?.avatarUrl,
  );

  if (id == null && displayName == null && avatarUrl == null) {
    return null;
  }

  return {
    id,
    displayName,
    avatarUrl,
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
