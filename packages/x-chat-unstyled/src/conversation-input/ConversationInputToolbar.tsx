'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useConversationInputContext } from './internals/ConversationInputContext';
import { type ConversationInputToolbarOwnerState } from './conversation-input.types';

export interface ConversationInputToolbarSlots {
  toolbar: React.ElementType;
}

export interface ConversationInputToolbarSlotProps {
  toolbar?: SlotComponentProps<'div', {}, ConversationInputToolbarOwnerState>;
}

export interface ConversationInputToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ConversationInputToolbarSlots>;
  slotProps?: ConversationInputToolbarSlotProps;
}

type ConversationInputToolbarComponent = ((
  props: ConversationInputToolbarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationInputToolbar = React.forwardRef(function ConversationInputToolbar(
  props: ConversationInputToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, ...other } = props;
  const composer = useConversationInputContext();
  const ownerState: ConversationInputToolbarOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
    disabled: composer.disabled,
  };
  const Toolbar = slots?.toolbar ?? 'div';
  const rootProps = useSlotProps({
    elementType: Toolbar,
    externalSlotProps: slotProps?.toolbar,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  return <Toolbar {...rootProps} />;
}) as ConversationInputToolbarComponent;
