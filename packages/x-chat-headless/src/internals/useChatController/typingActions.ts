import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import type { ChatAdapter } from '../../adapters';
import type { ChatStore } from '../../store';
import type { ChatFeatures } from '../../ChatProvider';

export interface TypingActionsRuntimeRef<Cursor = string> {
  adapter: ChatAdapter<Cursor>;
  features?: ChatFeatures;
}

function warnSetTypingFailed(): void {
  warnOnce([
    'MUI X Chat: An `adapter.setTyping()` call failed while sending an outbound typing signal.',
    'Typing signals are advisory and best-effort, so the failure was swallowed and the call is not retried.',
    'Make `setTyping()` resilient (handle network errors) if the remote "is typing…" state must stay accurate.',
  ]);
}

/**
 * Outbound typing-signal wiring. Feature-gated (`features.typingSignal`, default
 * off). Mirrors the per-concern action-factory pattern used by
 * `createRealtimeActions` / `createConversationActions`.
 *
 * Maintains a single `lastSent` latch (`{ conversationId, isTyping } | null`)
 * keyed by conversation so a state is never re-sent for the same conversation
 * (no call storms during continuous typing). At most one conversation can be
 * "typing" because there is a single composer.
 */
export function createTypingActions(params: {
  store: ChatStore<unknown>;
  runtimeRef: React.MutableRefObject<TypingActionsRuntimeRef<unknown>>;
}) {
  const { store, runtimeRef } = params;

  let lastSent: { conversationId: string; isTyping: boolean } | null = null;

  function isEnabled(): boolean {
    const { adapter, features } = runtimeRef.current;
    return features?.typingSignal === true && typeof adapter.setTyping === 'function';
  }

  // Ungated internal dispatcher: latch + best-effort call. The gate lives in the
  // handlers, not here, so flag-flip flushing can send a final `false`.
  function dispatch(conversationId: string, isTyping: boolean): void {
    const { adapter } = runtimeRef.current;
    if (!adapter.setTyping) {
      return;
    }
    if (lastSent?.conversationId === conversationId && lastSent.isTyping === isTyping) {
      return;
    }
    if (lastSent === null && !isTyping) {
      // Never send `false` before any `true` was sent.
      return;
    }
    lastSent = isTyping ? { conversationId, isTyping } : null;
    try {
      void Promise.resolve(adapter.setTyping({ conversationId, isTyping })).catch(() => {
        warnSetTypingFailed();
      });
    } catch {
      // A synchronous throw must not escape into the `Store.setState` listener
      // loop (it would crash the keystroke that triggered this).
      warnSetTypingFailed();
    }
  }

  function handleComposerValueChange(previous: string, next: string): void {
    if (!isEnabled()) {
      return;
    }
    const conversationId = store.state.activeConversationId;
    if (conversationId == null) {
      return;
    }
    if (previous === '' && next !== '') {
      dispatch(conversationId, true);
    } else if (previous !== '' && next === '') {
      dispatch(conversationId, false);
    }
  }

  function handleActiveConversationChange(
    _previous: string | undefined,
    next: string | undefined,
  ): void {
    if (!isEnabled()) {
      return;
    }
    if (lastSent?.isTyping) {
      dispatch(lastSent.conversationId, false);
    }
    if (next != null && store.state.composerValue !== '') {
      dispatch(next, true); // D7: re-signal on the new conversation.
    }
  }

  // Mount / flag-flip seeding: enforces the invariant from the current state.
  function syncTypingSignal(enabled: boolean): void {
    if (!enabled) {
      if (lastSent?.isTyping) {
        dispatch(lastSent.conversationId, false);
      }
      return;
    }
    const { activeConversationId, composerValue } = store.state;
    if (isEnabled() && activeConversationId != null && composerValue !== '') {
      // The latch makes this a no-op if already signaled.
      dispatch(activeConversationId, true);
    }
  }

  function disposeTyping(): void {
    if (lastSent?.isTyping) {
      dispatch(lastSent.conversationId, false);
    }
  }

  return { handleComposerValueChange, handleActiveConversationChange, syncTypingSignal, disposeTyping };
}
