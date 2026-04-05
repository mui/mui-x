'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageContext } from './internals/MessageContext';
import { type MessageActionsOwnerState } from './message.types';

export interface MessageActionsSlots {
  actions: React.ElementType;
}

export interface MessageActionsSlotProps {
  actions?: SlotComponentProps<'div', {}, MessageActionsOwnerState>;
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
  const Actions = slots?.actions ?? 'div';
  const actionsProps = useSlotProps({
    elementType: Actions,
    externalSlotProps: slotProps?.actions,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return <Actions {...actionsProps} />;
}) as MessageActionsComponent;
