'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type { ChatPartRenderer, ChatPartRendererProps } from '../../renderers/chatPartRenderer';
import type { ChatRole } from '../../types/chat-entities';
import type { ChatSourceUrlMessagePart } from '../../types/chat-message-parts';

export interface SourceUrlPartOwnerState {
  messageId: string;
  role: ChatRole;
}

export interface SourceUrlPartSlots {
  root: React.ElementType;
  icon: React.ElementType;
  link: React.ElementType;
}

export interface SourceUrlPartSlotProps {
  root?: SlotComponentProps<'span', {}, SourceUrlPartOwnerState>;
  icon?: SlotComponentProps<'span', {}, SourceUrlPartOwnerState>;
  link?: SlotComponentProps<'a', {}, SourceUrlPartOwnerState>;
}

export interface SourceUrlPartProps extends ChatPartRendererProps<ChatSourceUrlMessagePart> {
  className?: string;
  slots?: Partial<SourceUrlPartSlots>;
  slotProps?: SourceUrlPartSlotProps;
}

export type SourceUrlPartExternalProps = Omit<
  SourceUrlPartProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

type SourceUrlPartComponent = ((
  props: SourceUrlPartProps & React.RefAttributes<HTMLSpanElement>,
) => React.JSX.Element) & { propTypes?: any };

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      focusable="false"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Z" />
      <path d="M5 5h6v2H7v10h10v-4h2v6H5V5Z" />
    </svg>
  );
}

export const SourceUrlPart = React.forwardRef(function SourceUrlPart(
  props: SourceUrlPartProps,
  ref: React.Ref<HTMLSpanElement>,
) {
  const { className, index, message, onToolCall, part, slots, slotProps, ...other } = props;
  void index;
  void onToolCall;
  const ownerState = React.useMemo<SourceUrlPartOwnerState>(
    () => ({
      messageId: message.id,
      role: message.role,
    }),
    [message.id, message.role],
  );
  const Root = slots?.root ?? 'span';
  const Icon = slots?.icon ?? 'span';
  const LinkSlot = slots?.link ?? 'a';
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
  const iconProps = useSlotProps({
    elementType: Icon,
    externalSlotProps: slotProps?.icon,
    ownerState,
  });
  const linkProps = useSlotProps({
    elementType: LinkSlot,
    externalSlotProps: slotProps?.link,
    ownerState,
  });

  return (
    <Root {...rootProps}>
      <Icon {...iconProps}>
        <ExternalLinkIcon />
      </Icon>
      <LinkSlot href={part.url} rel="noreferrer noopener" target="_blank" {...linkProps}>
        {part.title ?? part.url}
      </LinkSlot>
    </Root>
  );
}) as SourceUrlPartComponent;

export function createSourceUrlPartRenderer(
  defaultProps: SourceUrlPartExternalProps = {},
): ChatPartRenderer<ChatSourceUrlMessagePart> {
  return function SourceUrlPartRendererFn(rendererProps) {
    return <SourceUrlPart {...defaultProps} {...rendererProps} />;
  };
}
