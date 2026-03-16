'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useThreadContext } from './internals/ThreadContext';
import { type ThreadTitleOwnerState } from './thread.types';

export interface ThreadTitleSlots {
  title: React.ElementType;
}

export interface ThreadTitleSlotProps {
  title?: SlotComponentProps<'div', {}, ThreadTitleOwnerState>;
}

export interface ThreadTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ThreadTitleSlots>;
  slotProps?: ThreadTitleSlotProps;
}

type ThreadTitleComponent = ((
  props: ThreadTitleProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ThreadTitle = React.forwardRef(function ThreadTitle(
  props: ThreadTitleProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ThreadTitleProps & {
    ownerState?: ThreadTitleOwnerState;
  };
  const ownerState = useThreadContext();
  void ownerStateProp;
  const Title = slots?.title ?? 'div';
  const titleProps = useSlotProps({
    elementType: Title,
    externalSlotProps: slotProps?.title,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return <Title {...titleProps}>{ownerState.conversation?.title ?? null}</Title>;
}) as ThreadTitleComponent;
