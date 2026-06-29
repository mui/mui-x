'use client';
import { useChatRuntimeContext } from '../internals/useChatRuntimeContext';
import type { ChatRuntimeActions } from '../internals/useChatController';

export type { ChatRuntimeActions } from '../internals/useChatController';

/**
 * Returns the stable runtime actions object (`sendMessage`, `retry`,
 * `regenerate`, `stopStreaming`, …) **without subscribing to any state**.
 *
 * Unlike `useChat`, which subscribes to messages/conversations and re-renders
 * on every stream token, `useChatActions` reads only the runtime context, so
 * components that just need to invoke actions (custom message-action buttons,
 * toolbar controls) do not re-render as the conversation updates.
 *
 * Pass `optional: true` to return `null` outside a `<ChatProvider>` instead of
 * throwing — mirrors the internal `useChatRuntimeContext(true)` pattern.
 */
export function useChatActions<Cursor = string>(optional: true): ChatRuntimeActions<Cursor> | null;
export function useChatActions<Cursor = string>(optional?: false): ChatRuntimeActions<Cursor>;
export function useChatActions<Cursor = string>(optional = false) {
  // `useChatRuntimeContext` is a single `useContext` call under both overloads,
  // so the hook count stays stable; the `optional` flag only toggles whether a
  // missing provider throws or returns `null`.
  const context = useChatRuntimeContext<Cursor>(optional as true);

  return (context?.actions ?? null) as ChatRuntimeActions<Cursor> | null;
}
