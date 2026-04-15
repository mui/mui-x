'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useComposerContext } from './internals/ComposerContext';
import { type ComposerAttachmentListOwnerState } from './composer.types';

export interface ComposerAttachmentListSlots {
  attachmentList: React.ElementType;
}

export interface ComposerAttachmentListSlotProps {
  attachmentList?: SlotComponentProps<'div', {}, ComposerAttachmentListOwnerState>;
}

export interface ComposerAttachmentListProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<ComposerAttachmentListSlots>;
  slotProps?: ComposerAttachmentListSlotProps;
}

type ComposerAttachmentListComponent = ((
  props: ComposerAttachmentListProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const ComposerAttachmentList = React.forwardRef(function ComposerAttachmentList(
  props: ComposerAttachmentListProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, ...other } = props;
  const composer = useComposerContext();
  const ownerState: ComposerAttachmentListOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: composer.attachmentCount,
    disabled: composer.disabled,
  };
  const AttachmentList = slots?.attachmentList ?? 'div';
  const rootProps = useSlotProps({
    elementType: AttachmentList,
    externalSlotProps: slotProps?.attachmentList,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });

  if (composer.attachments.length === 0) {
    return null;
  }

  return <AttachmentList {...rootProps} />;
}) as ComposerAttachmentListComponent;
