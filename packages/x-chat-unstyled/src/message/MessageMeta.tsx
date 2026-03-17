'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import { useChatLocaleText } from '../chat/internals/ChatLocaleContext';
import { useIsHydrated } from '../chat/internals/useIsHydrated';
import { useMessageContext } from './internals/MessageContext';
import { type MessageMetaOwnerState } from './message.types';

export interface MessageMetaSlots {
  meta: React.ElementType;
  timestamp: React.ElementType;
  status: React.ElementType;
  edited: React.ElementType;
}

export interface MessageMetaSlotProps {
  meta?: SlotComponentProps<'div', {}, MessageMetaOwnerState>;
  timestamp?: SlotComponentProps<'span', {}, MessageMetaOwnerState>;
  status?: SlotComponentProps<'span', {}, MessageMetaOwnerState>;
  edited?: SlotComponentProps<'span', {}, MessageMetaOwnerState>;
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

  if (!hasMeta) {
    return null;
  }

  return (
    <Meta {...metaProps}>
      {ownerState.message?.createdAt && timestampLabel ? (
        <Timestamp {...timestampProps}>{timestampLabel}</Timestamp>
      ) : null}
      {ownerState.message?.status && statusLabel ? (
        <Status {...statusProps}>{statusLabel}</Status>
      ) : null}
      {ownerState.message?.editedAt ? (
        <Edited {...editedProps}>{localeText.messageEditedLabel}</Edited>
      ) : null}
    </Meta>
  );
}) as MessageMetaComponent;
