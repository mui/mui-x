'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerToolbarOwnerState } from './composer.types';

export interface ComposerToolbarSlots {
  toolbar: React.ElementType;
}

export interface ComposerToolbarSlotProps {
  toolbar?: SlotComponentProps<'div', {}, ComposerToolbarOwnerState>;
}

export interface ComposerToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ComposerToolbarSlots>;
  slotProps?: ComposerToolbarSlotProps;
}

type ComposerToolbarComponent = ((
  props: ComposerToolbarProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ComposerToolbar = React.forwardRef(function ComposerToolbar(
  props: ComposerToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, ...other } = props;
  const composer = useComposerContext();
  const ownerState: ComposerToolbarOwnerState = {
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
}) as ComposerToolbarComponent;
