'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerSendButtonOwnerState } from './composer.types';

export interface ComposerSendButtonSlots {
  root: React.ElementType;
}

export interface ComposerSendButtonSlotProps {
  root?: SlotComponentProps<'button', {}, ComposerSendButtonOwnerState>;
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
  const ownerState: ComposerSendButtonOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
  };
  const Root = slots?.root ?? 'button';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  }) as React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.RefAttributes<HTMLButtonElement>;

  return (
    <Root
      {...rootProps}
      aria-label={rootProps['aria-label'] ?? 'Send message'}
      disabled={Boolean(rootProps.disabled) || !ownerState.hasValue || ownerState.isStreaming}
      type={rootProps.type ?? 'submit'}
    />
  );
}) as ComposerSendButtonComponent;
