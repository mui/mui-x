'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useConversationContext } from './internals/ConversationContext';
import { type ConversationTitleOwnerState } from './conversation.types';

export interface ConversationTitleSlots {
  title: React.ElementType;
}

export interface ConversationTitleSlotProps {
  title?: SlotComponentProps<'div', {}, ConversationTitleOwnerState>;
}

export interface ConversationTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ConversationTitleSlots>;
  slotProps?: ConversationTitleSlotProps;
}

type ConversationTitleComponent = ((
  props: ConversationTitleProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationTitle = React.forwardRef(function ConversationTitle(
  props: ConversationTitleProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as ConversationTitleProps & {
    ownerState?: ConversationTitleOwnerState;
  };
  const ownerState = useConversationContext();
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
}) as ConversationTitleComponent;
