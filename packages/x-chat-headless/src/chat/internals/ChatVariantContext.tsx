'use client';
import * as React from 'react';

/**
 * Variant for the chat message display layout.
 * - `'default'`: Standard layout with avatar, content, and message meta
 * - `'compact'`: Condensed layout with reduced spacing
 */
export type ChatVariant = 'default' | 'compact';

const ChatVariantContext = React.createContext<ChatVariant>('default');

/**
 * Provides the chat variant to all descendant message components.
 * Controls how messages are laid out without prop drilling.
 * @example
 * <ChatVariantProvider variant="compact">
 *   <ChatMessageList />
 * </ChatVariantProvider>
 */
export function ChatVariantProvider(props: { children: React.ReactNode; variant: ChatVariant }) {
  const { children, variant } = props;

  return <ChatVariantContext.Provider value={variant}>{children}</ChatVariantContext.Provider>;
}

/**
 * Returns the current chat variant from the nearest {@link ChatVariantProvider}.
 * Consumed by `MessageRoot` and `MessageGroup` to apply layout-specific ownerState.
 */
export function useChatVariant(): ChatVariant {
  return React.useContext(ChatVariantContext);
}
