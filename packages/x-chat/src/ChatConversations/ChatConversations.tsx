'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system/createStyled';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import type { SlotComponentProps } from '@mui/utils/types';
import { useChat, useChatStatus } from '@mui/x-chat-headless';
import {
  ConversationListRoot,
  type ConversationListItemProps,
  type ConversationListItemAvatarProps,
  type ConversationListPreviewProps,
  type ConversationListRootProps as UnstyledConversationListRootProps,
  type ConversationListRootSlotProps as UnstyledConversationListRootSlotProps,
  type ConversationListRootSlots as UnstyledConversationListRootSlots,
  type ConversationListTimestampProps,
  type ConversationListTitleProps,
  type ConversationListUnreadBadgeProps,
} from '@mui/x-chat-unstyled';
import { useChatLocaleText } from '@mui/x-chat-unstyled/chat';
import composeClasses from '@mui/utils/composeClasses';
import { ChatConversationSkeleton } from '../ChatConversationSkeleton';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import {
  type ChatConversationsClasses,
  chatConversationsClasses,
  getChatConversationsUtilityClass,
} from './chatConversationsClasses';

const useUtilityClasses = (classesProp?: Partial<ChatConversationsClasses>) => {
  const slots = {
    root: ['root'],
    loadingState: ['loadingState'],
    emptyState: ['emptyState'],
    errorState: ['errorState'],
    item: ['item'],
    itemAvatar: ['itemAvatar'],
    title: ['title'],
    preview: ['preview'],
    timestamp: ['timestamp'],
    unreadBadge: ['unreadBadge'],
    state: ['state'],
    stateGlyph: ['stateGlyph'],
  };
  return composeClasses(slots, getChatConversationsUtilityClass, classesProp);
};

export interface ChatConversationsSlots extends UnstyledConversationListRootSlots {
  loadingState: React.ElementType;
  emptyState: React.ElementType;
  errorState: React.ElementType;
}

export interface ChatConversationsStateOwnerState extends ChatConversationsRootOwnerState {
  errorMessage?: string;
  state: 'loading' | 'empty' | 'error';
}

export interface ChatConversationsSlotProps extends UnstyledConversationListRootSlotProps {
  loadingState?: SlotComponentProps<'div', {}, ChatConversationsStateOwnerState>;
  emptyState?: SlotComponentProps<'div', {}, ChatConversationsStateOwnerState>;
  errorState?: SlotComponentProps<'div', {}, ChatConversationsStateOwnerState>;
}

export interface ChatConversationsProps extends Omit<
  UnstyledConversationListRootProps,
  'slotProps' | 'slots'
> {
  classes?: Partial<ChatConversationsClasses>;
  className?: string;
  dense?: boolean;
  emptyAction?: React.ReactNode;
  /**
   * The visual variant of the conversation list.
   * - `"rich"`: Shows avatar, title, preview, timestamp, and unread badge (Slack-style).
   * - `"compact"`: Shows title only with a small unread dot (ChatGPT-style).
   * @default "rich"
   */
  variant?: 'rich' | 'compact';
  slotProps?: ChatConversationsSlotProps;
  slots?: Partial<ChatConversationsSlots>;
  sx?: SxProps<Theme>;
}

interface ChatConversationsRootOwnerState {
  dense: boolean;
  variant: 'rich' | 'compact';
}

interface ChatConversationsItemOwnerState {
  conversation: ConversationListItemProps['conversation'];
  dense: boolean;
  focused: boolean;
  selected: boolean;
  unread: boolean;
  variant: 'rich' | 'compact';
}

interface ChatConversationsPieceOwnerState extends ChatConversationsItemOwnerState {}

function getAvatarLabel(props: { title?: string; id: string; participantName?: string }) {
  return props.participantName ?? props.title ?? props.id;
}

function getAvatarFallback(props: { title?: string; id: string; participantName?: string }) {
  const source = getAvatarLabel(props).trim();

  if (!source) {
    return props.id.slice(0, 2).toUpperCase();
  }

  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function getDisplayUnreadCount(unreadCount: number | undefined) {
  if (unreadCount == null || unreadCount <= 0) {
    return null;
  }

  return unreadCount > 99 ? '99+' : String(unreadCount);
}

// ─── Shared styled slots ──────────────────────────────────────────────────────

const ChatConversationsRootSlot = styled('div', {
  name: 'MuiChatConversations',
  slot: 'Root',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'dense',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: ChatConversationsRootOwnerState }>(({ theme }) => ({
  ...getChatCssVars(theme),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0,
}));

const ChatConversationsStateSlot = styled('div', {
  name: 'MuiChatConversations',
  slot: 'State',
  overridesResolver: (_, styles) => styles.state,
})(({ theme }) => ({
  alignItems: 'center',
  color: (theme.vars || theme).palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  justifyContent: 'center',
  minHeight: theme.spacing(30),
  minWidth: 0,
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const ChatConversationsStateGlyph = styled('div', {
  name: 'MuiChatConversations',
  slot: 'StateGlyph',
  overridesResolver: (_, styles) => styles.stateGlyph,
})(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: (theme.vars || theme).palette.action.hover,
  borderRadius: '50%',
  color: (theme.vars || theme).palette.text.primary,
  display: 'inline-flex',
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  height: 56,
  justifyContent: 'center',
  width: 56,
}));

// ─── Rich variant styled slots ────────────────────────────────────────────────

const ChatConversationsRichItemSlot = styled('div', {
  name: 'MuiChatConversations',
  slot: 'Item',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.item,
})<{ ownerState: ChatConversationsItemOwnerState }>(({ theme, ownerState }) => ({
  alignItems: 'center',
  backgroundColor: ownerState.selected
    ? `var(${chatCssVarKeys.conversationSelectedBg})`
    : 'transparent',
  borderRadius: theme.shape.borderRadius,
  color: ownerState.selected ? `var(${chatCssVarKeys.conversationSelectedColor})` : 'inherit',
  columnGap: theme.spacing(ownerState.dense ? 1 : 1.5),
  cursor: 'pointer',
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  gridTemplateRows: 'auto auto',
  minWidth: 0,
  outline: 0,
  padding: theme.spacing(ownerState.dense ? 1 : 1.25, ownerState.dense ? 1.25 : 1.5),
  rowGap: theme.spacing(0.25),
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: ownerState.selected
      ? `var(${chatCssVarKeys.conversationSelectedBg})`
      : `var(${chatCssVarKeys.conversationHoverBg})`,
  },
  '&:focus-visible': {
    boxShadow: `inset 0 0 0 2px var(${chatCssVarKeys.composerFocusRing})`,
  },
  [`& .${chatConversationsClasses.itemAvatar}`]: {
    gridColumn: 1,
    gridRow: '1 / span 2',
  },
  [`& .${chatConversationsClasses.title}`]: {
    gridColumn: 2,
    gridRow: 1,
    minWidth: 0,
  },
  [`& .${chatConversationsClasses.preview}`]: {
    gridColumn: 2,
    gridRow: 2,
    minWidth: 0,
  },
  [`& .${chatConversationsClasses.timestamp}`]: {
    gridColumn: 3,
    gridRow: 1,
    justifySelf: 'end',
    minWidth: 0,
  },
  [`& .${chatConversationsClasses.unreadBadge}`]: {
    gridColumn: 3,
    gridRow: 2,
    justifySelf: 'end',
  },
}));

// ─── Compact variant styled slots ─────────────────────────────────────────────

const ChatConversationsCompactItemSlot = styled('div', {
  name: 'MuiChatConversations',
  slot: 'Item',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.item,
})<{ ownerState: ChatConversationsItemOwnerState }>(({ theme, ownerState }) => ({
  alignItems: 'center',
  backgroundColor: ownerState.selected
    ? `var(${chatCssVarKeys.conversationSelectedBg})`
    : 'transparent',
  borderRadius: theme.shape.borderRadius,
  color: ownerState.selected ? `var(${chatCssVarKeys.conversationSelectedColor})` : 'inherit',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  minWidth: 0,
  outline: 0,
  padding: theme.spacing(ownerState.dense ? 0.75 : 1, ownerState.dense ? 1 : 1.25),
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: ownerState.selected
      ? `var(${chatCssVarKeys.conversationSelectedBg})`
      : `var(${chatCssVarKeys.conversationHoverBg})`,
  },
  '&:focus-visible': {
    boxShadow: `inset 0 0 0 2px var(${chatCssVarKeys.composerFocusRing})`,
  },
  [`& .${chatConversationsClasses.title}`]: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  [`& .${chatConversationsClasses.unreadBadge}`]: {
    flexShrink: 0,
  },
}));

const ChatConversationsAvatarSlot = styled(Avatar, {
  name: 'MuiChatConversations',
  slot: 'ItemAvatar',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.itemAvatar,
})<{ ownerState: ChatConversationsPieceOwnerState }>(({ theme, ownerState }) => ({
  fontSize: theme.typography.pxToRem(ownerState.dense ? 12 : 14),
  height: ownerState.dense ? 32 : 40,
  width: ownerState.dense ? 32 : 40,
}));

const ChatConversationsTitleSlot = styled('div', {
  name: 'MuiChatConversations',
  slot: 'Title',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.title,
})<{ ownerState: ChatConversationsPieceOwnerState }>(({ theme, ownerState }) => ({
  ...theme.typography.body1,
  fontWeight: ownerState.selected
    ? theme.typography.fontWeightMedium
    : theme.typography.fontWeightRegular,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const ChatConversationsPreviewSlot = styled('div', {
  name: 'MuiChatConversations',
  slot: 'Preview',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.preview,
})<{ ownerState: ChatConversationsPieceOwnerState }>(({ theme }) => ({
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const ChatConversationsTimestampSlot = styled('div', {
  name: 'MuiChatConversations',
  slot: 'Timestamp',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.timestamp,
})<{ ownerState: ChatConversationsPieceOwnerState }>(({ theme }) => ({
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.secondary,
  textAlign: 'end',
}));

const ChatConversationsUnreadBadgeSlot = styled('span', {
  name: 'MuiChatConversations',
  slot: 'UnreadBadge',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.unreadBadge,
})<{ ownerState: ChatConversationsPieceOwnerState }>(({ theme }) => ({
  ...theme.typography.caption,
  alignItems: 'center',
  backgroundColor: (theme.vars || theme).palette.primary.main,
  borderRadius: 999,
  color: (theme.vars || theme).palette.primary.contrastText,
  display: 'inline-flex',
  fontWeight: theme.typography.fontWeightMedium,
  justifyContent: 'center',
  minHeight: 20,
  minWidth: 20,
  paddingInline: theme.spacing(0.75),
}));

const ChatConversationsUnreadDotSlot = styled('span', {
  name: 'MuiChatConversations',
  slot: 'UnreadBadge',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'ownerState',
  overridesResolver: (_, styles) => styles.unreadBadge,
})<{ ownerState: ChatConversationsPieceOwnerState }>(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.primary.main,
  borderRadius: '50%',
  display: 'inline-block',
  height: 8,
  width: 8,
  flexShrink: 0,
}));

// ─── Default slot factories ───────────────────────────────────────────────────

function createDefaultRootSlot(
  dense: boolean,
  variant: 'rich' | 'compact',
  sx: ChatConversationsProps['sx'],
) {
  return React.forwardRef(function DefaultRoot(
    props: React.HTMLAttributes<HTMLDivElement> & {
      ownerState?: ChatConversationsRootOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationsRootSlot
        className={joinClassNames(chatConversationsClasses.root, className)}
        ownerState={{ dense, variant }}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

function createDefaultStateSlot() {
  return React.forwardRef(function DefaultState(
    props: React.HTMLAttributes<HTMLDivElement> & {
      ownerState?: ChatConversationsStateOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { children, className, ownerState, ...other } = props;

    return (
      <ChatConversationsStateSlot className={className} ref={ref} {...other}>
        {ownerState?.state === 'loading' ? (
          <CircularProgress size={28} />
        ) : (
          <ChatConversationsStateGlyph>
            {ownerState?.state === 'error' ? '!' : '\u2218'}
          </ChatConversationsStateGlyph>
        )}
        {children}
      </ChatConversationsStateSlot>
    );
  });
}

function createDefaultRichItemSlot(dense: boolean) {
  return React.forwardRef(function DefaultRichItem(
    props: ConversationListItemProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const mergedOwnerState: ChatConversationsItemOwnerState = {
      conversation,
      dense,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant: 'rich',
    };

    return (
      <ChatConversationsRichItemSlot
        className={joinClassNames(chatConversationsClasses.item, className)}
        ownerState={mergedOwnerState}
        ref={ref}
        {...other}
      />
    );
  });
}

function createDefaultCompactItemSlot(dense: boolean) {
  return React.forwardRef(function DefaultCompactItem(
    props: ConversationListItemProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const mergedOwnerState: ChatConversationsItemOwnerState = {
      conversation,
      dense,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant: 'compact',
    };

    return (
      <ChatConversationsCompactItemSlot
        className={joinClassNames(chatConversationsClasses.item, className)}
        ownerState={mergedOwnerState}
        ref={ref}
        {...other}
      />
    );
  });
}

function createDefaultItemAvatarSlot(dense: boolean) {
  return React.forwardRef(function DefaultItemAvatar(
    props: ConversationListItemAvatarProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const participant = conversation.participants?.[0];
    const mergedOwnerState: ChatConversationsPieceOwnerState = {
      conversation,
      dense,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant: ownerState?.variant ?? 'rich',
    };

    return (
      <ChatConversationsAvatarSlot
        alt={getAvatarLabel({
          id: conversation.id,
          participantName: participant?.displayName,
          title: conversation.title,
        })}
        className={joinClassNames(chatConversationsClasses.itemAvatar, className)}
        ownerState={mergedOwnerState}
        ref={ref as React.Ref<HTMLDivElement>}
        src={participant?.avatarUrl}
        {...other}
      >
        {!participant?.avatarUrl
          ? getAvatarFallback({
              id: conversation.id,
              participantName: participant?.displayName,
              title: conversation.title,
            })
          : null}
      </ChatConversationsAvatarSlot>
    );
  });
}

/** Null avatar for compact variant */
function NullItemAvatar(_props: ConversationListItemAvatarProps) {
  return null;
}

function createDefaultTitleSlot(dense: boolean, variant: 'rich' | 'compact') {
  return React.forwardRef(function DefaultTitle(
    props: ConversationListTitleProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const mergedOwnerState: ChatConversationsPieceOwnerState = {
      conversation,
      dense,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant,
    };

    return (
      <ChatConversationsTitleSlot
        className={joinClassNames(chatConversationsClasses.title, className)}
        ownerState={mergedOwnerState}
        ref={ref as React.Ref<HTMLDivElement>}
        {...other}
      >
        {conversation.title ?? conversation.id}
      </ChatConversationsTitleSlot>
    );
  });
}

function createDefaultPreviewSlot(dense: boolean) {
  return React.forwardRef(function DefaultPreview(
    props: ConversationListPreviewProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const mergedOwnerState: ChatConversationsPieceOwnerState = {
      conversation,
      dense,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant: 'rich',
    };

    if (!conversation.subtitle) {
      return null;
    }

    return (
      <ChatConversationsPreviewSlot
        className={joinClassNames(chatConversationsClasses.preview, className)}
        ownerState={mergedOwnerState}
        ref={ref as React.Ref<HTMLDivElement>}
        {...other}
      >
        {conversation.subtitle}
      </ChatConversationsPreviewSlot>
    );
  });
}

/** Null preview for compact variant */
function NullPreview(_props: ConversationListPreviewProps) {
  return null;
}

function createDefaultTimestampSlot(dense: boolean) {
  return React.forwardRef(function DefaultTimestamp(
    props: ConversationListTimestampProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const localeText = useChatLocaleText();
    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
      setHydrated(true);
    }, []);
    const mergedOwnerState: ChatConversationsPieceOwnerState = {
      conversation,
      dense,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant: 'rich',
    };

    if (!conversation.lastMessageAt) {
      return null;
    }

    return (
      <ChatConversationsTimestampSlot
        className={joinClassNames(chatConversationsClasses.timestamp, className)}
        ownerState={mergedOwnerState}
        ref={ref as React.Ref<HTMLDivElement>}
        {...other}
      >
        <time dateTime={conversation.lastMessageAt}>
          {hydrated ? localeText.conversationTimestampLabel(conversation.lastMessageAt) : ''}
        </time>
      </ChatConversationsTimestampSlot>
    );
  });
}

/** Null timestamp for compact variant */
function NullTimestamp(_props: ConversationListTimestampProps) {
  return null;
}

function createDefaultUnreadBadgeSlot(dense: boolean) {
  return React.forwardRef(function DefaultUnreadBadge(
    props: ConversationListUnreadBadgeProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const mergedOwnerState: ChatConversationsPieceOwnerState = {
      conversation,
      dense,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant: 'rich',
    };
    const unreadCount = getDisplayUnreadCount(conversation.unreadCount);

    if (!unreadCount) {
      return null;
    }

    return (
      <ChatConversationsUnreadBadgeSlot
        className={joinClassNames(chatConversationsClasses.unreadBadge, className)}
        ownerState={mergedOwnerState}
        ref={ref as React.Ref<HTMLDivElement>}
        {...other}
      >
        {unreadCount}
      </ChatConversationsUnreadBadgeSlot>
    );
  });
}

function createDefaultCompactUnreadDotSlot() {
  return React.forwardRef(function DefaultCompactUnreadDot(
    props: ConversationListUnreadBadgeProps & {
      ownerState?: ChatConversationsItemOwnerState;
    },
    ref: React.Ref<HTMLSpanElement>,
  ) {
    const { className, conversation, focused, ownerState, selected, unread, ...other } = props;
    const mergedOwnerState: ChatConversationsPieceOwnerState = {
      conversation,
      dense: ownerState?.dense ?? false,
      focused: focused ?? ownerState?.focused ?? false,
      selected: selected ?? ownerState?.selected ?? false,
      unread: unread ?? ownerState?.unread ?? false,
      variant: 'compact',
    };
    const hasUnread =
      (conversation.unreadCount != null && conversation.unreadCount > 0) ||
      conversation.readState === 'unread';

    if (!hasUnread) {
      return null;
    }

    return (
      <ChatConversationsUnreadDotSlot
        className={joinClassNames(chatConversationsClasses.unreadBadge, className)}
        ownerState={mergedOwnerState}
        ref={ref as React.Ref<HTMLSpanElement>}
        {...(other as React.HTMLAttributes<HTMLSpanElement>)}
      />
    );
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

type ChatConversationsComponent = ((
  props: ChatConversationsProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const ChatConversations = React.forwardRef(function ChatConversations(
  inProps: ChatConversationsProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    name: 'MuiChatConversations',
    props: inProps,
  });
  const {
    classes: classesProp,
    className,
    dense = false,
    emptyAction,
    slotProps,
    slots,
    sx,
    variant = 'rich',
    ...other
  } = props;
  const classes = useUtilityClasses(classesProp);
  const { conversations, reloadConversations } = useChat();
  const { conversationError, isLoadingConversations } = useChatStatus();
  const localeText = useChatLocaleText();
  const rootOwnerState = React.useMemo(() => ({ dense, variant }), [dense, variant]);

  const defaultSlots = React.useMemo(
    () => ({
      emptyState: createDefaultStateSlot(),
      errorState: createDefaultStateSlot(),
      item:
        variant === 'compact'
          ? createDefaultCompactItemSlot(dense)
          : createDefaultRichItemSlot(dense),
      itemAvatar: variant === 'compact' ? NullItemAvatar : createDefaultItemAvatarSlot(dense),
      loadingState: createDefaultStateSlot(),
      preview: variant === 'compact' ? NullPreview : createDefaultPreviewSlot(dense),
      root: createDefaultRootSlot(dense, variant, sx),
      timestamp: variant === 'compact' ? NullTimestamp : createDefaultTimestampSlot(dense),
      title: createDefaultTitleSlot(dense, variant),
      unreadBadge:
        variant === 'compact'
          ? createDefaultCompactUnreadDotSlot()
          : createDefaultUnreadBadgeSlot(dense),
    }),
    [dense, sx, variant],
  );

  const Root = slots?.root ?? defaultSlots.root;
  const LoadingState = slots?.loadingState ?? defaultSlots.loadingState;
  const EmptyState = slots?.emptyState ?? defaultSlots.emptyState;
  const ErrorState = slots?.errorState ?? defaultSlots.errorState;

  const renderState = (
    state: ChatConversationsStateOwnerState['state'],
    content: React.ReactNode,
  ) => {
    const ownerState: ChatConversationsStateOwnerState = {
      ...rootOwnerState,
      errorMessage: conversationError?.message,
      state,
    };
    let StateComponent: React.ElementType;
    let stateClassName: string;
    let resolvedSlotProps;
    if (state === 'loading') {
      StateComponent = LoadingState;
      stateClassName = classes.loadingState;
      resolvedSlotProps = slotProps?.loadingState;
    } else if (state === 'empty') {
      StateComponent = EmptyState;
      stateClassName = classes.emptyState;
      resolvedSlotProps = slotProps?.emptyState;
    } else {
      StateComponent = ErrorState;
      stateClassName = classes.errorState;
      resolvedSlotProps = slotProps?.errorState;
    }

    return (
      <Root
        className={joinClassNames(classes.root, className)}
        ownerState={rootOwnerState}
        ref={ref}
        {...other}
      >
        <StateComponent
          {...resolveComponentProps(resolvedSlotProps, ownerState)}
          className={joinClassNames(
            stateClassName,
            (resolveComponentProps(resolvedSlotProps, ownerState) as { className?: string } | null)
              ?.className,
          )}
          ownerState={ownerState}
        >
          {content}
        </StateComponent>
      </Root>
    );
  };

  if (isLoadingConversations && conversations.length === 0) {
    return renderState(
      'loading',
      <React.Fragment>
        <Typography color="text.primary" variant="body1">
          {localeText.loadingLabel}
        </Typography>
        <div style={{ display: 'grid', gap: dense ? 0 : 4, width: '100%' }}>
          {Array.from({ length: 4 }, (_, index) => (
            <ChatConversationSkeleton dense={dense} key={`conversation-skeleton-${index}`} />
          ))}
        </div>
      </React.Fragment>,
    );
  }

  if (conversationError && conversations.length === 0) {
    return renderState(
      'error',
      <React.Fragment>
        <Typography color="text.primary" variant="body1">
          {conversationError.message || localeText.genericErrorLabel}
        </Typography>
        <Button onClick={() => void reloadConversations()} type="button" variant="outlined">
          {localeText.retryButtonLabel}
        </Button>
      </React.Fragment>,
    );
  }

  if (conversations.length === 0) {
    return renderState(
      'empty',
      <React.Fragment>
        <Typography color="text.primary" variant="body1">
          {localeText.conversationListNoConversationsLabel}
        </Typography>
        {emptyAction}
      </React.Fragment>,
    );
  }

  return (
    <ConversationListRoot
      className={className}
      ref={ref}
      slotProps={{
        item: mergeSlotPropsWithClassName(slotProps?.item, classes.item),
        itemAvatar: mergeSlotPropsWithClassName(slotProps?.itemAvatar, classes.itemAvatar),
        preview: mergeSlotPropsWithClassName(slotProps?.preview, classes.preview),
        root: mergeSlotPropsWithClassName(slotProps?.root, classes.root),
        timestamp: mergeSlotPropsWithClassName(slotProps?.timestamp, classes.timestamp),
        title: mergeSlotPropsWithClassName(slotProps?.title, classes.title),
        unreadBadge: mergeSlotPropsWithClassName(slotProps?.unreadBadge, classes.unreadBadge),
      }}
      slots={{
        item: slots?.item ?? defaultSlots.item,
        itemAvatar: slots?.itemAvatar ?? defaultSlots.itemAvatar,
        preview: slots?.preview ?? defaultSlots.preview,
        root: slots?.root ?? defaultSlots.root,
        timestamp: slots?.timestamp ?? defaultSlots.timestamp,
        title: slots?.title ?? defaultSlots.title,
        unreadBadge: slots?.unreadBadge ?? defaultSlots.unreadBadge,
      }}
      {...other}
    />
  );
}) as ChatConversationsComponent;

ChatConversations.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  dense: PropTypes.bool,
  emptyAction: PropTypes.node,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  variant: PropTypes.oneOf(['compact', 'rich']),
} as any;

export { ChatConversations };

export { chatConversationsClasses, getChatConversationsUtilityClass };
