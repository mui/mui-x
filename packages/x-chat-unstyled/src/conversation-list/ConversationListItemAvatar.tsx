'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatConversation } from '@mui/x-chat-headless';
import { type ConversationListItemAvatarOwnerState } from './conversationList.types';

export interface ConversationListItemAvatarSlots {
  root: React.ElementType;
  image: React.ElementType;
}

export interface ConversationListItemAvatarSlotProps {
  root?: SlotComponentProps<'div', {}, ConversationListItemAvatarOwnerState>;
  image?: SlotComponentProps<'img', {}, ConversationListItemAvatarOwnerState>;
}

export interface ConversationListItemAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  conversation: ChatConversation;
  selected?: boolean;
  unread?: boolean;
  focused?: boolean;
  slots?: Partial<ConversationListItemAvatarSlots>;
  slotProps?: ConversationListItemAvatarSlotProps;
}

type ConversationListItemAvatarComponent = ((
  props: ConversationListItemAvatarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationListItemAvatar = React.forwardRef(function ConversationListItemAvatar(
  props: ConversationListItemAvatarProps,
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
  } = props as ConversationListItemAvatarProps & {
    ownerState?: ConversationListItemAvatarOwnerState;
  };
  const participant = conversation.participants?.[0];
  const ownerState: ConversationListItemAvatarOwnerState = {
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

  const Image = slots?.image ?? 'img';
  const imageProps = useSlotProps({
    elementType: Image,
    externalSlotProps: slotProps?.image,
    ownerState,
    additionalProps: {
      alt: participant?.displayName ?? '',
      src: participant?.avatarUrl ?? undefined,
    },
  });

  return <Root {...rootProps}>{participant?.avatarUrl ? <Image {...imageProps} /> : null}</Root>;
}) as ConversationListItemAvatarComponent;
