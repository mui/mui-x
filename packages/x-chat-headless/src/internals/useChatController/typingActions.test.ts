import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { ChatStore } from '../../store/ChatStore';
import { createTypingActions, type TypingActionsRuntimeRef } from './typingActions';
import type { ChatAdapter } from '../../adapters';
import type { ChatFeatures } from '../../ChatProvider';

function asUnknown(store: ChatStore): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}

function createSetup(
  options: {
    setTyping?: ChatAdapter['setTyping'] | null;
    features?: ChatFeatures;
    initialActiveConversationId?: string;
    initialComposerValue?: string;
    initialConversations?: { id: string; title: string }[];
  } = {},
) {
  const { initialActiveConversationId, initialComposerValue, initialConversations } = options;
  // Distinguish "not passed" (default on for convenience) from an explicit
  // `undefined` (a real default-off scenario under test).
  const features = 'features' in options ? options.features : { typingSignal: true };

  // `setTyping: null` removes the method entirely (adapter-without-setTyping
  // case); otherwise it's always wrapped in a spy so callers can assert on it.
  const setTyping =
    options.setTyping === null
      ? undefined
      : vi.fn<NonNullable<ChatAdapter['setTyping']>>(
          options.setTyping ?? (async () => {}),
        );

  const adapter: ChatAdapter = {
    sendMessage: vi.fn(),
    ...(setTyping ? { setTyping } : {}),
  };

  const store = new ChatStore({
    initialActiveConversationId,
    initialComposerValue,
    initialConversations,
  });

  const runtimeRef: { current: TypingActionsRuntimeRef<unknown> } = {
    current: { adapter: adapter as ChatAdapter<unknown>, features },
  };

  const actions = createTypingActions({ store: asUnknown(store), runtimeRef });

  return { store, adapter, setTyping, runtimeRef, actions };
}

describe('createTypingActions', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('empty → non-empty with an active conversation sends a single isTyping:true', () => {
    const { setTyping, actions } = createSetup({ initialActiveConversationId: 'c1' });

    actions.handleComposerValueChange('', 'h');

    expect(setTyping).toHaveBeenCalledTimes(1);
    expect(setTyping).toHaveBeenCalledWith({ conversationId: 'c1', isTyping: true });
  });

  it('continued typing (non-empty → non-empty) produces no additional calls', () => {
    const { setTyping, actions } = createSetup({ initialActiveConversationId: 'c1' });

    actions.handleComposerValueChange('', 'h');
    actions.handleComposerValueChange('h', 'he');
    actions.handleComposerValueChange('he', 'hel');
    actions.handleComposerValueChange('hel', 'hell');

    expect(setTyping).toHaveBeenCalledTimes(1);
    expect(setTyping).toHaveBeenCalledWith({ conversationId: 'c1', isTyping: true });
  });

  it('non-empty → empty sends isTyping:false', () => {
    const { setTyping, actions } = createSetup({ initialActiveConversationId: 'c1' });

    actions.handleComposerValueChange('', 'h');
    actions.handleComposerValueChange('h', '');

    expect(setTyping).toHaveBeenCalledTimes(2);
    expect(setTyping).toHaveBeenLastCalledWith({ conversationId: 'c1', isTyping: false });
  });

  it('empty → empty produces no call', () => {
    const { setTyping, actions } = createSetup({ initialActiveConversationId: 'c1' });

    actions.handleComposerValueChange('', '');

    expect(setTyping).not.toHaveBeenCalled();
  });

  it('no active conversation produces no call on any transition', () => {
    const { setTyping, actions } = createSetup();

    actions.handleComposerValueChange('', 'h');
    actions.handleComposerValueChange('h', '');

    expect(setTyping).not.toHaveBeenCalled();
  });

  it('adapter without setTyping does not throw and never calls anything else', () => {
    const { adapter, actions } = createSetup({
      setTyping: null,
      initialActiveConversationId: 'c1',
    });

    expect(() => {
      actions.handleComposerValueChange('', 'h');
      actions.handleComposerValueChange('h', '');
      actions.handleActiveConversationChange('c1', 'c2');
      actions.syncTypingSignal(true);
      actions.disposeTyping();
    }).not.toThrow();

    expect(adapter.sendMessage).not.toHaveBeenCalled();
  });

  it('latch never sends false before any true', () => {
    const { setTyping, actions } = createSetup({ initialActiveConversationId: 'c1' });

    actions.handleComposerValueChange('h', '');

    expect(setTyping).not.toHaveBeenCalled();
  });

  describe('conversation switch (D7)', () => {
    it('sends false for the old conversation and true for the new one when the draft is non-empty', () => {
      const { store, setTyping, actions } = createSetup({
        initialActiveConversationId: 'c1',
        initialComposerValue: 'draft',
        initialConversations: [
          { id: 'c1', title: 'A' },
          { id: 'c2', title: 'B' },
        ],
      });

      actions.handleComposerValueChange('', 'draft');
      setTyping!.mockClear();

      store.setActiveConversation('c2');
      actions.handleActiveConversationChange('c1', 'c2');

      expect(setTyping).toHaveBeenCalledTimes(2);
      expect(setTyping).toHaveBeenNthCalledWith(1, { conversationId: 'c1', isTyping: false });
      expect(setTyping).toHaveBeenNthCalledWith(2, { conversationId: 'c2', isTyping: true });
    });

    it('does not send true for the new conversation when the draft is empty', () => {
      const { store, setTyping, actions } = createSetup({
        initialActiveConversationId: 'c1',
        initialConversations: [
          { id: 'c1', title: 'A' },
          { id: 'c2', title: 'B' },
        ],
      });

      // No draft; not typing.
      store.setActiveConversation('c2');
      actions.handleActiveConversationChange('c1', 'c2');

      expect(setTyping).not.toHaveBeenCalled();
    });

    it('only sends false when switching to undefined', () => {
      const { store, setTyping, actions } = createSetup({
        initialActiveConversationId: 'c1',
      });

      actions.handleComposerValueChange('', 'draft');
      setTyping!.mockClear();

      store.setActiveConversation(undefined);
      actions.handleActiveConversationChange('c1', undefined);

      expect(setTyping).toHaveBeenCalledTimes(1);
      expect(setTyping).toHaveBeenCalledWith({ conversationId: 'c1', isTyping: false });
    });
  });

  describe('disposeTyping', () => {
    it('sends a single false when latched', () => {
      const { setTyping, actions } = createSetup({ initialActiveConversationId: 'c1' });

      actions.handleComposerValueChange('', 'h');
      setTyping!.mockClear();

      actions.disposeTyping();

      expect(setTyping).toHaveBeenCalledTimes(1);
      expect(setTyping).toHaveBeenCalledWith({ conversationId: 'c1', isTyping: false });
    });

    it('does nothing when not latched', () => {
      const { setTyping, actions } = createSetup({ initialActiveConversationId: 'c1' });

      actions.disposeTyping();

      expect(setTyping).not.toHaveBeenCalled();
    });
  });

  describe('best-effort failures (D9)', () => {
    it('swallows an async rejection with at most one dev warning', async () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { actions } = createSetup({
        setTyping: vi.fn(async () => {
          throw new Error('network down');
        }),
        initialActiveConversationId: 'c1',
      });

      expect(() => actions.handleComposerValueChange('', 'h')).not.toThrow();
      // Let the rejected promise settle.
      await Promise.resolve();
      await Promise.resolve();

      expect(consoleWarn).toHaveBeenCalledTimes(1);
    });

    it('swallows a synchronous throw so the triggering setComposerValue completes', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { actions } = createSetup({
        setTyping: vi.fn(() => {
          throw new Error('boom');
        }) as unknown as ChatAdapter['setTyping'],
        initialActiveConversationId: 'c1',
      });

      // The keystroke transition must complete despite the sync throw.
      expect(() => {
        actions.handleComposerValueChange('', 'h');
      }).not.toThrow();

      expect(consoleWarn).toHaveBeenCalledTimes(1);
    });
  });

  describe('feature gate — default off', () => {
    it('produces zero calls when features is undefined', () => {
      const { setTyping, actions } = createSetup({
        features: undefined,
        initialActiveConversationId: 'c1',
        initialComposerValue: 'draft',
      });

      actions.handleComposerValueChange('', 'h');
      actions.handleComposerValueChange('h', '');
      actions.handleActiveConversationChange('c1', 'c2');
      actions.syncTypingSignal(false);
      actions.disposeTyping();

      expect(setTyping).not.toHaveBeenCalled();
    });

    it('produces zero calls when typingSignal is false', () => {
      const { setTyping, actions } = createSetup({
        features: { typingSignal: false },
        initialActiveConversationId: 'c1',
        initialComposerValue: 'draft',
      });

      actions.handleComposerValueChange('', 'h');
      actions.handleComposerValueChange('h', '');
      actions.syncTypingSignal(false);
      actions.disposeTyping();

      expect(setTyping).not.toHaveBeenCalled();
    });
  });

  describe('syncTypingSignal seeding', () => {
    it('sends a single true when enabled with a non-empty composer and active conversation', () => {
      const { setTyping, actions } = createSetup({
        initialActiveConversationId: 'c1',
        initialComposerValue: 'draft',
      });

      actions.syncTypingSignal(true);

      expect(setTyping).toHaveBeenCalledTimes(1);
      expect(setTyping).toHaveBeenCalledWith({ conversationId: 'c1', isTyping: true });
    });

    it('does not duplicate when the latch is already true', () => {
      const { setTyping, actions } = createSetup({
        initialActiveConversationId: 'c1',
        initialComposerValue: 'draft',
      });

      actions.syncTypingSignal(true);
      actions.syncTypingSignal(true);

      expect(setTyping).toHaveBeenCalledTimes(1);
    });

    it('flushes a final false when disabled mid-draft', () => {
      const { setTyping, actions } = createSetup({
        initialActiveConversationId: 'c1',
        initialComposerValue: 'draft',
      });

      actions.syncTypingSignal(true);
      setTyping!.mockClear();

      actions.syncTypingSignal(false);

      expect(setTyping).toHaveBeenCalledTimes(1);
      expect(setTyping).toHaveBeenCalledWith({ conversationId: 'c1', isTyping: false });
    });

    it('does nothing when enabled with an empty composer', () => {
      const { setTyping, actions } = createSetup({
        initialActiveConversationId: 'c1',
      });

      actions.syncTypingSignal(true);

      expect(setTyping).not.toHaveBeenCalled();
    });
  });
});
