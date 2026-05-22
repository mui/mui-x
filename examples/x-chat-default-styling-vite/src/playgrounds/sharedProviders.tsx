import * as React from 'react';
import {
  ChatProvider,
  useChatStore,
  type ChatAdapter,
  type ChatConversation,
  type ChatErrorCode,
  type ChatMessage,
  type ChatUser,
  type ChatVariant,
  type ChatDensity,
} from '@mui/x-chat/headless';
import { ChatVariantProvider, ChatDensityProvider } from '@mui/x-chat/headless';
import { demoMembers, users } from '../data';
import { createScenarioAdapter, createScenarioDraftAttachments } from '../scenarios/helpers';
import type { ScenarioAttachmentSpec, ScenarioFixture } from '../scenarios/types';

/**
 * No-op adapter — every playground uses it because we never actually send.
 * Returns an empty stream so submit handlers don't blow up if invoked.
 */
export const noopAdapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

export interface ScopedChatProps {
  conversations: ChatConversation[];
  messages?: ChatMessage[];
  activeConversationId?: string;
  members?: ChatUser[];
  currentUser?: ChatUser;
  adapter?: ChatAdapter;
  children: React.ReactNode;
}

/**
 * Builds a stable cache key from the conversations + messages so we can re-mount
 * the provider when the seed data identity changes. This avoids the
 * "changing the default … state of an uncontrolled ChatProvider" warning that
 * fires when sliders / toggles regenerate the `initial…` arrays after mount.
 */
function deriveSeedKey(
  conversations: ChatConversation[],
  messages: ChatMessage[],
  activeConversationId: string | undefined,
  currentUser: ChatUser,
  members: ChatUser[],
) {
  const memberKey = members
    .map((member) => `${member.id}|${member.displayName ?? ''}|${member.role ?? ''}`)
    .join('::');
  const convoKey = conversations
    .map(
      (c) =>
        `${c.id}|${c.unreadCount ?? 0}|${c.readState ?? ''}|${c.title ?? ''}|${c.subtitle ?? ''}|${c.lastMessageAt ?? ''}`,
    )
    .join('::');
  // Hash every text part fully (including timestamps + status) so that toggles
  // which mutate fixture timestamps still bust the key and re-mount the provider.
  const messageKey = messages
    .map(
      (m) =>
        `${m.id}|${m.role}|${m.status ?? ''}|${m.createdAt ?? ''}|${m.author?.id ?? ''}|${m.parts
          .map((p) => {
            if (p.type === 'text' || p.type === 'reasoning') {
              return `${p.type}:${p.text}:${p.state ?? ''}`;
            }
            try {
              return JSON.stringify(p);
            } catch {
              return p.type;
            }
          })
          .join('§')}`,
    )
    .join('::');
  return `${activeConversationId ?? ''}~~${currentUser.id}~~${memberKey}~~${convoKey}~~${messageKey}`;
}

/**
 * Spins up a fresh ChatProvider for one playground card so per-card state
 * stays isolated.
 *
 * The provider remounts (via `key`) when the seed data identity changes —
 * playgrounds that regenerate their fixtures from sliders / toggles rely on
 * this so the new arrays land as fresh `initial…` props instead of triggering
 * the uncontrolled-state warning.
 */
export function ScopedChat({
  conversations,
  messages = [],
  activeConversationId,
  members,
  currentUser = users.me,
  adapter = noopAdapter,
  children,
}: ScopedChatProps) {
  const resolvedMembers = members ?? demoMembers;
  const seedKey = React.useMemo(
    () =>
      deriveSeedKey(conversations, messages, activeConversationId, currentUser, resolvedMembers),
    [conversations, messages, activeConversationId, currentUser, resolvedMembers],
  );
  return (
    <ChatProvider
      key={seedKey}
      adapter={adapter}
      currentUser={currentUser}
      members={resolvedMembers}
      initialConversations={conversations}
      initialMessages={messages}
      initialActiveConversationId={activeConversationId ?? conversations[0]?.id}
    >
      {children}
    </ChatProvider>
  );
}

export interface ScopedScenarioChatProps {
  scenario: ScenarioFixture;
  conversations?: ChatConversation[];
  messages?: ChatMessage[];
  activeConversationId?: string;
  members?: ChatUser[];
  currentUser?: ChatUser;
  adapter?: ChatAdapter;
  children: React.ReactNode;
}

/**
 * Mounts a scenario fixture with its real adapter, members, conversations,
 * and messages. ScenarioWorkbench can wrap its preview in this provider
 * without duplicating the setup logic from each playground.
 */
export function ScopedScenarioChat({
  scenario,
  conversations,
  messages,
  activeConversationId,
  members,
  currentUser,
  adapter,
  children,
}: ScopedScenarioChatProps) {
  const scenarioAdapter = React.useMemo(
    () => adapter ?? createScenarioAdapter(scenario),
    [adapter, scenario],
  );

  return (
    <ScopedChat
      adapter={scenarioAdapter}
      currentUser={currentUser ?? scenario.currentUser}
      members={members ?? scenario.members}
      conversations={conversations ?? scenario.conversations}
      messages={messages ?? scenario.messages}
      activeConversationId={activeConversationId ?? scenario.activeConversationId}
    >
      {children}
    </ScopedChat>
  );
}

/**
 * Lifts variant/density into context so components without explicit props
 * pick them up the same way ChatBox sets them.
 */
export function ChatChrome({
  variant,
  density,
  children,
}: {
  variant: ChatVariant;
  density: ChatDensity;
  children: React.ReactNode;
}) {
  return (
    <ChatVariantProvider variant={variant}>
      <ChatDensityProvider density={density}>{children}</ChatDensityProvider>
    </ChatVariantProvider>
  );
}

interface MessageErrorEffectProps {
  messageId: string;
  enabled: boolean;
  errorCode?: ChatErrorCode;
  errorMessage?: string;
  retryable?: boolean;
}

/**
 * Toggles a message-level error inside the store. Used by the error playground.
 */
export function MessageErrorEffect({
  messageId,
  enabled,
  errorCode = 'SEND_ERROR',
  errorMessage = 'Could not reach the chat server.',
  retryable = true,
}: MessageErrorEffectProps) {
  const store = useChatStore();
  React.useEffect(() => {
    if (enabled) {
      store.setMessageError(messageId, {
        code: errorCode,
        source: 'send',
        message: errorMessage,
        recoverable: true,
        retryable,
      });
    } else {
      store.setMessageError(messageId, null);
    }
    return () => {
      store.setMessageError(messageId, null);
    };
  }, [store, messageId, enabled, errorCode, errorMessage, retryable]);
  return null;
}

interface ComposerAttachmentsEffectProps {
  /** Names + sizes used to fabricate fake `File` objects. */
  files: ScenarioAttachmentSpec[];
}

/**
 * Seeds composer-draft attachments into the store so `ChatComposerAttachmentList`
 * has something to render. Uses fabricated `File` objects so no real upload happens.
 */
export function ComposerAttachmentsEffect({ files }: ComposerAttachmentsEffectProps) {
  const store = useChatStore();
  React.useEffect(() => {
    store.setComposerAttachments(createScenarioDraftAttachments(files));
    return () => {
      store.setComposerAttachments([]);
    };
  }, [store, files]);
  return null;
}

interface TypingEffectProps {
  conversationId: string;
  userIds: string[];
}

/**
 * Marks a list of users as typing in the active conversation. Used by the
 * typing-indicator playground.
 */
export function TypingEffect({ conversationId, userIds }: TypingEffectProps) {
  const store = useChatStore();
  React.useEffect(() => {
    userIds.forEach((id) => store.setTypingUser(conversationId, id, true));
    return () => {
      userIds.forEach((id) => store.setTypingUser(conversationId, id, false));
    };
  }, [store, conversationId, userIds]);
  return null;
}
