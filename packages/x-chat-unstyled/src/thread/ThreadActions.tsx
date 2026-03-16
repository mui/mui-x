'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useThreadContext } from './internals/ThreadContext';
import { type ThreadActionsOwnerState } from './thread.types';

export interface ThreadActionsSlots {
  actions: React.ElementType;
}

export interface ThreadActionsSlotProps {
  actions?: SlotComponentProps<'div', {}, ThreadActionsOwnerState>;
}

export interface ThreadActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  slots?: Partial<ThreadActionsSlots>;
  slotProps?: ThreadActionsSlotProps;
}

type ThreadActionsComponent = ((
  props: ThreadActionsProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ThreadActions = React.forwardRef(function ThreadActions(
  props: ThreadActionsProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, slots, slotProps, ...other } = props;
  const ownerState = useThreadContext();
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
}) as ThreadActionsComponent;
