'use client';
import * as React from 'react';

/**
 * Density for vertical spacing between chat messages.
 * - `'compact'`: Reduced vertical spacing between messages.
 * - `'standard'`: Default spacing.
 * - `'comfortable'`: Increased vertical spacing between messages.
 */
export type ChatDensity = 'compact' | 'standard' | 'comfortable';

const ChatDensityContext = React.createContext<ChatDensity>('standard');

/**
 * Provides the chat density to all descendant message components.
 * Controls vertical spacing without prop drilling.
 * @example
 * <ChatDensityProvider density="compact">
 *   <ChatMessageList />
 * </ChatDensityProvider>
 */
export function ChatDensityProvider(props: { children: React.ReactNode; density: ChatDensity }) {
  const { children, density } = props;

  return <ChatDensityContext.Provider value={density}>{children}</ChatDensityContext.Provider>;
}

/**
 * Returns the current chat density from the nearest {@link ChatDensityProvider}.
 * Consumed by `MessageRoot` and `MessageGroup` to apply spacing-specific ownerState.
 */
export function useChatDensity(): ChatDensity {
  return React.useContext(ChatDensityContext);
}
