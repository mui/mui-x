'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useConversationContext } from './internals/ConversationContext';
import { type ConversationHeaderActionsOwnerState } from './conversation.types';

export interface ConversationHeaderActionsSlots {
  actions: React.ElementType;
}

export interface ConversationHeaderActionsSlotProps {
  actions?: SlotComponentProps<'div', {}, ConversationHeaderActionsOwnerState>;
}

export interface ConversationHeaderActionsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children?: React.ReactNode;
  slots?: Partial<ConversationHeaderActionsSlots>;
  slotProps?: ConversationHeaderActionsSlotProps;
}

type ConversationHeaderActionsComponent = ((
  props: ConversationHeaderActionsProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationHeaderActions = React.forwardRef(function ConversationHeaderActions(
  props: ConversationHeaderActionsProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, slots, slotProps, ...other } = props;
  const ownerState = useConversationContext();
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

  return <Actions {...actionsProps}>{children}</Actions>;
}) as ConversationHeaderActionsComponent;
