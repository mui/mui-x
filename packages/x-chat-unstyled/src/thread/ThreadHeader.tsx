'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useThreadContext } from './internals/ThreadContext';
import { type ThreadHeaderOwnerState } from './thread.types';

export interface ThreadHeaderSlots {
  header: React.ElementType;
}

export interface ThreadHeaderSlotProps {
  header?: SlotComponentProps<'div', {}, ThreadHeaderOwnerState>;
}

export interface ThreadHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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
  const Header = slots?.header ?? 'div';
  const headerProps = useSlotProps({
    elementType: Header,
    externalSlotProps: slotProps?.header,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return <Header {...headerProps}>{children}</Header>;
}) as ThreadHeaderComponent;
