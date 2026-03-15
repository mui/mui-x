'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerHelperTextOwnerState } from './composer.types';

export interface ComposerHelperTextSlots {
  root: React.ElementType;
}

export interface ComposerHelperTextSlotProps {
  root?: SlotComponentProps<'div', {}, ComposerHelperTextOwnerState>;
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
  };
  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
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

  return <Root {...rootProps}>{content}</Root>;
}) as ComposerHelperTextComponent;
