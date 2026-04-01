'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '@mui/x-chat-headless';
import { type ConversationListItemActionsOwnerState } from './conversationList.types';

export interface ConversationListItemActionsSlots {
  root: React.ElementType;
}

export interface ConversationListItemActionsSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationListItemActionsOwnerState>;
}

export interface ConversationListItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListItemActionsSlots>;
  slotProps?: ConversationListItemActionsSlotProps;
}

type ConversationListItemActionsComponent = ((
  props: ConversationListItemActionsProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationListItemActions = React.forwardRef(
  function ConversationListItemActions(
    props: ConversationListItemActionsProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const {
      children,
      conversation,
      selected = false,
      unread = false,
      focused = false,
      ownerState: ownerStateProp,
      slots,
      slotProps,
      ...other
    } = props as ConversationListItemActionsProps & {
      ownerState?: ConversationListItemActionsOwnerState;
    };
    const ownerState: ConversationListItemActionsOwnerState = {
      conversation,
      selected,
      unread,
      focused,
      variant: ownerStateProp?.variant ?? 'default',
    };
    void ownerStateProp;

    const Root = slots?.root ?? 'div';
    const rootProps = useSlotProps({
      elementType: Root,
      externalSlotProps: slotProps?.root,
      externalForwardedProps: other,
      ownerState,
      additionalProps: {
        ref,
      },
    });

    return <Root {...rootProps}>{children}</Root>;
  },
) as ConversationListItemActionsComponent;
