'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ChatPartRenderer, ChatTextMessagePart } from '@mui/x-chat-headless';
import {
  MessageContent as UnstyledMessageContent,
  type MessageContentProps as UnstyledMessageContentProps,
  type MessageContentSlotProps as UnstyledMessageContentSlotProps,
  type MessageContentSlots as UnstyledMessageContentSlots,
} from '@mui/x-chat-unstyled';
import type { MessageContentOwnerState } from '@mui/x-chat-unstyled/message';
import { styled } from '../internals/material/chatStyled';
import { chatCssVarKeys } from '../internals/material/chatThemeVars';
import { ChatMarkdownTextPart } from './ChatMarkdownTextPart';
import {
  chatFilePartSlots,
  chatReasoningPartSlots,
  chatSourceDocumentPartSlots,
  chatSourceUrlPartSlots,
  chatToolPartSlots,
} from './ChatAiPartRenderers';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';

const ChatMessageContentSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Content',
})<{ ownerState: MessageContentOwnerState }>({
  display: 'flex',
  minWidth: 0,
});

const ChatMessageBubbleSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Bubble',
})<{ ownerState: MessageContentOwnerState }>(({ theme, ownerState }) => {
  const isSystem = ownerState.role === 'system';
  const isUser = ownerState.role === 'user';
  const baseBorderRadius = Number(theme.shape.borderRadius) || 0;

  let backgroundColor: string;
  if (isSystem) {
    backgroundColor = 'transparent';
  } else if (isUser) {
    backgroundColor = `var(${chatCssVarKeys.userMessageBg})`;
  } else {
    backgroundColor = `var(${chatCssVarKeys.assistantMessageBg})`;
  }

  let color: string;
  if (isSystem) {
    color = theme.palette.text.secondary;
  } else if (isUser) {
    color = `var(${chatCssVarKeys.userMessageColor})`;
  } else {
    color = `var(${chatCssVarKeys.assistantMessageColor})`;
  }

  return {
    backgroundColor,
    borderRadius: isSystem ? 0 : baseBorderRadius * 2,
    color,
    maxWidth: '100%',
    minWidth: 0,
    padding: isSystem ? 0 : theme.spacing(1.25, 1.5),
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    [`& > * + *`]: {
      marginBlockStart: theme.spacing(0.75),
    },
  };
});

export type ChatMessageContentSlots = UnstyledMessageContentSlots;
export type ChatMessageContentSlotProps = UnstyledMessageContentSlotProps;
export interface ChatMessageContentProps extends Omit<
  UnstyledMessageContentProps,
  'partProps' | 'resolveBuiltInPartRenderer' | 'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageContentSlotProps;
  slots?: Partial<ChatMessageContentSlots>;
  sx?: SxProps<Theme>;
}

export const ChatMessageContent = React.forwardRef(function ChatMessageContent(
  props: ChatMessageContentProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const Content = React.useMemo(
    () => slots?.content ?? createDefaultSlot(ChatMessageContentSlot, sx),
    [slots?.content, sx],
  );
  const Bubble = slots?.bubble ?? ChatMessageBubbleSlot;

  return (
    <UnstyledMessageContent
      ref={ref}
      resolveBuiltInPartRenderer={(part, localeText) => {
        // Text part uses resolveBuiltInPartRenderer until an unstyled TextPart is available.
        // All other part types use partProps with styled slots below.
        if (part.type === 'text') {
          return ((rendererProps) => (
            <ChatMarkdownTextPart
              {...(rendererProps as Parameters<ChatPartRenderer<ChatTextMessagePart>>[0])}
              localeText={{
                messageCopiedCodeButtonLabel: localeText.messageCopiedCodeButtonLabel,
                messageCopyCodeButtonLabel: localeText.messageCopyCodeButtonLabel,
              }}
            />
          )) as ChatPartRenderer<any>;
        }
        return null;
      }}
      partProps={{
        reasoning: {
          className: chatMessageClasses.reasoning,
          slots: chatReasoningPartSlots,
        },
        tool: {
          className: chatMessageClasses.tool,
          slots: chatToolPartSlots,
        },
        'dynamic-tool': {
          className: chatMessageClasses.tool,
          slots: chatToolPartSlots,
        },
        file: {
          className: chatMessageClasses.file,
          slots: chatFilePartSlots,
        },
        'source-url': {
          className: chatMessageClasses.sourceUrl,
          slots: chatSourceUrlPartSlots,
        },
        'source-document': {
          className: chatMessageClasses.sourceDocument,
          slots: chatSourceDocumentPartSlots,
        },
      }}
      slotProps={{
        bubble: mergeSlotPropsWithClassName(slotProps?.bubble, chatMessageClasses.bubble),
        content: mergeSlotPropsWithClassName(
          slotProps?.content,
          className
            ? joinClassNames(chatMessageClasses.content, className)
            : chatMessageClasses.content,
        ),
      }}
      slots={{
        bubble: Bubble,
        content: Content,
      }}
      {...other}
    />
  );
});
