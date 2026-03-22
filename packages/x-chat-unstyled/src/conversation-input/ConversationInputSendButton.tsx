'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { useConversationInputContext } from './internals/ConversationInputContext';
import { type ConversationInputSendButtonOwnerState } from './conversation-input.types';

export interface ConversationInputSendButtonSlots {
  sendButton: React.ElementType;
}

export interface ConversationInputSendButtonSlotProps {
  sendButton?: SlotComponentProps<'button', {}, ConversationInputSendButtonOwnerState>;
}

export interface ConversationInputSendButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  slots?: Partial<ConversationInputSendButtonSlots>;
  slotProps?: ConversationInputSendButtonSlotProps;
}

type ConversationInputSendButtonComponent = ((
  props: ConversationInputSendButtonProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ConversationInputSendButton = React.forwardRef(function ConversationInputSendButton(
  props: ConversationInputSendButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { slots, slotProps, ...other } = props;
  const composer = useConversationInputContext();
  const localeText = useChatLocaleText();
  const ownerState: ConversationInputSendButtonOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
    disabled: composer.disabled,
  };
  const SendButton = slots?.sendButton ?? 'button';
  const rootProps = useSlotProps({
    elementType: SendButton,
    externalSlotProps: slotProps?.sendButton,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      ...getDataAttributes({
        isSubmitting: ownerState.isSubmitting,
        hasValue: ownerState.hasValue,
        isStreaming: ownerState.isStreaming,
        disabled: ownerState.disabled,
      }),
    },
  }) as React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>;

  return (
    <SendButton
      {...rootProps}
      aria-label={rootProps['aria-label'] ?? localeText.composerSendButtonLabel}
      disabled={
        Boolean(rootProps.disabled) ||
        !ownerState.hasValue ||
        ownerState.isStreaming ||
        ownerState.disabled
      }
      type={rootProps.type ?? 'submit'}
    />
  );
}) as ConversationInputSendButtonComponent;
