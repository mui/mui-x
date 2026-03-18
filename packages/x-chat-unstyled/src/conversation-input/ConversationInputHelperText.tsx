'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useConversationInputContext } from './internals/ConversationInputContext';
import { type ConversationInputHelperTextOwnerState } from './conversation-input.types';

export interface ConversationInputHelperTextSlots {
  helperText: React.ElementType;
}

export interface ConversationInputHelperTextSlotProps {
  helperText?: SlotComponentProps<'div', {}, ConversationInputHelperTextOwnerState>;
}

export interface ConversationInputHelperTextProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ConversationInputHelperTextSlots>;
  slotProps?: ConversationInputHelperTextSlotProps;
}

type ConversationInputHelperTextComponent = ((
  props: ConversationInputHelperTextProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const ConversationInputHelperText = React.forwardRef(function ConversationInputHelperText(
  props: ConversationInputHelperTextProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, children, ...other } = props;
  const composer = useConversationInputContext();
  const ownerState: ConversationInputHelperTextOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
    disabled: composer.disabled,
  };
  const HelperText = slots?.helperText ?? 'div';
  const rootProps = useSlotProps({
    elementType: HelperText,
    externalSlotProps: slotProps?.helperText,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });
  const content = children ?? composer.error?.message ?? null;

  if (content == null) {
    return null;
  }

  return <HelperText {...rootProps}>{content}</HelperText>;
}) as ConversationInputHelperTextComponent;
