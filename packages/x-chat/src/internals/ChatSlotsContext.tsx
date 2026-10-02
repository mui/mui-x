'use client';
import * as React from 'react';
import type { ChatBoxSlots, ChatBoxSlotProps } from '../ChatBox/ChatBox.types';

export interface ChatSlotsContextValue {
  /**
   * The user-provided ChatBox slots (flat, prefixed vocabulary). NOT pre-merged
   * with a defaults map — default-component resolution stays inline at each use
   * site (`slots.messageContent ?? ChatMessageContent`) so that `null`-means-hide
   * is preserved (`null` is explicit; `undefined` falls back to the default).
   */
  slots: ChatBoxSlots;
  slotProps: ChatBoxSlotProps;
}

// Frozen so the shared singleton returned to every out-of-provider consumer can
// never be mutated into a poisoned default for the others.
const EMPTY_SLOTS: ChatSlotsContextValue = Object.freeze({
  slots: Object.freeze({}),
  slotProps: Object.freeze({}),
});

/**
 * Distributes the flat `ChatBox` slots/slotProps to the message-rendering
 * pipeline (`ChatBoxContent`, `DefaultMessageItem`, `ChatMessageGroup`) without
 * prop-drilling. `null` (no provider) means "not inside a ChatBox" — standalone
 * components fall back to their own `slots` prop.
 */
export const ChatSlotsContext = React.createContext<ChatSlotsContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  ChatSlotsContext.displayName = 'ChatSlotsContext';
}

export interface ChatSlotsProviderProps {
  slots?: ChatBoxSlots;
  slotProps?: ChatBoxSlotProps;
  children: React.ReactNode;
}

export function ChatSlotsProvider(props: ChatSlotsProviderProps) {
  const { slots, slotProps, children } = props;
  const value = React.useMemo<ChatSlotsContextValue>(
    () => ({ slots: slots ?? {}, slotProps: slotProps ?? {} }),
    [slots, slotProps],
  );
  return <ChatSlotsContext.Provider value={value}>{children}</ChatSlotsContext.Provider>;
}

/**
 * Reads the ambient ChatBox slots. Returns empty maps when there is no
 * `ChatSlotsProvider` ancestor (e.g. a standalone styled component).
 */
export function useChatSlots(): ChatSlotsContextValue {
  return React.useContext(ChatSlotsContext) ?? EMPTY_SLOTS;
}
