'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerHelperTextOwnerState } from './composer.types';

export interface ComposerHelperTextSlots {
  helperText: React.ElementType;
}

export interface ComposerHelperTextSlotProps {
  helperText?: SlotComponentProps<'div', {}, ComposerHelperTextOwnerState>;
}

export interface ComposerHelperTextProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ComposerHelperTextSlots>;
  slotProps?: ComposerHelperTextSlotProps;
}

type ComposerHelperTextComponent = ((
  props: ComposerHelperTextProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const ComposerHelperText = React.forwardRef(function ComposerHelperText(
  props: ComposerHelperTextProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, children, ...other } = props;
  const composer = useComposerContext();
  const ownerState: ComposerHelperTextOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
    disabled: composer.disabled,
    error: composer.error != null,
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
}) as ComposerHelperTextComponent;
