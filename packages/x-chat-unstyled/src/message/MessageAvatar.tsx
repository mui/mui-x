'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageContext } from './internals/MessageContext';
import { type MessageAvatarOwnerState } from './message.types';

export interface MessageAvatarSlots {
  root: React.ElementType;
}

export interface MessageAvatarSlotProps {
  root?: SlotComponentProps<'div', {}, MessageAvatarOwnerState>;
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

  if (ownerState.isGrouped || !avatarUrl) {
    return null;
  }

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

  return (
    <Root {...rootProps}>
      <img alt={displayName ?? ''} src={avatarUrl} />
    </Root>
  );
}) as MessageAvatarComponent;
