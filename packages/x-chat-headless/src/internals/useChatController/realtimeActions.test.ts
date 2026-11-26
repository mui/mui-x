import { describe, expect, it, vi } from 'vitest';
import { ChatStore } from '../../store/ChatStore';
import { createConversationActions } from './conversationActions';
import {
  createRealtimeMessageBuffer,
  REALTIME_MESSAGE_BUFFER_LIMIT,
} from './realtimeMessageBuffer';
import { createRealtimeActions } from './realtimeActions';
import type { ChatAdapter } from '../../adapters';
import type { ChatConversation, ChatMessage } from '../../types/chat-entities';

function asUnknown(store: ChatStore): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}

const baseMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

const updatedMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hello (edited)' }],
};

const conversation1: ChatConversation = { id: 'c1', title: 'General' };
const conversation2: ChatConversation = { id: 'c2', title: 'Support' };

describe('createRealtimeActions', () => {
  describe('handleRealtimeEvent', () => {
    it('message-added: adds message to store', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'message-added', message: baseMessage });

      expect(store.state.messageIds).toEqual(['m1']);
      expect(store.state.messagesById.m1).toEqual(baseMessage);
    });

    it('message-updated: updates existing message in store', () => {
      const store = new ChatStore({ initialMessages: [baseMessage] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'message-updated', message: updatedMessage });

      expect(store.state.messagesById.m1.status).toBe('sent');
      expect(store.state.messagesById.m1.parts[0]).toMatchObject({ text: 'Hello (edited)' });
    });

    it('message-updated: adds message when it does not exist (upsert)', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'message-updated', message: baseMessage });

      expect(store.state.messageIds).toEqual(['m1']);
    });

    it('message-removed: removes message from store', () => {
      const store = new ChatStore({ initialMessages: [baseMessage] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'message-removed', messageId: 'm1' });

      expect(store.state.messageIds).toEqual([]);
      expect(store.state.messagesById.m1).toBeUndefined();
    });

    describe('conversation scoping', () => {
      function createMessage(id: string, conversationId: string, text = id): ChatMessage {
        return { id, role: 'user', conversationId, parts: [{ type: 'text', text }] };
      }

      function getTexts(store: ChatStore) {
        return store.state.messageIds.map((id) => {
          const part = store.state.messagesById[id].parts[0];
          return part.type === 'text' ? part.text : undefined;
        });
      }

      function setup(
        options: {
          initialMessages?: ChatMessage[];
          messages?: ChatMessage[];
          listMessages?: ChatAdapter['listMessages'];
        } = {},
      ) {
        const store = new ChatStore({
          initialConversations: [conversation1, conversation2],
          initialActiveConversationId: 'c1',
          initialMessages: options.initialMessages,
          messages: options.messages,
        });
        const conversationNavigationRequestIdRef = { current: 0 };
        const realtimeMessageBuffer = createRealtimeMessageBuffer();
        const adapter: ChatAdapter = {
          sendMessage: vi.fn().mockResolvedValue(new ReadableStream()),
          listMessages: options.listMessages,
        };
        const runtimeRef = { current: { adapter } };
        const realtimeMessageBufferRef = {
          current: { adapter, buffer: realtimeMessageBuffer },
        };
        const { setActiveConversation } = createConversationActions({
          store,
          runtimeRef,
          setRuntimeError: vi.fn(),
          stopStreaming: vi.fn(),
          conversationNavigationRequestIdRef,
          conversationLoadRequestIdRef: { current: 0 },
          historyLoadRequestIdRef: { current: 0 },
          realtimeMessageBufferRef,
        });
        const { handleRealtimeEvent } = createRealtimeActions({
          store: asUnknown(store),
          conversationNavigationRequestIdRef,
          realtimeMessageBuffer,
        });
        return {
          store,
          handleRealtimeEvent,
          setActiveConversation,
          runtimeRef,
          realtimeMessageBufferRef,
        };
      }

      // Each call returns a pending page that the test resolves by hand.
      function createPendingListMessages() {
        const resolvers: Array<(messages: ChatMessage[]) => void> = [];
        const listMessages = vi.fn(
          () =>
            new Promise<{ messages: ChatMessage[]; hasMore: boolean }>((resolve) => {
              resolvers.push((messages) => resolve({ messages, hasMore: false }));
            }),
        );
        return { listMessages, resolvers };
      }

      it.each(['message-added', 'message-updated'] as const)(
        '%s: keeps messages from another conversation out of the thread',
        (type) => {
          const { store, handleRealtimeEvent } = setup();

          handleRealtimeEvent({ type, message: createMessage('m1', 'c2') });

          expect(store.state.messageIds).toEqual([]);
        },
      );

      it('message-added: adds messages from the active conversation or without a conversation', () => {
        const { store, handleRealtimeEvent } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c1') });
        handleRealtimeEvent({ type: 'message-added', message: { ...baseMessage, id: 'm2' } });

        expect(store.state.messageIds).toEqual(['m1', 'm2']);
      });

      it.each(['message-added', 'message-updated'] as const)(
        '%s: updates a message already in the store from another conversation',
        (type) => {
          const { store, handleRealtimeEvent } = setup({
            initialMessages: [createMessage('m1', 'c2')],
          });

          handleRealtimeEvent({ type, message: createMessage('m1', 'c2', 'updated') });

          expect(getTexts(store)).toEqual(['updated']);
        },
      );

      it('message-added: adds messages with a conversation id when no conversation is active', () => {
        const store = new ChatStore({ initialConversations: [conversation1, conversation2] });
        const { handleRealtimeEvent } = createRealtimeActions({
          store: asUnknown(store),
          conversationNavigationRequestIdRef: { current: 0 },
          realtimeMessageBuffer: createRealtimeMessageBuffer(),
        });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });

        expect(store.state.messageIds).toEqual(['m1']);
      });

      it('replays buffered messages when their conversation opens without listMessages', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        handleRealtimeEvent({ type: 'message-added', message: createMessage('m2', 'c2') });
        handleRealtimeEvent({
          type: 'message-updated',
          message: createMessage('m1', 'c2', 'm1 edited'),
        });
        await setActiveConversation('c2');

        expect(getTexts(store)).toEqual(['m1 edited', 'm2']);

        // The buffer is cleared once applied.
        await setActiveConversation('c1');
        await setActiveConversation('c2');
        expect(store.state.messageIds).toEqual([]);
      });

      it('applies buffered messages on top of the listMessages page', async () => {
        const listMessages = vi.fn().mockResolvedValue({
          messages: [createMessage('m0', 'c2'), createMessage('m1', 'c2', 'm1 listed')],
          hasMore: false,
        });
        const { store, handleRealtimeEvent, setActiveConversation } = setup({ listMessages });

        handleRealtimeEvent({
          type: 'message-added',
          message: createMessage('m1', 'c2', 'm1 buffered'),
        });
        handleRealtimeEvent({ type: 'message-added', message: createMessage('m2', 'c2') });
        await setActiveConversation('c2');

        // The page was requested after the buffered events, so its copy of m1 wins.
        expect(getTexts(store)).toEqual(['m0', 'm1 listed', 'm2']);
      });

      it('applies events for the active conversation at once, even while it loads', async () => {
        const { listMessages } = createPendingListMessages();
        const { store, handleRealtimeEvent, setActiveConversation } = setup({ listMessages });

        void setActiveConversation('c2');
        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });

        expect(store.state.messageIds).toEqual(['m1']);
      });
      it('keeps held messages when their conversation is left before its page loads', async () => {
        const { listMessages, resolvers } = createPendingListMessages();
        const { store, handleRealtimeEvent, setActiveConversation } = setup({ listMessages });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        const firstLoad = setActiveConversation('c2');
        const otherLoad = setActiveConversation('c1');
        const secondLoad = setActiveConversation('c2');

        resolvers[0]([createMessage('m0', 'c2')]);
        resolvers[1]([]);
        resolvers[2]([createMessage('m0', 'c2')]);
        await Promise.all([firstLoad, otherLoad, secondLoad]);

        expect(store.state.messageIds).toEqual(['m0', 'm1']);
      });
      it('does not bring back a message deleted locally after it reached the open thread', async () => {
        const listMessages = vi
          .fn()
          .mockRejectedValueOnce(new Error('offline'))
          .mockResolvedValue({ messages: [] });
        const { store, handleRealtimeEvent, setActiveConversation } = setup({ listMessages });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        await setActiveConversation('c2');
        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        store.removeMessage('m1');
        await setActiveConversation('c1');
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual([]);
      });
      it('keeps held messages for the next open when listMessages fails', async () => {
        const listMessages = vi
          .fn()
          .mockRejectedValueOnce(new Error('offline'))
          .mockResolvedValue({ messages: [] });
        const { store, handleRealtimeEvent, setActiveConversation } = setup({ listMessages });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual([]);

        await setActiveConversation('c1');
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual(['m1']);
      });
      it('keeps held messages for the next open when a change listener leaves the conversation', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        const unsubscribe = store.subscribe((state) => {
          if (state.activeConversationId === 'c2') {
            setActiveConversation('c1');
          }
        });
        await setActiveConversation('c2');
        unsubscribe();

        expect(store.state.activeConversationId).toBe('c1');
        expect(store.state.messageIds).toEqual([]);

        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual(['m1']);
      });
      it('keeps a message sent from a change listener when held messages are replayed', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup({
          initialMessages: [createMessage('old', 'c1')],
        });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        let sent = false;
        store.subscribe((state) => {
          if (!sent && state.activeConversationId === 'c2' && state.messageIds.length === 0) {
            sent = true;
            store.addMessage(createMessage('sent', 'c2'));
          }
        });
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual(['m1', 'sent']);
      });
      it('replays the updated copy when a change listener opens the conversation', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2', 'v1') });
        await setActiveConversation(undefined);
        let opened = false;
        store.subscribe((state) => {
          if (!opened && state.messagesById.m1) {
            opened = true;
            setActiveConversation('c2');
          }
        });
        handleRealtimeEvent({
          type: 'message-updated',
          message: createMessage('m1', 'c2', 'v2'),
        });

        expect(getTexts(store)).toEqual(['v2']);
      });
      it('keeps held messages for the next load when another adapter was only rendered', async () => {
        const { listMessages, resolvers } = createPendingListMessages();
        const { store, handleRealtimeEvent, setActiveConversation, runtimeRef } = setup({
          listMessages,
        });
        const committedRuntime = runtimeRef.current;

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        const loading = setActiveConversation('c2');
        // A render with another adapter: not replayed, as it may be about to commit.
        runtimeRef.current = { adapter: { sendMessage: vi.fn() } };
        resolvers[0]([]);
        await loading;

        expect(store.state.messageIds).toEqual([]);

        // That render never committed: the buffer was not consumed.
        runtimeRef.current = committedRuntime;
        const leaving = setActiveConversation('c1');
        const reloading = setActiveConversation('c2');
        resolvers[1]([]);
        resolvers[2]([]);
        await Promise.all([leaving, reloading]);

        expect(store.state.messageIds).toEqual(['m1']);
      });
      it('discards held messages when the adapter changes before listMessages resolves', async () => {
        const { listMessages, resolvers } = createPendingListMessages();
        const { store, handleRealtimeEvent, setActiveConversation, realtimeMessageBufferRef } =
          setup({ listMessages });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        const loading = setActiveConversation('c2');
        realtimeMessageBufferRef.current = {
          adapter: { sendMessage: vi.fn() },
          buffer: createRealtimeMessageBuffer(),
        };
        resolvers[0]([]);
        await loading;

        expect(store.state.messageIds).toEqual([]);
      });
          const { store, handleRealtimeEvent, setActiveConversation, realtimeMessageBufferRef } =
            setup({ listMessages });

          handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
          const loading = setActiveConversation('c2');
          realtimeMessageBufferRef.current = {
            adapter: { sendMessage: vi.fn() },
            buffer: createRealtimeMessageBuffer(),
          };
          settleLoad();
          await loading;

          expect(store.state.messageIds).toEqual([]);
        },
      );
      it('message-removed: drops the message from the buffer', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        handleRealtimeEvent({ type: 'message-added', message: createMessage('m2', 'c2') });
        handleRealtimeEvent({ type: 'message-removed', messageId: 'm1', conversationId: 'c2' });
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual(['m2']);
      });

      it('conversation-removed: drops the conversation buffer', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c2' });
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual([]);
      });

      it(`keeps the ${REALTIME_MESSAGE_BUFFER_LIMIT} most recent messages per conversation`, async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        for (let index = 0; index <= REALTIME_MESSAGE_BUFFER_LIMIT; index += 1) {
          handleRealtimeEvent({ type: 'message-added', message: createMessage(`m${index}`, 'c2') });
        }
        await setActiveConversation('c2');

        expect(store.state.messageIds).toHaveLength(REALTIME_MESSAGE_BUFFER_LIMIT);
        expect(store.state.messageIds[0]).toBe('m1');
        expect(store.state.messageIds.at(-1)).toBe(`m${REALTIME_MESSAGE_BUFFER_LIMIT}`);
      });

      it('message-updated: merges buffered updates like updateMessage', async () => {
        const author = { id: 'u1', displayName: 'Ada' };
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({
          type: 'message-added',
          message: { ...createMessage('m1', 'c2'), author },
        });
        handleRealtimeEvent({
          type: 'message-updated',
          message: createMessage('m1', 'c2', 'm1 edited'),
        });
        await setActiveConversation('c2');

        expect(getTexts(store)).toEqual(['m1 edited']);
        expect(store.state.messagesById.m1.author).toEqual(author);
      });
      it('leaves messages missing from a partial page to history pagination', async () => {
        const listMessages = vi.fn().mockResolvedValue({
          messages: [createMessage('m3', 'c2')],
          hasMore: true,
        });
        const { store, handleRealtimeEvent, setActiveConversation } = setup({ listMessages });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        handleRealtimeEvent({
          type: 'message-updated',
          message: createMessage('m2', 'c2', 'm2 edited'),
        });
        await setActiveConversation('c2');

        // m1 and m2 may be older than the page.
        expect(store.state.messageIds).toEqual(['m3']);
      });
      it('keeps a buffered copy in step with events applied while no conversation is active', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2', 'v1') });
        await setActiveConversation(undefined);
        handleRealtimeEvent({ type: 'message-updated', message: createMessage('m1', 'c2', 'v2') });
        handleRealtimeEvent({ type: 'message-updated', message: createMessage('m1', 'c2', 'v3') });
        expect(getTexts(store)).toEqual(['v3']);
        await setActiveConversation('c2');

        expect(getTexts(store)).toEqual(['v3']);
      });

      it('keeps a held copy in step with an update without a conversation id', async () => {
        const { listMessages, resolvers } = createPendingListMessages();
        const { store, handleRealtimeEvent, setActiveConversation } = setup({ listMessages });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2', 'v1') });
        const loading = setActiveConversation('c2');
        handleRealtimeEvent({
          type: 'message-updated',
          message: { ...createMessage('m1', 'c2', 'v2'), conversationId: undefined },
        });
        resolvers[0]([]);
        await loading;

        expect(getTexts(store)).toEqual(['v2']);
      });

      it('message-removed: drops the message from the buffer without a conversation id', async () => {
        const { store, handleRealtimeEvent, setActiveConversation } = setup();

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        handleRealtimeEvent({ type: 'message-removed', messageId: 'm1' });
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual([]);
      });

      it('does not replay messages into a controlled thread', async () => {
        const listMessages = vi.fn().mockResolvedValue({
          messages: [createMessage('m0', 'c2')],
          hasMore: false,
        });
        const { store, handleRealtimeEvent, setActiveConversation } = setup({
          messages: [],
          listMessages,
        });

        handleRealtimeEvent({ type: 'message-added', message: createMessage('m1', 'c2') });
        expect(store.state.messageIds).toEqual([]);
        await setActiveConversation('c2');

        expect(store.state.messageIds).toEqual(['m0']);
      });
    });

    it('conversation-added: adds conversation to store', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'conversation-added', conversation: conversation1 });

      expect(store.state.conversationIds).toEqual(['c1']);
      expect(store.state.conversationsById.c1).toEqual(conversation1);
    });

    it('conversation-updated: updates existing conversation', () => {
      const store = new ChatStore({ initialConversations: [conversation1] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({
        type: 'conversation-updated',
        conversation: { id: 'c1', title: 'General (updated)' },
      });

      expect(store.state.conversationsById.c1.title).toBe('General (updated)');
    });

    it('conversation-updated: adds conversation when it does not exist (upsert)', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'conversation-updated', conversation: conversation1 });

      expect(store.state.conversationIds).toEqual(['c1']);
    });

    it('conversation-removed: removes conversation from store', () => {
      const store = new ChatStore({ initialConversations: [conversation1, conversation2] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(store.state.conversationIds).toEqual(['c2']);
      expect(store.state.conversationsById.c1).toBeUndefined();
    });

    it('conversation-removed: clears active conversation and messages when the removed conversation is active', () => {
      const store = new ChatStore({
        initialConversations: [conversation1],
        initialMessages: [baseMessage],
      });
      store.setActiveConversation('c1');

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(store.state.activeConversationId).toBeUndefined();
      expect(store.state.messageIds).toEqual([]);
    });

    it('conversation-removed: increments the navigation request ID when the active conversation is removed', () => {
      const store = new ChatStore({ initialConversations: [conversation1] });
      store.setActiveConversation('c1');
      const conversationNavigationRequestIdRef = { current: 0 };

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef,
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(conversationNavigationRequestIdRef.current).toBe(1);
    });

    it('conversation-removed: does not increment navigation request ID when a non-active conversation is removed', () => {
      const store = new ChatStore({ initialConversations: [conversation1, conversation2] });
      store.setActiveConversation('c2');
      const conversationNavigationRequestIdRef = { current: 0 };

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef,
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(conversationNavigationRequestIdRef.current).toBe(0);
    });

    it('presence: updates participant isOnline status via applyPresenceUpdate', () => {
      const conv: ChatConversation = {
        id: 'c1',
        title: 'General',
        participants: [{ id: 'u1', displayName: 'Alice', isOnline: false }],
      };
      const store = new ChatStore({ initialConversations: [conv] });

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'presence', userId: 'u1', isOnline: true });

      expect(store.state.conversationsById.c1.participants?.[0].isOnline).toBe(true);
    });

    it('read: sets readState and unreadCount via applyReadUpdate', () => {
      const conv: ChatConversation = {
        id: 'c1',
        title: 'General',
        unreadCount: 3,
        readState: 'unread',
      };
      const store = new ChatStore({ initialConversations: [conv] });

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'read', conversationId: 'c1' });

      expect(store.state.conversationsById.c1.readState).toBe('read');
      expect(store.state.conversationsById.c1.unreadCount).toBe(0);
    });

    it('typing: calls store.setTypingUser with conversationId, userId, and isTyping', () => {
      const store = new ChatStore({ initialConversations: [conversation1] });
      const setTypingUser = vi.spyOn(store, 'setTypingUser');

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      handleRealtimeEvent({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });

      expect(setTypingUser).toHaveBeenCalledWith('c1', 'u1', true);
    });

    it('end-to-end: a conversation-removed event mid-flight discards the in-flight loadConversationMessages (#15)', async () => {
      const store = new ChatStore({
        initialConversations: [conversation1, conversation2],
      });
      store.setActiveConversation('c1');

      // Shared guard refs — wired into both action factories the same way the
      // controller wires them at runtime.
      const conversationNavigationRequestIdRef = { current: 0 };
      const conversationLoadRequestIdRef = { current: 0 };

      let resolveListMessages!: (value: {
        messages: ChatMessage[];
        cursor?: string;
        hasMore: boolean;
      }) => void;
      const adapter: ChatAdapter = {
        sendMessage: vi.fn().mockResolvedValue(
          new ReadableStream({
            start(controller) {
              controller.close();
            },
          }),
        ),
        listMessages: vi.fn().mockReturnValue(
          new Promise((resolve) => {
            resolveListMessages = resolve;
          }),
        ),
      };

      const { loadConversationMessages } = createConversationActions({
        store,
        runtimeRef: { current: { adapter } },
        setRuntimeError: vi.fn(),
        stopStreaming: vi.fn(),
        conversationNavigationRequestIdRef,
        conversationLoadRequestIdRef,
        historyLoadRequestIdRef: { current: 0 },
        realtimeMessageBufferRef: { current: null },
      });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef,
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      // Start a load against the active conversation; the listMessages promise
      // is intentionally held open so the realtime event can arrive first.
      const loadPromise = loadConversationMessages('c1');

      // While the load is pending, the active conversation is removed via a
      // realtime event. The handler bumps the navigation guard counter AND
      // clears `activeConversationId`, which is the second guard the load
      // checks after its await resolves.
      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(store.state.activeConversationId).toBeUndefined();
      expect(conversationNavigationRequestIdRef.current).toBe(1);

      // Now the held listMessages resolves with stale data. The load's guard
      // checks should discard the result.
      resolveListMessages({
        messages: [
          {
            id: 'm-stale',
            conversationId: 'c1',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'Stale thread' }],
          },
        ],
        hasMore: false,
      });
      await loadPromise;

      expect(store.state.messageIds).toEqual([]);
      expect(store.state.messagesById['m-stale']).toBeUndefined();
    });

    it('unknown event type: does nothing and does not throw', () => {
      const store = new ChatStore({ initialMessages: [baseMessage] });
      const stateBefore = store.state;

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
        realtimeMessageBuffer: createRealtimeMessageBuffer(),
      });

      // @ts-expect-error — testing an unknown type at runtime
      expect(() => handleRealtimeEvent({ type: 'unknown-event' })).not.toThrow();
      expect(store.state).toBe(stateBefore);
    });
  });
});
