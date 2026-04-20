'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import type { ChatPartRenderer, ChatPartRendererProps } from '../../renderers/chatPartRenderer';
import type { ChatReasoningMessagePart } from '../../types/chat-message-parts';
import type { ChatRole } from '../../types/chat-entities';
import { useChatLocaleText } from '../../chat/internals/ChatLocaleContext';

export interface ReasoningPartOwnerState {
  messageId: string;
  role: ChatRole;
  streaming: boolean;
}

export interface ReasoningPartSlots {
  root: React.ElementType;
  summary: React.ElementType;
  content: React.ElementType;
}

export interface ReasoningPartSlotProps {
  root?: SlotComponentPropsFromProps<'details', {}, ReasoningPartOwnerState>;
  summary?: SlotComponentPropsFromProps<'summary', {}, ReasoningPartOwnerState>;
  content?: SlotComponentPropsFromProps<'div', {}, ReasoningPartOwnerState>;
}

export interface ReasoningPartProps extends ChatPartRendererProps<ChatReasoningMessagePart> {
  className?: string;
  slots?: Partial<ReasoningPartSlots>;
  slotProps?: ReasoningPartSlotProps;
}

export type ReasoningPartExternalProps = Omit<
  ReasoningPartProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

type ReasoningPartComponent = ((
  props: ReasoningPartProps & React.RefAttributes<HTMLDetailsElement>,
) => React.JSX.Element) & { propTypes?: any };

export const ReasoningPart = React.forwardRef(function ReasoningPart(
  props: ReasoningPartProps,
  ref: React.Ref<HTMLDetailsElement>,
) {
  const { className, index, message, onToolCall, part, slots, slotProps, ...other } = props;
  void index;
  void onToolCall;
  const localeText = useChatLocaleText();
  const ownerState = React.useMemo<ReasoningPartOwnerState>(
    () => ({
      messageId: message.id,
      role: message.role,
      streaming: part.state === 'streaming',
    }),
    [message.id, message.role, part.state],
  );
  const Root = slots?.root ?? 'details';
  const Summary = slots?.summary ?? 'summary';
  const Content = slots?.content ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      open: ownerState.streaming,
      className,
    },
  });
  const summaryProps = useSlotProps({
    elementType: Summary,
    externalSlotProps: slotProps?.summary,
    ownerState,
  });
  const contentProps = useSlotProps({
    elementType: Content,
    externalSlotProps: slotProps?.content,
    ownerState,
  });

  return (
    <Root {...rootProps}>
      <Summary {...summaryProps}>
        {ownerState.streaming
          ? localeText.messageReasoningStreamingLabel
          : localeText.messageReasoningLabel}
      </Summary>
      <Content {...contentProps}>{part.text}</Content>
    </Root>
  );
}) as ReasoningPartComponent;

export function createReasoningPartRenderer(
  defaultProps: ReasoningPartExternalProps = {},
): ChatPartRenderer<ChatReasoningMessagePart> {
  return function ReasoningPartRenderer(rendererProps) {
    return <ReasoningPart {...defaultProps} {...rendererProps} />;
  };
}
