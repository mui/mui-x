'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageContext } from './internals/MessageContext';
import { type MessageActionsOwnerState } from './message.types';

export interface MessageActionsSlots {
  root: React.ElementType;
}

export interface MessageActionsSlotProps {
  root?: SlotComponentProps<'div', {}, MessageActionsOwnerState>;
}

export interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<MessageActionsSlots>;
  slotProps?: MessageActionsSlotProps;
}

type MessageActionsComponent = ((
  props: MessageActionsProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const MessageActions = React.forwardRef(function MessageActions(
  props: MessageActionsProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as MessageActionsProps & { ownerState?: MessageActionsOwnerState };
  const ownerState = useMessageContext();
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

  return <Root {...rootProps} />;
}) as MessageActionsComponent;
