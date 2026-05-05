'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerSendButtonOwnerState } from './composer.types';

export interface ComposerSendButtonSlots {
  sendButton: React.ElementType;
}

export interface ComposerSendButtonSlotProps {
  sendButton?: SlotComponentPropsFromProps<'button', {}, ComposerSendButtonOwnerState>;
}

export interface ComposerSendButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
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
}) as ComposerSendButtonComponent;
