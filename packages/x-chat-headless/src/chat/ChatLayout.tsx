'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { getChatLayoutPaneKind, type ChatLayoutPaneKind } from './internals/chatLayoutPaneKind';

export interface ChatLayoutSlots {
  root: React.ElementType;
  conversationsPane: React.ElementType;
  threadPane: React.ElementType;
}

export interface ChatLayoutOwnerState {
  hasConversationsPane: boolean;
  hasThreadPane: boolean;
}

export interface ChatLayoutPaneOwnerState {
  pane: ChatLayoutPaneKind;
}

export interface ChatLayoutSlotProps {
  root?: SlotComponentProps<'div', {}, ChatLayoutOwnerState>;
  conversationsPane?: SlotComponentProps<'div', {}, ChatLayoutPaneOwnerState>;
  threadPane?: SlotComponentProps<'div', {}, ChatLayoutPaneOwnerState>;
}

export interface ChatLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  slots?: Partial<ChatLayoutSlots>;
  slotProps?: ChatLayoutSlotProps;
}

function assignPaneChild(
  paneChildren: Record<ChatLayoutPaneKind, React.ReactNode[]>,
  kind: ChatLayoutPaneKind,
  child: React.ReactNode,
) {
  if (!paneChildren[kind]) {
    paneChildren[kind] = [];
  }
  paneChildren[kind].push(child);
}

function resolvePaneChildren(children: React.ReactNode) {
  const allChildren = React.Children.toArray(children);
  const paneChildren: Record<ChatLayoutPaneKind, React.ReactNode[]> = {
    conversations: [],
    thread: [],
  };
  const unassignedChildren: React.ReactNode[] = [];

  allChildren.forEach((child) => {
    const paneKind = getChatLayoutPaneKind(child);

    if (paneKind === null) {
      unassignedChildren.push(child);
      return;
    }

    assignPaneChild(paneChildren, paneKind, child);
  });

  if (allChildren.length <= 1) {
    const singleChild =
      paneChildren.conversations[0] ?? paneChildren.thread[0] ?? unassignedChildren[0];

    if (singleChild === undefined) {
      return paneChildren;
    }

    if (paneChildren.conversations.length > 0) {
      paneChildren.thread = [];
      return {
        conversations: [singleChild],
        thread: [],
      };
    }

    if (paneChildren.thread.length > 0) {
      paneChildren.conversations = [];
      return {
        conversations: [],
        thread: [singleChild],
      };
    }

    return {
      conversations: [],
      thread: [singleChild],
    };
  }

  unassignedChildren.forEach((child) => {
    if (paneChildren.conversations.length === 0) {
      assignPaneChild(paneChildren, 'conversations', child);
      return;
    }

    assignPaneChild(paneChildren, 'thread', child);
  });

  if (
    process.env.NODE_ENV !== 'production' &&
    unassignedChildren.length > 0 &&
    unassignedChildren.length < allChildren.length
  ) {
    console.warn(
      'MUI X Chat: ChatLayout could not determine the pane kind for some children. ' +
        'Use the `pane` prop (pane="conversations" or pane="thread") to explicitly assign children to panes, ' +
        'or use the `ConversationListRoot` and `ConversationRoot` components directly.',
    );
  }

  return paneChildren;
}

type ChatLayoutComponent = ((
  props: ChatLayoutProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ChatLayout = React.forwardRef(function ChatLayout(
  props: ChatLayoutProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, slots, slotProps, style, ...other } = props;
  const paneChildren = resolvePaneChildren(children);
  const ownerState: ChatLayoutOwnerState = {
    hasConversationsPane: paneChildren.conversations.length > 0,
    hasThreadPane: paneChildren.thread.length > 0,
  };
  const Root = slots?.root ?? 'div';
  const ConversationsPane = slots?.conversationsPane ?? 'div';
  const ThreadPane = slots?.threadPane ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      style: {
        display: 'flex',
        ...style,
      },
    },
  });
  const conversationsPaneProps = useSlotProps({
    elementType: ConversationsPane,
    externalSlotProps: slotProps?.conversationsPane,
    ownerState: {
      pane: 'conversations',
    },
    additionalProps: {
      style: {
        minHeight: 0,
        minWidth: 0,
      },
    },
  });
  const threadPaneProps = useSlotProps({
    elementType: ThreadPane,
    externalSlotProps: slotProps?.threadPane,
    ownerState: {
      pane: 'thread',
    },
    additionalProps: {
      style: {
        minHeight: 0,
        minWidth: 0,
      },
    },
  });

  return (
    <Root {...rootProps}>
      {ownerState.hasConversationsPane ? (
        <ConversationsPane {...conversationsPaneProps}>
          {paneChildren.conversations}
        </ConversationsPane>
      ) : null}
      {ownerState.hasThreadPane ? (
        <ThreadPane {...threadPaneProps}>{paneChildren.thread}</ThreadPane>
      ) : null}
    </Root>
  );
}) as ChatLayoutComponent;
