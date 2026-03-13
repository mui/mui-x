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

  return (element.type as ChatLayoutPaneMarkedType)[chatLayoutPaneKind] ?? null;
}
