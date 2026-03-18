'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useChat, useMessage } from '@mui/x-chat-headless';
import {
  MessageListRoot,
  ConversationHeaderActions,
  ConversationHeader,
  ConversationRoot,
  ConversationSubtitle,
  ConversationTitle,
  type MessageListRootProps as UnstyledMessageListRootProps,
  type MessageListRootSlotProps as UnstyledMessageListRootSlotProps,
  type MessageListRootSlots as UnstyledMessageListRootSlots,
  type ConversationHeaderActionsSlotProps as UnstyledConversationHeaderActionsSlotProps,
  type ConversationHeaderActionsSlots as UnstyledConversationHeaderActionsSlots,
  type ConversationHeaderSlotProps as UnstyledConversationHeaderSlotProps,
  type ConversationHeaderSlots as UnstyledConversationHeaderSlots,
  type ConversationRootSlotProps as UnstyledConversationRootSlotProps,
  type ConversationRootSlots as UnstyledConversationRootSlots,
  type ConversationSubtitleSlotProps as UnstyledConversationSubtitleSlotProps,
  type ConversationSubtitleSlots as UnstyledConversationSubtitleSlots,
  type ConversationTitleSlotProps as UnstyledConversationTitleSlotProps,
  type ConversationTitleSlots as UnstyledConversationTitleSlots,
} from '@mui/x-chat-unstyled';
import {
  ChatDateDivider,
  ChatMessage as StyledChatMessage,
  ChatMessageGroup,
} from '../ChatMessage';
import {
  ChatScrollToBottomAffordance,
  ChatTypingIndicator,
  ChatUnreadMarker,
} from '../ChatIndicators';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import { getCopyableText, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import {
  chatConversationClasses,
  getChatConversationUtilityClass,
} from './chatConversationClasses';

export interface ChatConversationSlots {
  root: UnstyledConversationRootSlots['root'];
  header: UnstyledConversationHeaderSlots['header'];
  title: UnstyledConversationTitleSlots['title'];
  subtitle: UnstyledConversationSubtitleSlots['subtitle'];
  actions: UnstyledConversationHeaderActionsSlots['actions'];
  messageList: UnstyledMessageListRootSlots['messageList'];
  messageListScroller: UnstyledMessageListRootSlots['messageListScroller'];
  messageListContent: UnstyledMessageListRootSlots['messageListContent'];
  messageListOverlay: UnstyledMessageListRootSlots['messageListOverlay'];
}

export interface ChatConversationSlotProps {
  root?: UnstyledConversationRootSlotProps['root'];
  header?: UnstyledConversationHeaderSlotProps['header'];
  title?: UnstyledConversationTitleSlotProps['title'];
  subtitle?: UnstyledConversationSubtitleSlotProps['subtitle'];
  actions?: UnstyledConversationHeaderActionsSlotProps['actions'];
  messageList?: UnstyledMessageListRootSlotProps['messageList'];
  messageListScroller?: UnstyledMessageListRootSlotProps['messageListScroller'];
  messageListContent?: UnstyledMessageListRootSlotProps['messageListContent'];
  messageListOverlay?: UnstyledMessageListRootSlotProps['messageListOverlay'];
}

export interface ChatConversationProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  actions?: React.ReactNode;
  className?: string;
  estimatedItemSize?: UnstyledMessageListRootProps['estimatedItemSize'];
  getItemKey?: UnstyledMessageListRootProps['getItemKey'];
  items?: UnstyledMessageListRootProps['items'];
  onReachTop?: UnstyledMessageListRootProps['onReachTop'];
  overscan?: UnstyledMessageListRootProps['overscan'];
  renderItem?: UnstyledMessageListRootProps['renderItem'];
  scrollToBottomAffordance?: React.ReactNode;
  slotProps?: ChatConversationSlotProps;
  slots?: Partial<ChatConversationSlots>;
  sx?: SxProps<Theme>;
  typingIndicator?: React.ReactNode;
  virtualization?: UnstyledMessageListRootProps['virtualization'];
}

const ChatConversationRootSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  ...getChatCssVars(theme),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
}));

const ChatConversationHeaderSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'Header',
})(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid var(${chatCssVarKeys.composerBorder})`,
  columnGap: theme.spacing(1.5),
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gridTemplateRows: 'auto auto',
  minWidth: 0,
  padding: theme.spacing(2),
  rowGap: theme.spacing(0.5),
}));

const ChatConversationTitleSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'Title',
})(({ theme }) => ({
  ...theme.typography.h6,
  gridColumn: 1,
  gridRow: 1,
  minWidth: 0,
}));

const ChatConversationSubtitleSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'Subtitle',
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  gridColumn: 1,
  gridRow: 2,
  minWidth: 0,
}));

const ChatConversationActionsSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'Actions',
})(({ theme }) => ({
  alignItems: 'center',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  gridColumn: 2,
  gridRow: '1 / span 2',
  justifySelf: 'end',
}));

const ChatConversationMessageListSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'MessageList',
})(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  position: 'relative',
}));

const ChatConversationMessageListScrollerSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'MessageListScroller',
})(({ theme }) => ({
  flex: '1 1 auto',
  minHeight: 0,
  minWidth: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingBlock: theme.spacing(1.5),
}));

const ChatConversationMessageListContentSlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'MessageListContent',
})(({ theme }) => ({
  minWidth: 0,
  paddingInline: theme.spacing(2),
  [`& > [data-message-list-row] + [data-message-list-row]`]: {
    marginBlockStart: theme.spacing(1.5),
  },
}));

const ChatConversationMessageListOverlaySlot = styled('div', {
  name: 'MuiChatConversation',
  slot: 'MessageListOverlay',
})(({ theme }) => ({
  alignItems: 'flex-end',
  bottom: theme.spacing(2),
  display: 'flex',
  insetInlineEnd: theme.spacing(2),
  justifyContent: 'flex-end',
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: 1,
  '& > *': {
    pointerEvents: 'auto',
  },
}));

const ChatConversationActionButton = styled('button')(({ theme }) => ({
  ...theme.typography.caption,
  backgroundColor: 'transparent',
  border: 0,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  padding: theme.spacing(0.5, 0.75),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  '&:focus-visible': {
    outline: `2px solid var(${chatCssVarKeys.composerFocusRing})`,
    outlineOffset: 2,
  },
}));

function DefaultConversationRow(props: { id: string; index: number }) {
  const { id, index } = props;
  const { retry } = useChat();
  const message = useMessage(id);
  const copyableText = React.useMemo(() => getCopyableText(message), [message]);
  const hasRetry = message?.role === 'user' && message.status === 'error';
  const hasActions = Boolean(copyableText) || hasRetry;

  const handleCopy = React.useCallback(async () => {
    if (!copyableText || !navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(copyableText);
  }, [copyableText]);

  const handleRetry = React.useCallback(() => {
    retry(id);
  }, [id, retry]);

  return (
    <React.Fragment>
      <ChatUnreadMarker index={index} messageId={id} />
      <ChatDateDivider index={index} messageId={id} />
      <ChatMessageGroup index={index} messageId={id}>
        <StyledChatMessage.Avatar />
        <StyledChatMessage.Content />
        <StyledChatMessage.Meta />
        {hasActions ? (
          <StyledChatMessage.Actions>
            {copyableText ? (
              <ChatConversationActionButton onClick={handleCopy} type="button">
                Copy
              </ChatConversationActionButton>
            ) : null}
            {hasRetry ? (
              <ChatConversationActionButton onClick={handleRetry} type="button">
                Retry
              </ChatConversationActionButton>
            ) : null}
          </StyledChatMessage.Actions>
        ) : null}
      </ChatMessageGroup>
    </React.Fragment>
  );
}

function createDefaultRootSlot(sx: ChatConversationProps['sx']) {
  return React.forwardRef(function DefaultRoot(
    props: React.HTMLAttributes<HTMLDivElement> & {
      ownerState?: unknown;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationRootSlot
        className={joinClassNames(chatConversationClasses.root, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export const ChatConversation = React.forwardRef(function ChatConversation(
  inProps: ChatConversationProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatConversation',
  });
  const {
    actions,
    className,
    estimatedItemSize,
    getItemKey,
    items,
    onReachTop,
    overscan,
    renderItem,
    scrollToBottomAffordance = <ChatScrollToBottomAffordance />,
    slotProps,
    slots,
    sx,
    typingIndicator = <ChatTypingIndicator />,
    virtualization,
    ...other
  } = props;

  const Root = React.useMemo(() => slots?.root ?? createDefaultRootSlot(sx), [slots?.root, sx]);
  const Header = slots?.header ?? ChatConversationHeaderSlot;
  const Title = slots?.title ?? ChatConversationTitleSlot;
  const Subtitle = slots?.subtitle ?? ChatConversationSubtitleSlot;
  const Actions = slots?.actions ?? ChatConversationActionsSlot;
  const MessageList = slots?.messageList ?? ChatConversationMessageListSlot;
  const MessageListScroller = slots?.messageListScroller ?? ChatConversationMessageListScrollerSlot;
  const MessageListContent = slots?.messageListContent ?? ChatConversationMessageListContentSlot;
  const MessageListOverlay = slots?.messageListOverlay ?? ChatConversationMessageListOverlaySlot;
  const resolvedRenderItem = React.useCallback<NonNullable<ChatConversationProps['renderItem']>>(
    ({ id, index }) =>
      renderItem?.({ id, index }) ?? <DefaultConversationRow id={id} index={index} />,
    [renderItem],
  );

  return (
    <ConversationRoot
      ref={ref}
      slotProps={{
        root: mergeSlotPropsWithClassName(
          slotProps?.root,
          joinClassNames(chatConversationClasses.root, className),
        ),
      }}
      slots={{ root: Root }}
      {...other}
    >
      <ConversationHeader
        slotProps={{
          header: mergeSlotPropsWithClassName(slotProps?.header, chatConversationClasses.header),
        }}
        slots={{ header: Header }}
      >
        <ConversationTitle
          slotProps={{
            title: mergeSlotPropsWithClassName(slotProps?.title, chatConversationClasses.title),
          }}
          slots={{ title: Title }}
        />
        <ConversationSubtitle
          slotProps={{
            subtitle: mergeSlotPropsWithClassName(
              slotProps?.subtitle,
              chatConversationClasses.subtitle,
            ),
          }}
          slots={{ subtitle: Subtitle }}
        />
        <ConversationHeaderActions
          slotProps={{
            actions: mergeSlotPropsWithClassName(
              slotProps?.actions,
              chatConversationClasses.actions,
            ),
          }}
          slots={{ actions: Actions }}
        >
          {actions}
        </ConversationHeaderActions>
      </ConversationHeader>
      <MessageListRoot
        estimatedItemSize={estimatedItemSize}
        getItemKey={getItemKey}
        items={items}
        onReachTop={onReachTop}
        overlay={scrollToBottomAffordance}
        overscan={overscan}
        renderItem={resolvedRenderItem}
        slotProps={{
          messageList: mergeSlotPropsWithClassName(
            slotProps?.messageList,
            chatConversationClasses.messageList,
          ),
          messageListScroller: mergeSlotPropsWithClassName(
            slotProps?.messageListScroller,
            chatConversationClasses.messageListScroller,
          ),
          messageListContent: mergeSlotPropsWithClassName(
            slotProps?.messageListContent,
            chatConversationClasses.messageListContent,
          ),
          messageListOverlay: mergeSlotPropsWithClassName(
            slotProps?.messageListOverlay,
            chatConversationClasses.messageListOverlay,
          ),
        }}
        slots={{
          messageList: MessageList,
          messageListScroller: MessageListScroller,
          messageListContent: MessageListContent,
          messageListOverlay: MessageListOverlay,
        }}
        virtualization={virtualization}
      />
      {typingIndicator}
    </ConversationRoot>
  );
});

export { chatConversationClasses, getChatConversationUtilityClass };
