'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import type { ChatPartRenderer, ChatPartRendererProps } from '../../renderers/chatPartRenderer';
import type { ChatRole } from '../../types/chat-entities';
import type { ChatSourceDocumentMessagePart } from '../../types/chat-message-parts';

export interface SourceDocumentPartOwnerState {
  messageId: string;
  role: ChatRole;
}

export interface SourceDocumentPartSlots {
  root: React.ElementType;
  title: React.ElementType;
  excerpt: React.ElementType;
}

export interface SourceDocumentPartSlotProps {
  root?: SlotComponentPropsFromProps<'div', {}, SourceDocumentPartOwnerState>;
  title?: SlotComponentPropsFromProps<'div', {}, SourceDocumentPartOwnerState>;
  excerpt?: SlotComponentPropsFromProps<'div', {}, SourceDocumentPartOwnerState>;
}

export interface SourceDocumentPartProps extends ChatPartRendererProps<ChatSourceDocumentMessagePart> {
  className?: string;
  slots?: Partial<SourceDocumentPartSlots>;
  slotProps?: SourceDocumentPartSlotProps;
}

export type SourceDocumentPartExternalProps = Omit<
  SourceDocumentPartProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

type SourceDocumentPartComponent = ((
  props: SourceDocumentPartProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element | null) & { propTypes?: any };

export const SourceDocumentPart = React.forwardRef(function SourceDocumentPart(
  props: SourceDocumentPartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, index, message, onToolCall, part, slots, slotProps, ...other } = props;
  void index;
  void onToolCall;
  const ownerState = React.useMemo<SourceDocumentPartOwnerState>(
    () => ({
      messageId: message.id,
      role: message.role,
    }),
    [message.id, message.role],
  );
  const Root = slots?.root ?? 'div';
  const Title = slots?.title ?? 'div';
  const Excerpt = slots?.excerpt ?? 'div';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      className,
    },
  });
  const titleProps = useSlotProps({
    elementType: Title,
    externalSlotProps: slotProps?.title,
    ownerState,
  });
  const excerptProps = useSlotProps({
    elementType: Excerpt,
    externalSlotProps: slotProps?.excerpt,
    ownerState,
  });

  return (
    <Root {...rootProps}>
      {part.title ? <Title {...titleProps}>{part.title}</Title> : null}
      {part.text ? <Excerpt {...excerptProps}>{part.text}</Excerpt> : null}
    </Root>
  );
}) as SourceDocumentPartComponent;

export function createSourceDocumentPartRenderer(
  defaultProps: SourceDocumentPartExternalProps = {},
): ChatPartRenderer<ChatSourceDocumentMessagePart> {
  return function SourceDocumentPartRendererFn(rendererProps) {
    return <SourceDocumentPart {...defaultProps} {...rendererProps} />;
  };
}
