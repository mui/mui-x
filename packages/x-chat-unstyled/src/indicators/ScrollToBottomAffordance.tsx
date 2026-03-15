'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useMessageListContext } from '../message-list/internals/MessageListContext';
import { type ScrollToBottomAffordanceOwnerState } from './indicators.types';

function createAriaLabel(unseenMessageCount: number) {
  if (unseenMessageCount > 0) {
    return `Scroll to bottom, ${unseenMessageCount} new messages`;
  }

  return 'Scroll to bottom';
}

export interface ScrollToBottomAffordanceSlots {
  root: React.ElementType;
  badge: React.ElementType;
}

export interface ScrollToBottomAffordanceSlotProps {
  root?: SlotComponentProps<'button', {}, ScrollToBottomAffordanceOwnerState>;
  badge?: SlotComponentProps<'span', {}, ScrollToBottomAffordanceOwnerState>;
}

export interface ScrollToBottomAffordanceProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  slots?: Partial<ScrollToBottomAffordanceSlots>;
  slotProps?: ScrollToBottomAffordanceSlotProps;
}

type ScrollToBottomAffordanceComponent = ((
  props: ScrollToBottomAffordanceProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const ScrollToBottomAffordance = React.forwardRef(function ScrollToBottomAffordance(
  props: ScrollToBottomAffordanceProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { slots, slotProps, ...other } = props;
  const { isAtBottom, scrollToBottom, unseenMessageCount } = useMessageListContext();
  const label = React.useMemo(
    () => createAriaLabel(unseenMessageCount),
    [unseenMessageCount],
  );
  const ownerState = React.useMemo<ScrollToBottomAffordanceOwnerState>(
    () => ({
      isAtBottom,
      unseenMessageCount,
      label,
    }),
    [isAtBottom, label, unseenMessageCount],
  );
  const Root = slots?.root ?? 'button';
  const Badge = slots?.badge ?? 'span';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      type: 'button',
      'aria-label': label,
      onClick: () => {
        scrollToBottom();
      },
    },
  });
  const badgeProps = useSlotProps({
    elementType: Badge,
    externalSlotProps: slotProps?.badge,
    ownerState,
  });

  if (isAtBottom) {
    return null;
  }

  return (
    <Root {...rootProps}>
      <span>Scroll to bottom</span>
      {unseenMessageCount > 0 ? <Badge {...badgeProps}>{unseenMessageCount}</Badge> : null}
    </Root>
  );
}) as ScrollToBottomAffordanceComponent;
