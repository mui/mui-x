'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useIsHydrated } from '../chat/internals/useIsHydrated';
import { ProgressIndicator, ProgressRoot, ProgressTrack } from '../internals/ProgressSlots';
import { useMessageContext } from './internals/MessageContext';
import { type MessageMetaOwnerState } from './message.types';

export interface MessageMetaSlots {
  meta: React.ElementType;
  timestamp: React.ElementType;
  status: React.ElementType;
  edited: React.ElementType;
  /**
   * The root element of the streaming progress indicator.
   * Rendered by Base UI `Progress.Root` when `message.status === 'streaming'`.
   * Provides `role="progressbar"` and `aria-valuetext` for screen readers.
   * @default ProgressRoot (Base UI Progress.Root wrapper)
   */
  streamingProgress: React.ElementType;
  /** The track element wrapping the streaming progress indicator. */
  streamingProgressTrack: React.ElementType;
  /** The animated indicator bar inside the streaming progress track. */
  streamingProgressIndicator: React.ElementType;
}

export interface MessageMetaSlotProps {
  meta?: SlotComponentProps<'div', {}, MessageMetaOwnerState>;
  timestamp?: SlotComponentProps<'span', {}, MessageMetaOwnerState>;
  status?: SlotComponentProps<'span', {}, MessageMetaOwnerState>;
  edited?: SlotComponentProps<'span', {}, MessageMetaOwnerState>;
  streamingProgress?: SlotComponentProps<'div', {}, MessageMetaOwnerState>;
  streamingProgressTrack?: SlotComponentProps<'div', {}, MessageMetaOwnerState>;
  streamingProgressIndicator?: SlotComponentProps<'div', {}, MessageMetaOwnerState>;
}

export interface MessageMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  slots?: Partial<MessageMetaSlots>;
  slotProps?: MessageMetaSlotProps;
}

type MessageMetaComponent = ((
  props: MessageMetaProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const MessageMeta = React.forwardRef(function MessageMeta(
  props: MessageMetaProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    ownerState: ownerStateProp,
    slots,
    slotProps,
    ...other
  } = props as MessageMetaProps & { ownerState?: MessageMetaOwnerState };
  const ownerState = useMessageContext();
  const localeText = useChatLocaleText();
  const isHydrated = useIsHydrated();
  const timestampLabel =
    isHydrated && ownerState.message?.createdAt
      ? localeText.messageTimestampLabel(ownerState.message.createdAt)
      : '';
  const statusLabel = ownerState.message?.status
    ? localeText.messageStatusLabel(ownerState.message.status)
    : '';
  const hasMeta =
    Boolean(timestampLabel) || Boolean(statusLabel) || ownerState.message?.editedAt != null;
  void ownerStateProp;

  const Meta = slots?.meta ?? 'div';
  const Timestamp = slots?.timestamp ?? 'span';
  const Status = slots?.status ?? 'span';
  const Edited = slots?.edited ?? 'span';
  const StreamingProgress = slots?.streamingProgress ?? ProgressRoot;
  const StreamingProgressTrack = slots?.streamingProgressTrack ?? ProgressTrack;
  const StreamingProgressIndicator = slots?.streamingProgressIndicator ?? ProgressIndicator;

  const metaProps = useSlotProps({
    elementType: Meta,
    externalSlotProps: slotProps?.meta,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
    },
  });
  const timestampProps = useSlotProps({
    elementType: Timestamp,
    externalSlotProps: slotProps?.timestamp,
    ownerState,
  });
  const statusProps = useSlotProps({
    elementType: Status,
    externalSlotProps: slotProps?.status,
    ownerState,
  });
  const editedProps = useSlotProps({
    elementType: Edited,
    externalSlotProps: slotProps?.edited,
    ownerState,
  });
  const streamingProgressProps = useSlotProps({
    elementType: StreamingProgress,
    externalSlotProps: slotProps?.streamingProgress,
    ownerState,
    additionalProps: {
      // value={null} → indeterminate state → aria-valuetext="loading" by default
      value: null as number | null,
      'aria-label': localeText.messageStatusLabel('streaming'),
    },
  });
  const streamingProgressTrackProps = useSlotProps({
    elementType: StreamingProgressTrack,
    externalSlotProps: slotProps?.streamingProgressTrack,
    ownerState,
  });
  const streamingProgressIndicatorProps = useSlotProps({
    elementType: StreamingProgressIndicator,
    externalSlotProps: slotProps?.streamingProgressIndicator,
    ownerState,
  });

  if (!hasMeta && !ownerState.streaming) {
    return null;
  }

  return (
    <Meta {...metaProps}>
      {ownerState.streaming ? (
        <StreamingProgress {...streamingProgressProps}>
          <StreamingProgressTrack {...streamingProgressTrackProps}>
            <StreamingProgressIndicator {...streamingProgressIndicatorProps} />
          </StreamingProgressTrack>
        </StreamingProgress>
      ) : null}
      {ownerState.message?.createdAt && timestampLabel ? (
        <Timestamp {...timestampProps}>{timestampLabel}</Timestamp>
      ) : null}
      {ownerState.message?.status && statusLabel && !ownerState.streaming ? (
        <Status {...statusProps}>{statusLabel}</Status>
      ) : null}
      {ownerState.message?.editedAt ? (
        <Edited {...editedProps}>{localeText.messageEditedLabel}</Edited>
      ) : null}
    </Meta>
  );
}) as MessageMetaComponent;
