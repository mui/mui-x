'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerToolbarOwnerState } from './composer.types';

export interface ComposerToolbarSlots {
  root: React.ElementType;
}

export interface ComposerToolbarSlotProps {
  root?: SlotComponentProps<'div', {}, ComposerToolbarOwnerState>;
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

  return <Root {...rootProps} />;
}) as ComposerToolbarComponent;
