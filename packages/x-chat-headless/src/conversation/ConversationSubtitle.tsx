'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useConversationContext } from './internals/ConversationContext';
import { type ConversationSubtitleOwnerState } from './conversation.types';

export interface ConversationSubtitleSlots {
  subtitle: React.ElementType;
}

export interface ConversationSubtitleSlotProps {
  subtitle?: SlotComponentProps<'div', {}, ConversationSubtitleOwnerState>;
}

export interface ConversationSubtitleProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ConversationSubtitleSlots>;
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
