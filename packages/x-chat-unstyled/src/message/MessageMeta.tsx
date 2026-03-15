'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageContext } from './internals/MessageContext';
import { type MessageMetaOwnerState } from './message.types';

export interface MessageMetaSlots {
  root: React.ElementType;
}

export interface MessageMetaSlotProps {
  root?: SlotComponentProps<'div', {}, MessageMetaOwnerState>;
}

export interface MessageMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<MessageMetaSlots>;
  slotProps?: MessageMetaSlotProps;
}

type MessageMetaComponent = ((
  props: MessageMetaProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const MessageMeta = React.forwardRef(function MessageMeta(
  props: MessageMetaProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as MessageMetaProps & { ownerState?: MessageMetaOwnerState };
  const ownerState = useMessageContext();
  const hasMeta =
    ownerState.message?.createdAt != null ||
    ownerState.message?.status != null ||
    ownerState.message?.editedAt != null;
  void ownerStateProp;

  if (!hasMeta) {
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
      {ownerState.message?.createdAt ? <span>{ownerState.message.createdAt}</span> : null}
      {ownerState.message?.status ? <span>{ownerState.message.status}</span> : null}
      {ownerState.message?.editedAt ? <span>Edited</span> : null}
    </Root>
  );
}) as MessageMetaComponent;
