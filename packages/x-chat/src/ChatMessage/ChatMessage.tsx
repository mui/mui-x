'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ChatPartRenderer, ChatTextMessagePart } from '@mui/x-chat-headless';
import {
  MessageActions as UnstyledMessageActions,
  MessageAvatar as UnstyledMessageAvatar,
  MessageContent as UnstyledMessageContent,
  MessageGroup as UnstyledMessageGroup,
  MessageListDateDivider as UnstyledMessageListDateDivider,
  MessageMeta as UnstyledMessageMeta,
  MessageRoot as UnstyledMessageRoot,
  type MessageActionsProps as UnstyledMessageActionsProps,
  type MessageActionsSlotProps as UnstyledMessageActionsSlotProps,
  type MessageActionsSlots as UnstyledMessageActionsSlots,
  type MessageContentProps as UnstyledMessageContentProps,
  type MessageContentSlotProps as UnstyledMessageContentSlotProps,
  type MessageContentSlots as UnstyledMessageContentSlots,
  type MessageGroupProps as UnstyledMessageGroupProps,
  type MessageGroupSlotProps as UnstyledMessageGroupSlotProps,
  type MessageGroupSlots as UnstyledMessageGroupSlots,
  type MessageListDateDividerProps as UnstyledMessageListDateDividerProps,
  type MessageListDateDividerSlotProps as UnstyledMessageListDateDividerSlotProps,
  type MessageListDateDividerSlots as UnstyledMessageListDateDividerSlots,
  type MessageMetaProps as UnstyledMessageMetaProps,
  type MessageMetaSlotProps as UnstyledMessageMetaSlotProps,
  type MessageMetaSlots as UnstyledMessageMetaSlots,
  type MessageRootProps as UnstyledMessageRootProps,
  type MessageRootSlotProps as UnstyledMessageRootSlotProps,
  type MessageRootSlots as UnstyledMessageRootSlots,
  type MessageAvatarProps as UnstyledMessageAvatarProps,
  type MessageAvatarSlotProps as UnstyledMessageAvatarSlotProps,
  type MessageAvatarSlots as UnstyledMessageAvatarSlots,
} from '@mui/x-chat-unstyled';
import type {
  MessageActionsOwnerState,
  MessageAvatarOwnerState,
  MessageContentOwnerState,
  MessageMetaOwnerState,
  MessageRootOwnerState,
} from '@mui/x-chat-unstyled/message';
import type { MessageGroupOwnerState } from '@mui/x-chat-unstyled/message-group';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import { ChatMarkdownTextPart, createChatMarkdownTextPartRenderer } from './ChatMarkdownTextPart';
import {
  ChatFilePartRenderer,
  ChatReasoningPartRenderer,
  ChatSourceDocumentPartRenderer,
  ChatSourceUrlPartRenderer,
  ChatToolPartRenderer,
  chatFilePartSlots,
  chatReasoningPartSlots,
  chatSourceDocumentPartSlots,
  chatSourceUrlPartSlots,
  chatToolPartSlots,
  createChatFilePartRenderer,
  createChatReasoningPartRenderer,
  createChatSourceDocumentPartRenderer,
  createChatSourceUrlPartRenderer,
  createChatToolPartRenderer,
} from './ChatAiPartRenderers';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses, getChatMessageUtilityClass } from './chatMessageClasses';

export type {
  ChatMarkdownTextPartProps,
  ChatMarkdownTextPartRendererOptions,
  ChatMarkdownTextPartSlotProps,
  ChatMarkdownTextPartSlots,
} from './ChatMarkdownTextPart';
export type {
  ChatFilePartRendererOptions,
  ChatFilePartRendererProps,
  ChatFilePartRendererSlotProps,
  ChatFilePartRendererSlots,
  ChatReasoningPartRendererOptions,
  ChatReasoningPartRendererProps,
  ChatReasoningPartRendererSlotProps,
  ChatReasoningPartRendererSlots,
  ChatSourceDocumentPartRendererOptions,
  ChatSourceDocumentPartRendererProps,
  ChatSourceDocumentPartRendererSlotProps,
  ChatSourceDocumentPartRendererSlots,
  ChatSourceUrlPartRendererOptions,
  ChatSourceUrlPartRendererProps,
  ChatSourceUrlPartRendererSlotProps,
  ChatSourceUrlPartRendererSlots,
  ChatToolPartRendererOptions,
  ChatToolPartRendererProps,
  ChatToolPartRendererSlotProps,
  ChatToolPartRendererSlots,
} from './ChatAiPartRenderers';

function getAvatarLabel(ownerState: MessageAvatarOwnerState) {
  const author = ownerState.message?.author;

  return author?.displayName ?? author?.id ?? ownerState.role ?? ownerState.messageId;
}

function getAvatarFallback(ownerState: MessageAvatarOwnerState) {
  const source = getAvatarLabel(ownerState).trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return ownerState.messageId.slice(0, 2).toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

const ChatMessageRootSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MessageRootOwnerState }>(({ theme, ownerState }) => {
  const isSystem = ownerState.role === 'system';
  const isUser = ownerState.role === 'user';
  const contentColumn = isSystem || isUser ? 1 : 2;

  let alignSelf: string;
  if (isSystem) {
    alignSelf = 'center';
  } else if (isUser) {
    alignSelf = 'end';
  } else {
    alignSelf = 'start';
  }

  let gridTemplateColumns: string;
  if (isSystem) {
    gridTemplateColumns = 'minmax(0, 1fr)';
  } else if (isUser) {
    gridTemplateColumns = 'minmax(0, 1fr) auto';
  } else {
    gridTemplateColumns = 'auto minmax(0, 1fr)';
  }

  let justifySelf: string;
  if (isSystem) {
    justifySelf = 'center';
  } else if (isUser) {
    justifySelf = 'end';
  } else {
    justifySelf = 'start';
  }

  return {
    ...getChatCssVars(theme),
    alignSelf,
    display: 'grid',
    gridTemplateColumns,
    maxWidth: isSystem ? '100%' : 'min(100%, 48rem)',
    minWidth: 0,
    rowGap: theme.spacing(0.5),
    width: '100%',
    [`& .${chatMessageClasses.avatar}`]: {
      alignSelf: 'end',
      gridColumn: isUser ? 2 : 1,
      gridRow: '1 / span 3',
    },
    [`& .${chatMessageClasses.content}`]: {
      gridColumn: contentColumn,
      gridRow: 1,
      justifySelf,
      maxWidth: '100%',
      minWidth: 0,
    },
    [`& .${chatMessageClasses.actions}`]: {
      gridColumn: contentColumn,
      gridRow: 2,
      justifySelf,
      opacity: 0,
      pointerEvents: 'none',
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shorter,
      }),
    },
    [`& .${chatMessageClasses.meta}`]: {
      gridColumn: contentColumn,
      gridRow: 3,
      justifySelf,
      maxWidth: '100%',
      minWidth: 0,
    },
    [`& .${chatMessageClasses.actions}:empty`]: {
      display: 'none',
    },
    '&:hover, &:focus-within': {
      [`& .${chatMessageClasses.actions}`]: {
        opacity: 1,
        pointerEvents: 'auto',
      },
    },
  };
});

const ChatMessageAvatarSlot = styled(Avatar, {
  name: 'MuiChatMessage',
  slot: 'Avatar',
})<{ ownerState: MessageAvatarOwnerState }>(({ theme }) => ({
  fontSize: theme.typography.pxToRem(13),
  height: 32,
  width: 32,
}));

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

const ChatMessageMetaSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Meta',
})<{ ownerState: MessageMetaOwnerState }>(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
}));

const ChatMessageTimestampSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'Timestamp',
})<{ ownerState: MessageMetaOwnerState }>({});

const ChatMessageStatusSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'Status',
})<{ ownerState: MessageMetaOwnerState }>(({ theme, ownerState }) => ({
  ...(ownerState.streaming && ownerState.role === 'assistant'
    ? {
        '&::before': {
          animation: 'mui-chat-pulse 1.2s ease-in-out infinite',
          backgroundColor: theme.palette.text.secondary,
          borderRadius: '50%',
          content: '""',
          display: 'inline-block',
          height: 6,
          marginInlineEnd: theme.spacing(0.5),
          verticalAlign: 'middle',
          width: 6,
        },
        '@keyframes mui-chat-pulse': {
          '0%, 100%': { opacity: 0.35 },
          '50%': { opacity: 1 },
        },
      }
    : {}),
}));

const ChatMessageEditedSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'Edited',
})<{ ownerState: MessageMetaOwnerState }>({});

const ChatMessageActionsSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Actions',
})<{ ownerState: MessageActionsOwnerState }>(({ theme }) => ({
  alignItems: 'center',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  minHeight: 28,
}));

const ChatMessageGroupSlot = styled('div')<{ ownerState: MessageGroupOwnerState }>(({
  theme,
  ownerState,
}) => {
  const connectedRadius = Math.max((Number(theme.shape.borderRadius) || 0) - 2, 4);
  const isUser = ownerState.authorRole === 'user';
  const isSystem = ownerState.authorRole === 'system';

  let firstRadiusOverride = {};
  if (!ownerState.isFirst && !isSystem) {
    firstRadiusOverride = isUser
      ? { borderStartEndRadius: connectedRadius }
      : { borderStartStartRadius: connectedRadius };
  }

  let lastRadiusOverride = {};
  if (!ownerState.isLast && !isSystem) {
    lastRadiusOverride = isUser
      ? { borderEndEndRadius: connectedRadius }
      : { borderEndStartRadius: connectedRadius };
  }

  return {
    marginBlockStart: ownerState.isFirst ? theme.spacing(2) : theme.spacing(0.5),
    width: '100%',
    ...(isSystem
      ? {}
      : {
          [`& .${chatMessageClasses.bubble}`]: {
            ...firstRadiusOverride,
            ...lastRadiusOverride,
          },
        }),
  };
});

const ChatMessageAuthorNameSlot = styled('div')<{ ownerState: MessageGroupOwnerState }>(
  ({ theme, ownerState }) => ({
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
    marginBlockEnd: theme.spacing(0.5),
    textAlign: ownerState.authorRole === 'user' ? 'end' : 'start',
  }),
);

const ChatDateDividerSlot = styled('div')(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  gap: theme.spacing(1),
  marginBlock: theme.spacing(2),
}));

const ChatDateDividerLineSlot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  flex: '1 1 auto',
  height: 1,
}));

const ChatDateDividerLabelSlot = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  flex: '0 0 auto',
}));

function DefaultAvatarSlot(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: MessageAvatarOwnerState;
  },
) {
  const { children: childrenProp, ownerState, ...other } = props;

  void childrenProp;

  return (
    <ChatMessageAvatarSlot
      alt={ownerState ? getAvatarLabel(ownerState) : ''}
      ownerState={ownerState as MessageAvatarOwnerState}
      src={ownerState?.message?.author?.avatarUrl}
      {...other}
    >
      {ownerState ? getAvatarFallback(ownerState) : null}
    </ChatMessageAvatarSlot>
  );
}

export type ChatMessageRootSlots = UnstyledMessageRootSlots;
export type ChatMessageRootSlotProps = UnstyledMessageRootSlotProps;
export interface ChatMessageRootProps extends Omit<
  UnstyledMessageRootProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageRootSlotProps;
  slots?: Partial<ChatMessageRootSlots>;
  sx?: SxProps<Theme>;
}

export type ChatMessageAvatarSlots = UnstyledMessageAvatarSlots;
export type ChatMessageAvatarSlotProps = UnstyledMessageAvatarSlotProps;
export interface ChatMessageAvatarProps extends Omit<
  UnstyledMessageAvatarProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageAvatarSlotProps;
  slots?: Partial<ChatMessageAvatarSlots>;
  sx?: SxProps<Theme>;
}

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

export type ChatMessageMetaSlots = UnstyledMessageMetaSlots;
export type ChatMessageMetaSlotProps = UnstyledMessageMetaSlotProps;
export interface ChatMessageMetaProps extends Omit<
  UnstyledMessageMetaProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageMetaSlotProps;
  slots?: Partial<ChatMessageMetaSlots>;
  sx?: SxProps<Theme>;
}

export type ChatMessageActionsSlots = UnstyledMessageActionsSlots;
export type ChatMessageActionsSlotProps = UnstyledMessageActionsSlotProps;
export interface ChatMessageActionsProps extends Omit<
  UnstyledMessageActionsProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageActionsSlotProps;
  slots?: Partial<ChatMessageActionsSlots>;
  sx?: SxProps<Theme>;
}

export type ChatMessageGroupSlots = UnstyledMessageGroupSlots;
export type ChatMessageGroupSlotProps = UnstyledMessageGroupSlotProps;
export interface ChatMessageGroupProps extends Omit<
  UnstyledMessageGroupProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageGroupSlotProps;
  slots?: Partial<ChatMessageGroupSlots>;
  sx?: SxProps<Theme>;
}

export type ChatDateDividerSlots = UnstyledMessageListDateDividerSlots;
export type ChatDateDividerSlotProps = UnstyledMessageListDateDividerSlotProps;
export interface ChatDateDividerProps extends Omit<
  UnstyledMessageListDateDividerProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatDateDividerSlotProps;
  slots?: Partial<ChatDateDividerSlots>;
  sx?: SxProps<Theme>;
}

export const ChatMessageRoot = React.forwardRef(function ChatMessageRoot(
  inProps: ChatMessageRootProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatMessage',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultSlot(ChatMessageRootSlot, sx),
    [slots?.root, sx],
  );

  return (
    <UnstyledMessageRoot
      ref={ref}
      slotProps={{
        root: mergeSlotPropsWithClassName(
          slotProps?.root,
          className ? joinClassNames(chatMessageClasses.root, className) : chatMessageClasses.root,
        ),
      }}
      slots={{ root: Root }}
      {...other}
    />
  );
});

export const ChatMessageAvatar = React.forwardRef(function ChatMessageAvatar(
  props: ChatMessageAvatarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const AvatarSlot = React.useMemo(
    () => slots?.avatar ?? createDefaultSlot(DefaultAvatarSlot, sx),
    [slots?.avatar, sx],
  );

  return (
    <UnstyledMessageAvatar
      ref={ref}
      slotProps={{
        avatar: mergeSlotPropsWithClassName(
          slotProps?.avatar,
          className
            ? joinClassNames(chatMessageClasses.avatar, className)
            : chatMessageClasses.avatar,
        ),
      }}
      slots={{ avatar: AvatarSlot }}
      {...other}
    />
  );
});

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

export const ChatMessageMeta = React.forwardRef(function ChatMessageMeta(
  props: ChatMessageMetaProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const Meta = React.useMemo(
    () => slots?.meta ?? createDefaultSlot(ChatMessageMetaSlot, sx),
    [slots?.meta, sx],
  );
  const Timestamp = slots?.timestamp ?? ChatMessageTimestampSlot;
  const Status = slots?.status ?? ChatMessageStatusSlot;
  const Edited = slots?.edited ?? ChatMessageEditedSlot;

  return (
    <UnstyledMessageMeta
      ref={ref}
      slotProps={{
        edited: mergeSlotPropsWithClassName(slotProps?.edited, chatMessageClasses.edited),
        meta: mergeSlotPropsWithClassName(
          slotProps?.meta,
          className ? joinClassNames(chatMessageClasses.meta, className) : chatMessageClasses.meta,
        ),
        status: mergeSlotPropsWithClassName(slotProps?.status, chatMessageClasses.status),
        timestamp: mergeSlotPropsWithClassName(slotProps?.timestamp, chatMessageClasses.timestamp),
      }}
      slots={{
        edited: Edited,
        meta: Meta,
        status: Status,
        timestamp: Timestamp,
      }}
      {...other}
    />
  );
});

export const ChatMessageActions = React.forwardRef(function ChatMessageActions(
  props: ChatMessageActionsProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const Actions = React.useMemo(
    () => slots?.actions ?? createDefaultSlot(ChatMessageActionsSlot, sx),
    [slots?.actions, sx],
  );

  return (
    <UnstyledMessageActions
      ref={ref}
      slotProps={{
        actions: mergeSlotPropsWithClassName(
          slotProps?.actions,
          className
            ? joinClassNames(chatMessageClasses.actions, className)
            : chatMessageClasses.actions,
        ),
      }}
      slots={{ actions: Actions }}
      {...other}
    />
  );
});

export const ChatMessageGroup = React.forwardRef(function ChatMessageGroup(
  props: ChatMessageGroupProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, className, slotProps, slots, sx, ...other } = props;
  const Group = React.useMemo(
    () => slots?.group ?? createDefaultSlot(ChatMessageGroupSlot, sx),
    [slots?.group, sx],
  );
  const AuthorName = slots?.authorName ?? ChatMessageAuthorNameSlot;

  return (
    <UnstyledMessageGroup
      ref={ref}
      slotProps={{
        authorName: slotProps?.authorName,
        group: mergeSlotPropsWithClassName(slotProps?.group, className),
      }}
      slots={{
        authorName: AuthorName,
        group: Group,
      }}
      {...other}
    >
      {children ?? (
        <React.Fragment>
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
        </React.Fragment>
      )}
    </UnstyledMessageGroup>
  );
});

export const ChatDateDivider = React.forwardRef(function ChatDateDivider(
  props: ChatDateDividerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const Divider = React.useMemo(
    () => slots?.divider ?? createDefaultSlot(ChatDateDividerSlot, sx),
    [slots?.divider, sx],
  );
  const Line = slots?.line ?? ChatDateDividerLineSlot;
  const Label = slots?.label ?? ChatDateDividerLabelSlot;

  return (
    <UnstyledMessageListDateDivider
      ref={ref}
      slotProps={{
        divider: mergeSlotPropsWithClassName(slotProps?.divider, className),
        label: slotProps?.label,
        line: slotProps?.line,
      }}
      slots={{
        divider: Divider,
        label: Label,
        line: Line,
      }}
      {...other}
    />
  );
});

export const ChatMessage = {
  Root: ChatMessageRoot,
  Avatar: ChatMessageAvatar,
  Content: ChatMessageContent,
  Meta: ChatMessageMeta,
  Actions: ChatMessageActions,
} as const;

export {
  ChatFilePartRenderer,
  ChatMarkdownTextPart,
  ChatReasoningPartRenderer,
  ChatSourceDocumentPartRenderer,
  ChatSourceUrlPartRenderer,
  ChatToolPartRenderer,
  createChatFilePartRenderer,
  createChatMarkdownTextPartRenderer,
  createChatReasoningPartRenderer,
  createChatSourceDocumentPartRenderer,
  createChatSourceUrlPartRenderer,
  createChatToolPartRenderer,
};
export { chatMessageClasses, getChatMessageUtilityClass };
