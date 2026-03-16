'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useThreadContext } from './internals/ThreadContext';
import { type ThreadSubtitleOwnerState } from './thread.types';

export interface ThreadSubtitleSlots {
  subtitle: React.ElementType;
}

export interface ThreadSubtitleSlotProps {
  subtitle?: SlotComponentProps<'div', {}, ThreadSubtitleOwnerState>;
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
  const Subtitle = slots?.subtitle ?? 'div';
  const subtitleProps = useSlotProps({
    elementType: Subtitle,
    externalSlotProps: slotProps?.subtitle,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return <Subtitle {...subtitleProps}>{ownerState.conversation?.subtitle ?? null}</Subtitle>;
}) as ThreadSubtitleComponent;
