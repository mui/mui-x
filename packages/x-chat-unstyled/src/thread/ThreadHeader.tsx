'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useThreadContext } from './internals/ThreadContext';
import { type ThreadHeaderOwnerState } from './thread.types';

export interface ThreadHeaderSlots {
  root: React.ElementType;
}

export interface ThreadHeaderSlotProps {
  root?: SlotComponentProps<'div', {}, ThreadHeaderOwnerState>;
}

export interface ThreadHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  slots?: Partial<ThreadHeaderSlots>;
  slotProps?: ThreadHeaderSlotProps;
}

type ThreadHeaderComponent = ((
  props: ThreadHeaderProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ThreadHeader = React.forwardRef(function ThreadHeader(
  props: ThreadHeaderProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, slots, slotProps, ...other } = props;
  const ownerState = useThreadContext();
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

  return <Root {...rootProps}>{children}</Root>;
}) as ThreadHeaderComponent;
