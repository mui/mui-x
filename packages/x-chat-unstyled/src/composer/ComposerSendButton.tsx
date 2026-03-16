'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerSendButtonOwnerState } from './composer.types';

export interface ComposerSendButtonSlots {
  sendButton: React.ElementType;
}

export interface ComposerSendButtonSlotProps {
  sendButton?: SlotComponentProps<'button', {}, ComposerSendButtonOwnerState>;
}

export interface ComposerSendButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  slots?: Partial<ComposerSendButtonSlots>;
  slotProps?: ComposerSendButtonSlotProps;
}

type ComposerSendButtonComponent = ((
  props: ComposerSendButtonProps & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ComposerSendButton = React.forwardRef(function ComposerSendButton(
  props: ComposerSendButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { slots, slotProps, ...other } = props;
  const composer = useComposerContext();
  const localeText = useChatLocaleText();
  const ownerState: ComposerSendButtonOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
  };
  const SendButton = slots?.sendButton ?? 'button';
  const rootProps = useSlotProps({
    elementType: SendButton,
    externalSlotProps: slotProps?.sendButton,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  }) as React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.RefAttributes<HTMLButtonElement>;

  return (
    <SendButton
      {...rootProps}
      aria-label={rootProps['aria-label'] ?? localeText.composerSendButtonLabel}
      disabled={Boolean(rootProps.disabled) || !ownerState.hasValue || ownerState.isStreaming}
      type={rootProps.type ?? 'submit'}
    />
  );
}) as ComposerSendButtonComponent;
