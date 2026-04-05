import * as React from 'react';

export type ChatLayoutPaneKind = 'conversations' | 'thread';

const chatLayoutPaneKind = Symbol.for('mui.x.chat.layout-pane-kind');

type ChatLayoutPaneMarkedType = React.ElementType & {
  [chatLayoutPaneKind]?: ChatLayoutPaneKind;
};

export function markChatLayoutPane<T extends React.ElementType>(
  component: T,
  kind: ChatLayoutPaneKind,
): T {
  (component as ChatLayoutPaneMarkedType)[chatLayoutPaneKind] = kind;

  return component;
}

export function getChatLayoutPaneKind(element: React.ReactNode): ChatLayoutPaneKind | null {
  if (!React.isValidElement(element)) {
    return null;
  }

  // Primary: symbol-based detection (works for direct unstyled components)
  const symbolKind = (element.type as ChatLayoutPaneMarkedType)[chatLayoutPaneKind];
  if (symbolKind) {
    return symbolKind;
  }

  // Fallback: explicit pane prop (works for wrapped components like React.memo, styled, etc.)
  const paneKind = (element.props as Record<string, unknown>)?.pane;
  if (paneKind === 'conversations' || paneKind === 'thread') {
    return paneKind;
  }

  return null;
}
