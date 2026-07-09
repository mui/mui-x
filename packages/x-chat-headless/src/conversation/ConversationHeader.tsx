'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useConversationContext } from './internals/ConversationContext';
import { type ConversationHeaderOwnerState } from './conversation.types';

export interface ConversationHeaderSlots {
  header: React.ElementType;
}

export interface ConversationHeaderSlotProps {
  header?: SlotComponentProps<'div', {}, ConversationHeaderOwnerState>;
}

export interface ConversationHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children?: React.ReactNode;
  slots?: Partial<ConversationHeaderSlots>;
  slotProps?: ConversationHeaderSlotProps;
}

type ConversationHeaderComponent = ((
  props: ConversationHeaderProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationHeader = React.forwardRef(function ConversationHeader(
  props: ConversationHeaderProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, slots, slotProps, ...other } = props;
  const ownerState = useConversationContext();
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
}) as ConversationHeaderComponent;
