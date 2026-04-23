'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { mergeReactProps } from '../internals/mergeReactProps';
import { useMessageListContext } from '../message-list/internals/MessageListContext';
import { type ScrollToBottomAffordanceOwnerState } from './indicators.types';

export interface ScrollToBottomAffordanceSlots {
  root: React.ElementType;
  badge: React.ElementType;
  icon?: React.ElementType;
}

export interface ScrollToBottomAffordanceSlotProps {
  root?: SlotComponentProps<'button', {}, ScrollToBottomAffordanceOwnerState>;
  badge?: SlotComponentProps<'span', {}, ScrollToBottomAffordanceOwnerState>;
  icon?: SlotComponentProps<'svg', {}, ScrollToBottomAffordanceOwnerState>;
}

export interface ScrollToBottomAffordanceProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  scrollBehavior?: ScrollBehavior;
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
  const { scrollBehavior, slots, slotProps, ...other } = props;
  const { isAtBottom, scrollToBottom, unseenMessageCount } = useMessageListContext();
  const localeText = useChatLocaleText();
  const label = React.useMemo(
    () =>
      unseenMessageCount > 0
        ? localeText.scrollToBottomWithCountLabel(unseenMessageCount)
        : localeText.scrollToBottomLabel,
    [localeText, unseenMessageCount],
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
  const Icon = slots?.icon;
  const rootSlotProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      type: 'button',
      'aria-label': label,
      ...getDataAttributes({
        isAtBottom: ownerState.isAtBottom,
        unseenMessageCount: ownerState.unseenMessageCount,
      }),
    },
  });
  const rootProps = mergeReactProps(rootSlotProps, {
    onClick: () => {
      scrollToBottom({
        behavior: scrollBehavior,
      });
    },
  });
  const badgeProps = useSlotProps({
    elementType: Badge,
    externalSlotProps: slotProps?.badge,
    ownerState,
  });
  const iconProps = useSlotProps({
    elementType: Icon ?? 'svg',
    externalSlotProps: slotProps?.icon,
    ownerState,
  });

  if (isAtBottom) {
    return null;
  }

  return (
    <Root {...rootProps}>
      {Icon ? <Icon {...iconProps} /> : <span>{localeText.scrollToBottomLabel}</span>}
      {unseenMessageCount > 0 ? <Badge {...badgeProps}>{unseenMessageCount}</Badge> : null}
    </Root>
  );
}) as ScrollToBottomAffordanceComponent;
