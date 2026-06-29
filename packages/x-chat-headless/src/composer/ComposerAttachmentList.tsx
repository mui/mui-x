'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatStore } from '../hooks/useChatStore';
import { chatSelectors } from '../selectors';
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
  // Read attachments from the store (the source of truth) rather than the
  // ComposerContext. The default attachment-list content is store-backed, so
  // gating on the store lets the list render in a standalone/custom-layout
  // preview where there is no `ChatComposer` ancestor (the ComposerContext
  // default would report zero attachments and the list would never mount).
  const store = useChatStore();
  const attachments = useStore(store, chatSelectors.composerAttachments);
  const ownerState: ComposerAttachmentListOwnerState = {
    isSubmitting: composer.isSubmitting,
    hasValue: composer.hasValue,
    isStreaming: composer.isStreaming,
    attachmentCount: attachments.length,
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

  if (attachments.length === 0) {
    return null;
  }

  return <AttachmentList {...rootProps} />;
}) as ComposerAttachmentListComponent;
