'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useConversationContext } from './internals/ConversationContext';
import { type ConversationHeaderInfoOwnerState } from './conversation.types';

export interface ConversationHeaderInfoSlots {
  headerInfo: React.ElementType;
}

export interface ConversationHeaderInfoSlotProps {
  headerInfo?: SlotComponentProps<'div', {}, ConversationHeaderInfoOwnerState>;
}

export interface ConversationHeaderInfoProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children?: React.ReactNode;
  slots?: Partial<ConversationHeaderInfoSlots>;
  slotProps?: ConversationHeaderInfoSlotProps;
}

type ConversationHeaderInfoComponent = ((
  props: ConversationHeaderInfoProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationHeaderInfo = React.forwardRef(function ConversationHeaderInfo(
  props: ConversationHeaderInfoProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, slots, slotProps, ...other } = props;
  const ownerState = useConversationContext();
  const HeaderInfo = slots?.headerInfo ?? 'div';
  const headerInfoProps = useSlotProps({
    elementType: HeaderInfo,
    externalSlotProps: slotProps?.headerInfo,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return <HeaderInfo {...headerInfoProps}>{children}</HeaderInfo>;
}) as ConversationHeaderInfoComponent;
