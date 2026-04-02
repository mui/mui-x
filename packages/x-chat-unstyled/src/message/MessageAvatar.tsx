'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageContext } from './internals/MessageContext';
import { type MessageAvatarOwnerState } from './message.types';

export interface MessageAvatarSlots {
  avatar: React.ElementType;
  image: React.ElementType;
}

export interface MessageAvatarSlotProps {
  avatar?: SlotComponentProps<'div', {}, MessageAvatarOwnerState>;
  image?: SlotComponentProps<'img', {}, MessageAvatarOwnerState>;
}

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<MessageAvatarSlots>;
  slotProps?: MessageAvatarSlotProps;
}

type MessageAvatarComponent = ((
  props: MessageAvatarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const MessageAvatar = React.forwardRef(function MessageAvatar(
  props: MessageAvatarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as MessageAvatarProps & { ownerState?: MessageAvatarOwnerState };
  const ownerState = useMessageContext();
  const avatarUrl = ownerState.message?.author?.avatarUrl;
  const displayName = ownerState.message?.author?.displayName;
  void ownerStateProp;

  const Avatar = slots?.avatar ?? 'div';
  const avatarProps = useSlotProps({
    elementType: Avatar,
    externalSlotProps: slotProps?.avatar,
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
      alt: displayName ?? '',
      src: avatarUrl ?? undefined,
    },
  });

  if (ownerState.role === 'system' || ownerState.message == null) {
    return null;
  }

  if (ownerState.isGrouped && ownerState.variant === 'compact') {
    return null;
  }

  if (avatarUrl == null && slots?.avatar == null) {
    return null;
  }

  return <Avatar {...avatarProps}>{avatarUrl ? <Image {...imageProps} /> : null}</Avatar>;
}) as MessageAvatarComponent;
