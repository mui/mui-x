'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useMessageContext } from './internals/MessageContext';
import { useMessageActionable } from '../message-list/internals/MessageRovingContext';
import type { MessageActionsOwnerState } from './message.types';

export interface MessageActionsSlots {
  /**
   * The component that renders the actions.
   * @default 'div'
   */
  actions: React.ElementType;
}

export interface MessageActionsSlotProps {
  /**
   * The props used for the actions slot.
   */
  actions?: SlotComponentProps<'div', {}, MessageActionsOwnerState>;
}

export interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<MessageActionsSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
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
  const messageOwnerState = useMessageContext();
  const actionable = useMessageActionable();
  const ownerState = React.useMemo<MessageActionsOwnerState>(
    () => ({ ...messageOwnerState, actionable }),
    [messageOwnerState, actionable],
  );
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
