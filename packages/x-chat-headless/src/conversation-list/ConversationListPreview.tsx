'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '../types/chat-entities';
import type { ConversationListPreviewOwnerState } from './conversationList.types';

export interface ConversationListPreviewSlots {
  /**
   * The component that renders the root.
   */
  root: React.ElementType;
}

export interface ConversationListPreviewSlotProps {
  /**
   * The props used for the root slot.
   */
  root?: SlotComponentProps<'div', {}, ConversationListPreviewOwnerState>;
}

export interface ConversationListPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The conversation the item renders.
   */
  conversation: ChatConversation;
  /**
   * If `true`, the conversation is selected.
   */
  selected?: boolean;
  /**
   * If `true`, the conversation has unread messages.
   */
  unread?: boolean;
  /**
   * If `true`, the item has keyboard focus.
   */
  focused?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ConversationListPreviewSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ConversationListPreviewSlotProps;
}

type ConversationListPreviewComponent = ((
  props: ConversationListPreviewProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const ConversationListPreview = React.forwardRef(function ConversationListPreview(
  props: ConversationListPreviewProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    conversation,
    selected = false,
    unread = false,
    focused = false,
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ConversationListPreviewProps & {
    ownerState?: ConversationListPreviewOwnerState;
  };
  const ownerState: ConversationListPreviewOwnerState = {
    conversation,
    selected,
    unread,
    focused,
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

  if (!conversation.subtitle) {
    return null;
  }

  return <Root {...rootProps}>{conversation.subtitle}</Root>;
}) as ConversationListPreviewComponent;
