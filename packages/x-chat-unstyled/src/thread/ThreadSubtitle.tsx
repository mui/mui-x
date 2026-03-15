'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useThreadContext } from './internals/ThreadContext';
import { type ThreadSubtitleOwnerState } from './thread.types';

export interface ThreadSubtitleSlots {
  root: React.ElementType;
}

export interface ThreadSubtitleSlotProps {
  root?: SlotComponentProps<'div', {}, ThreadSubtitleOwnerState>;
}

export interface ThreadSubtitleProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ThreadSubtitleSlots>;
  slotProps?: ThreadSubtitleSlotProps;
}

type ThreadSubtitleComponent = ((
  props: ThreadSubtitleProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ThreadSubtitle = React.forwardRef(function ThreadSubtitle(
  props: ThreadSubtitleProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ThreadSubtitleProps & {
    ownerState?: ThreadSubtitleOwnerState;
  };
  const ownerState = useThreadContext();
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

  return <Root {...rootProps}>{ownerState.conversation?.subtitle ?? null}</Root>;
}) as ThreadSubtitleComponent;
