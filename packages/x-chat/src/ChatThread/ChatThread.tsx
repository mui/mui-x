'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import type { SlotComponentProps } from '@mui/utils/types';
import {
  useChat,
  useMessage,
  type ChatMessage as ChatMessageModel,
} from '@mui/x-chat-headless';
import {
  MessageListRoot,
  ThreadActions,
  ThreadHeader,
  ThreadRoot,
  ThreadSubtitle,
  ThreadTitle,
  type MessageListRootProps as UnstyledMessageListRootProps,
  type MessageListRootSlotProps as UnstyledMessageListRootSlotProps,
  type MessageListRootSlots as UnstyledMessageListRootSlots,
  type ThreadActionsSlotProps as UnstyledThreadActionsSlotProps,
  type ThreadActionsSlots as UnstyledThreadActionsSlots,
  type ThreadHeaderSlotProps as UnstyledThreadHeaderSlotProps,
  type ThreadHeaderSlots as UnstyledThreadHeaderSlots,
  type ThreadRootSlotProps as UnstyledThreadRootSlotProps,
  type ThreadRootSlots as UnstyledThreadRootSlots,
  type ThreadSubtitleSlotProps as UnstyledThreadSubtitleSlotProps,
  type ThreadSubtitleSlots as UnstyledThreadSubtitleSlots,
  type ThreadTitleSlotProps as UnstyledThreadTitleSlotProps,
  type ThreadTitleSlots as UnstyledThreadTitleSlots,
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
import { chatThreadClasses, getChatThreadUtilityClass } from './chatThreadClasses';

export interface ChatThreadSlots {
  root: UnstyledThreadRootSlots['root'];
  header: UnstyledThreadHeaderSlots['header'];
  title: UnstyledThreadTitleSlots['title'];
  subtitle: UnstyledThreadSubtitleSlots['subtitle'];
  actions: UnstyledThreadActionsSlots['actions'];
  messageList: UnstyledMessageListRootSlots['messageList'];
  messageListScroller: UnstyledMessageListRootSlots['messageListScroller'];
  messageListContent: UnstyledMessageListRootSlots['messageListContent'];
  messageListOverlay: UnstyledMessageListRootSlots['messageListOverlay'];
}

export interface ChatThreadSlotProps {
  root?: UnstyledThreadRootSlotProps['root'];
  header?: UnstyledThreadHeaderSlotProps['header'];
  title?: UnstyledThreadTitleSlotProps['title'];
  subtitle?: UnstyledThreadSubtitleSlotProps['subtitle'];
  actions?: UnstyledThreadActionsSlotProps['actions'];
  messageList?: UnstyledMessageListRootSlotProps['messageList'];
  messageListScroller?: UnstyledMessageListRootSlotProps['messageListScroller'];
  messageListContent?: UnstyledMessageListRootSlotProps['messageListContent'];
  messageListOverlay?: UnstyledMessageListRootSlotProps['messageListOverlay'];
}

export interface ChatThreadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  actions?: React.ReactNode;
  className?: string;
  estimatedItemSize?: UnstyledMessageListRootProps['estimatedItemSize'];
  getItemKey?: UnstyledMessageListRootProps['getItemKey'];
  items?: UnstyledMessageListRootProps['items'];
  onReachTop?: UnstyledMessageListRootProps['onReachTop'];
  overscan?: UnstyledMessageListRootProps['overscan'];
  renderItem?: UnstyledMessageListRootProps['renderItem'];
  scrollToBottomAffordance?: React.ReactNode;
  slotProps?: ChatThreadSlotProps;
  slots?: Partial<ChatThreadSlots>;
  sx?: SxProps<Theme>;
  typingIndicator?: React.ReactNode;
  virtualization?: UnstyledMessageListRootProps['virtualization'];
}

function getCopyableText(message: ChatMessageModel | null) {
  if (message == null) {
    return '';
  }

  return message.parts
    .filter((part): part is Extract<ChatMessageModel['parts'][number], { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('\n\n')
    .trim();
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function mergeSlotPropsWithClassName<TOwnerState>(
  slotProps: SlotComponentProps<any, {}, TOwnerState> | undefined,
  className: string,
) {
  return (ownerState: TOwnerState) => {
    const resolved = resolveComponentProps(slotProps, ownerState) ?? {};

    return {
      ...resolved,
      className: joinClassNames(className, (resolved as { className?: string }).className),
    };
  };
}

const ChatThreadRootSlot = styled('div', {
  name: 'MuiChatThread',
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

const ChatThreadHeaderSlot = styled('div', {
  name: 'MuiChatThread',
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

const ChatThreadTitleSlot = styled('div', {
  name: 'MuiChatThread',
  slot: 'Title',
})(({ theme }) => ({
  ...theme.typography.h6,
  gridColumn: 1,
  gridRow: 1,
  minWidth: 0,
}));

const ChatThreadSubtitleSlot = styled('div', {
  name: 'MuiChatThread',
  slot: 'Subtitle',
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  gridColumn: 1,
  gridRow: 2,
  minWidth: 0,
}));

const ChatThreadActionsSlot = styled('div', {
  name: 'MuiChatThread',
  slot: 'Actions',
})(({ theme }) => ({
  alignItems: 'center',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  gridColumn: 2,
  gridRow: '1 / span 2',
  justifySelf: 'end',
}));

const ChatThreadMessageListSlot = styled('div', {
  name: 'MuiChatThread',
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

const ChatThreadMessageListScrollerSlot = styled('div', {
  name: 'MuiChatThread',
  slot: 'MessageListScroller',
})(({ theme }) => ({
  flex: '1 1 auto',
  minHeight: 0,
  minWidth: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingBlock: theme.spacing(1.5),
}));

const ChatThreadMessageListContentSlot = styled('div', {
  name: 'MuiChatThread',
  slot: 'MessageListContent',
})(({ theme }) => ({
  minWidth: 0,
  paddingInline: theme.spacing(2),
  [`& > [data-message-list-row] + [data-message-list-row]`]: {
    marginBlockStart: theme.spacing(1.5),
  },
}));

const ChatThreadMessageListOverlaySlot = styled('div', {
  name: 'MuiChatThread',
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

const ChatThreadActionButton = styled('button')(({ theme }) => ({
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

function DefaultThreadRow(props: { id: string; index: number }) {
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
              <ChatThreadActionButton onClick={handleCopy} type="button">
                Copy
              </ChatThreadActionButton>
            ) : null}
            {hasRetry ? (
              <ChatThreadActionButton onClick={handleRetry} type="button">
                Retry
              </ChatThreadActionButton>
            ) : null}
          </StyledChatMessage.Actions>
        ) : null}
      </ChatMessageGroup>
    </React.Fragment>
  );
}

function createDefaultRootSlot(sx: ChatThreadProps['sx']) {
  return React.forwardRef(function DefaultRoot(
    props: React.HTMLAttributes<HTMLDivElement> & {
      ownerState?: unknown;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatThreadRootSlot
        className={joinClassNames(chatThreadClasses.root, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export const ChatThread = React.forwardRef(function ChatThread(
  inProps: ChatThreadProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatThread',
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

  const Root = React.useMemo(
    () => slots?.root ?? createDefaultRootSlot(sx),
    [slots?.root, sx],
  );
  const Header = slots?.header ?? ChatThreadHeaderSlot;
  const Title = slots?.title ?? ChatThreadTitleSlot;
  const Subtitle = slots?.subtitle ?? ChatThreadSubtitleSlot;
  const Actions = slots?.actions ?? ChatThreadActionsSlot;
  const MessageList = slots?.messageList ?? ChatThreadMessageListSlot;
  const MessageListScroller = slots?.messageListScroller ?? ChatThreadMessageListScrollerSlot;
  const MessageListContent = slots?.messageListContent ?? ChatThreadMessageListContentSlot;
  const MessageListOverlay = slots?.messageListOverlay ?? ChatThreadMessageListOverlaySlot;
  const resolvedRenderItem = React.useCallback<NonNullable<ChatThreadProps['renderItem']>>(
    ({ id, index }) => renderItem?.({ id, index }) ?? <DefaultThreadRow id={id} index={index} />,
    [renderItem],
  );

  return (
    <ThreadRoot
      ref={ref}
      slotProps={{
        root: mergeSlotPropsWithClassName(slotProps?.root, joinClassNames(chatThreadClasses.root, className)),
      }}
      slots={{ root: Root }}
      {...other}
    >
      <ThreadHeader
        slotProps={{ header: mergeSlotPropsWithClassName(slotProps?.header, chatThreadClasses.header) }}
        slots={{ header: Header }}
      >
        <ThreadTitle
          slotProps={{ title: mergeSlotPropsWithClassName(slotProps?.title, chatThreadClasses.title) }}
          slots={{ title: Title }}
        />
        <ThreadSubtitle
          slotProps={{
            subtitle: mergeSlotPropsWithClassName(slotProps?.subtitle, chatThreadClasses.subtitle),
          }}
          slots={{ subtitle: Subtitle }}
        />
        <ThreadActions
          slotProps={{ actions: mergeSlotPropsWithClassName(slotProps?.actions, chatThreadClasses.actions) }}
          slots={{ actions: Actions }}
        >
          {actions}
        </ThreadActions>
      </ThreadHeader>
      <MessageListRoot
        estimatedItemSize={estimatedItemSize}
        getItemKey={getItemKey}
        items={items}
        onReachTop={onReachTop}
        overlay={scrollToBottomAffordance}
        overscan={overscan}
        renderItem={resolvedRenderItem}
        slotProps={{
          messageList: mergeSlotPropsWithClassName(slotProps?.messageList, chatThreadClasses.messageList),
          messageListScroller: mergeSlotPropsWithClassName(
            slotProps?.messageListScroller,
            chatThreadClasses.messageListScroller,
          ),
          messageListContent: mergeSlotPropsWithClassName(
            slotProps?.messageListContent,
            chatThreadClasses.messageListContent,
          ),
          messageListOverlay: mergeSlotPropsWithClassName(
            slotProps?.messageListOverlay,
            chatThreadClasses.messageListOverlay,
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
    </ThreadRoot>
  );
});

export { chatThreadClasses, getChatThreadUtilityClass };
