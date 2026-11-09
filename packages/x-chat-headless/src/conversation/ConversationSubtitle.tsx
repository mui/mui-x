'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useConversationContext } from './internals/ConversationContext';
import type { ConversationSubtitleOwnerState } from './conversation.types';

export interface ConversationSubtitleSlots {
  /**
   * The component that renders the subtitle.
   */
  subtitle: React.ElementType;
}

export interface ConversationSubtitleSlotProps {
  /**
   * The props used for the subtitle slot.
   */
  subtitle?: SlotComponentProps<'div', {}, ConversationSubtitleOwnerState>;
}

export interface ConversationSubtitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: Partial<ConversationSubtitleSlots>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ConversationSubtitleSlotProps;
}

type ConversationSubtitleComponent = ((
  props: ConversationSubtitleProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationSubtitle = React.forwardRef(function ConversationSubtitle(
  props: ConversationSubtitleProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ConversationSubtitleProps & {
    ownerState?: ConversationSubtitleOwnerState;
  };
  const ownerState = useConversationContext();
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
}) as ConversationSubtitleComponent;
