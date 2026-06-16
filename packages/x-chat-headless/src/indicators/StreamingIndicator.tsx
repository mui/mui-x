'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { SlotComponentProps } from '@mui/utils/types';
import type { ChatMessage } from '../types/chat-entities';
import {
  useStreamingIndicatorVisibility,
  type StreamingIndicatorMode,
} from '../hooks/useStreamingIndicatorVisibility';
import { useMessageContext } from '../message/internals/MessageContext';
import { getDataAttributes } from '../internals/getDataAttributes';
import { type StreamingIndicatorOwnerState } from './indicators.types';

export interface StreamingIndicatorSlots {
  root: React.ElementType;
}

export interface StreamingIndicatorSlotProps {
  root?: SlotComponentProps<'div', {}, StreamingIndicatorOwnerState>;
}

export interface StreamingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls when the indicator renders.
   * - `'auto'` – shown only in assistant-backed conversations (auto-detected).
   * - `true` – always shown while a response is in flight.
   * - `false` – never shown.
   * @default 'auto'
   */
  mode?: StreamingIndicatorMode;
  /**
   * The assistant message to reflect. Falls back to the surrounding
   * `MessageContext` when omitted (the default when mounted inside a chat
   * message). When a message is in scope, the indicator renders only while
   * that message is an assistant message with `status: 'streaming'`.
   */
  message?: ChatMessage | null;
  /**
   * Row contract shared with the divider slots: when `index`/`items` are
   * provided, the indicator self-suppresses on every row except the last one.
   */
  messageId?: string;
  index?: number;
  items?: string[];
  slots?: Partial<StreamingIndicatorSlots>;
  slotProps?: StreamingIndicatorSlotProps;
}

type StreamingIndicatorComponent = ((
  props: StreamingIndicatorProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

/**
 * Animated "response in flight" indicator. Outside a message it covers the
 * waiting phase (request sent, no assistant message yet); inside a message it
 * renders while that assistant message is streaming.
 */
export const StreamingIndicator = React.forwardRef(function StreamingIndicator(
  props: StreamingIndicatorProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    mode = 'auto',
    message: messageProp,
    messageId,
    index,
    items,
    slots,
    slotProps,
    children,
    ...other
  } = props;
  const messageContext = useMessageContext();
  const message = messageProp !== undefined ? messageProp : messageContext.message;
  const { waiting } = useStreamingIndicatorVisibility(mode);

  // In-message placement: the streaming assistant message itself is the proof
  // of an assistant-backed conversation, so `'auto'` needs no extra detection.
  let phase: StreamingIndicatorOwnerState['phase'] = null;
  if (message != null) {
    if (message.role === 'assistant' && message.status === 'streaming' && mode !== false) {
      phase = 'streaming';
    }
  } else if (waiting) {
    phase = 'waiting';
  }

  const ownerState = React.useMemo<StreamingIndicatorOwnerState>(
    () => ({ phase, messageId: message?.id ?? messageId }),
    [message?.id, messageId, phase],
  );

  const Root = slots?.root ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      // Decorative: streaming start/finish is already announced by the
      // message list's status live region, so the dots stay silent.
      'aria-hidden': true,
      ...getDataAttributes({
        phase,
      }),
    },
  });

  // Trailing-row contract: only the last rendered row shows the indicator.
  if (items != null && index != null && index !== items.length - 1) {
    return null;
  }

  if (phase == null) {
    return null;
  }

  return (
    <Root {...rootProps}>
      {children ?? (
        <React.Fragment>
          <span />
          <span />
          <span />
        </React.Fragment>
      )}
    </Root>
  );
}) as StreamingIndicatorComponent;
