'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  ConversationListRoot,
  ConversationListItemAvatar,
  ConversationListItemContent,
  ConversationListTitle,
  ConversationListPreview,
  ConversationListTimestamp,
  ConversationListUnreadBadge,
  ConversationListItemActions,
  type ConversationListRootProps,
  type ConversationListRootSlots,
  type ConversationListRootSlotProps,
  type ConversationListItemProps,
  type ConversationListItemAvatarProps,
  type ConversationListItemContentProps,
  type ConversationListTitleProps,
  type ConversationListPreviewProps,
  type ConversationListTimestampProps,
  type ConversationListUnreadBadgeProps,
  type ConversationListItemActionsProps,
  type ConversationListItemOwnerState,
  type ConversationListVariant,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatConversationListUtilityClasses,
  type ChatConversationListClasses,
} from './chatConversationListClasses';

const useThemeProps = createUseThemeProps('MuiChatConversationList');

export interface ChatConversationListProps extends ConversationListRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationListClasses>;
  /**
   * The visual variant of the conversation list.
   * - `'default'` – shows avatar, title, preview, timestamp, and unread badge.
   * - `'compact'` – shows only a small unread indicator, the title, and an actions button.
   * @default 'default'
   */
  variant?: ConversationListVariant;
}

const ChatConversationListStyled = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  '--ChatBox-conversationListWidth': '260px',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0.5, 0),
  listStyle: 'none',
  margin: 0,
  width: '100%',
  boxSizing: 'border-box',
}));

const ChatConversationListScrollerStyled = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'Scroller',
  overridesResolver: (_, styles) => styles.scroller,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid',
  borderRightColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  flexShrink: 0,
  '@container chatbox (max-width: 599.95px)': {
    display: 'none',
  },
}));

// Plain-div viewport: the scroller above is a regular div (not ScrollArea.Root),
// so we must also replace the viewport slot to avoid rendering ScrollArea.Viewport
// without a ScrollArea.Root context (which throws during SSR).
const ChatConversationListViewportStyled = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'Viewport',
  overridesResolver: (_, styles) => styles.viewport,
})(() => ({
  flex: 1,
  overflow: 'auto',
  overscrollBehavior: 'contain',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
}));

// No-op scrollbar: native overflow on the viewport above handles scrolling,
// so we don't need the Base UI ScrollArea.Scrollbar / Thumb components.
const NoopScrollbar = React.forwardRef<HTMLDivElement>(function NoopScrollbar() {
  return null;
});

// Props forwarded by ConversationListRenderedItem as additionalProps to every item slot.
// They are intentionally NOT forwarded to the DOM to avoid React unknown-prop warnings.
// NOTE: providing a custom shouldForwardProp REPLACES MUI's default exclusion list, so we
// must also explicitly exclude 'ownerState', 'theme', 'sx', and 'as' here.

const itemSlotShouldForwardProp = (prop: string) =>
  ![
    'conversation',
    'selected',
    'unread',
    'focused',
    'variant',
    'ownerState',
    'theme',
    'sx',
    'as',
  ].includes(prop);

const ChatConversationListItemStyled = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'Item',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.item,
})<{
  ownerState?: {
    selected?: boolean;
    unread?: boolean;
    focused?: boolean;
    variant?: ConversationListVariant;
  };
}>(({ theme, ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  outline: 'none',
  borderRadius: 0,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shortest,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
  backgroundColor: ownerState?.selected
    ? (theme.vars || theme).palette.action.selected
    : 'transparent',
  '&:hover': {
    backgroundColor: ownerState?.selected
      ? (theme.vars || theme).palette.action.selected
      : (theme.vars || theme).palette.action.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: -2,
  },
  ...(ownerState?.variant === 'compact' && {
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1.5),
    borderRadius: theme.shape.borderRadius,
    '&:hover .MuiChatConversationList-itemActions': {
      opacity: 1,
    },
  }),
}));

// ---------------------------------------------------------------------------
// Styled inner roots — pure styling, no rendering logic.
// These are used as the `root` slot inside the unstyled sub-components below.
// ---------------------------------------------------------------------------

const ChatConversationListItemAvatarRoot = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'ItemAvatar',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.itemAvatar,
})(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: (theme.vars || theme).palette.grey[300],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.secondary,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const ChatConversationListItemContentRoot = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'ItemContent',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.itemContent,
})(() => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: 1,
}));

const ChatConversationListTitleRoot = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'ItemTitle',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.itemTitle,
})<{ ownerState?: { unread?: boolean } }>(({ theme, ownerState }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: ownerState?.unread
    ? theme.typography.fontWeightBold
    : theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: 1.4,
}));

const ChatConversationListPreviewRoot = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'ItemPreview',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.itemPreview,
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: 1.4,
}));

const ChatConversationListTimestampRoot = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'ItemTimestamp',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.itemTimestamp,
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  flexShrink: 0,
  alignSelf: 'flex-start',
  paddingTop: '2px',
  whiteSpace: 'nowrap',
}));

const ChatConversationListUnreadBadgeRoot = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'ItemUnreadBadge',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.itemUnreadBadge,
})<{ ownerState?: { variant?: ConversationListVariant } }>(({ theme, ownerState }) => ({
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.primary.contrastText,
  fontSize: '0.65rem',
  fontWeight: theme.typography.fontWeightBold,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 0.5),
  flexShrink: 0,
  alignSelf: 'center',
  lineHeight: 1,
  ...(ownerState?.variant === 'compact' && {
    minWidth: 8,
    width: 8,
    height: 8,
    borderRadius: '50%',
    padding: 0,
    fontSize: 0,
    overflow: 'hidden',
  }),
}));

// ---------------------------------------------------------------------------
// Item actions — visible on hover in compact mode, always available in default.
// ---------------------------------------------------------------------------

const ChatConversationListItemActionsRoot = styled('div', {
  name: 'MuiChatConversationList',
  slot: 'ItemActions',
  shouldForwardProp: itemSlotShouldForwardProp,
  overridesResolver: (_, styles) => styles.itemActions,
})<{ ownerState?: { variant?: ConversationListVariant } }>(({ theme, ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  ...(ownerState?.variant === 'compact' && {
    opacity: 0,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
    }),
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  }),
}));

// ---------------------------------------------------------------------------
// Wrapper slot components — keep the unstyled rendering logic, inject the
// styled root so MUI theming is applied.
// ---------------------------------------------------------------------------

// Wrapper around the styled item root that satisfies
// `React.JSXElementConstructor<ConversationListItemProps>`. The styled root
// uses `shouldForwardProp` to filter out the conversation-related props at
// runtime, so we just spread them through.
const ChatConversationListItemSlot = React.forwardRef<HTMLDivElement, ConversationListItemProps>(
  function ChatConversationListItemSlot(props, ref) {
    return <ChatConversationListItemStyled ref={ref} {...props} />;
  },
);

const ChatConversationListItemAvatarStyled = React.forwardRef<
  HTMLDivElement,
  ConversationListItemAvatarProps
>(function ChatConversationListItemAvatarStyled(props, ref) {
  return (
    <ConversationListItemAvatar
      ref={ref}
      {...props}
      slots={{ root: ChatConversationListItemAvatarRoot, ...props.slots }}
    />
  );
});

const ChatConversationListItemContentStyled = React.forwardRef<
  HTMLDivElement,
  ConversationListItemContentProps
>(function ChatConversationListItemContentStyled(props, ref) {
  return (
    <ConversationListItemContent
      ref={ref}
      {...props}
      slots={{ root: ChatConversationListItemContentRoot, ...props.slots }}
    />
  );
});

const ChatConversationListTitleStyled = React.forwardRef<
  HTMLDivElement,
  ConversationListTitleProps
>(function ChatConversationListTitleStyled(props, ref) {
  return (
    <ConversationListTitle
      ref={ref}
      {...props}
      slots={{ root: ChatConversationListTitleRoot, ...props.slots }}
    />
  );
});

const ChatConversationListPreviewStyled = React.forwardRef<
  HTMLDivElement,
  ConversationListPreviewProps
>(function ChatConversationListPreviewStyled(props, ref) {
  return (
    <ConversationListPreview
      ref={ref}
      {...props}
      slots={{ root: ChatConversationListPreviewRoot, ...props.slots }}
    />
  );
});

const ChatConversationListTimestampStyled = React.forwardRef<
  HTMLDivElement,
  ConversationListTimestampProps
>(function ChatConversationListTimestampStyled(props, ref) {
  return (
    <ConversationListTimestamp
      ref={ref}
      {...props}
      slots={{ root: ChatConversationListTimestampRoot, ...props.slots }}
    />
  );
});

const ChatConversationListUnreadBadgeStyled = React.forwardRef<
  HTMLDivElement,
  ConversationListUnreadBadgeProps
>(function ChatConversationListUnreadBadgeStyled(props, ref) {
  return (
    <ConversationListUnreadBadge
      ref={ref}
      {...props}
      slots={{ root: ChatConversationListUnreadBadgeRoot, ...props.slots }}
    />
  );
});

// Default inline SVG for the 3-dot "more" icon (MoreHoriz style).

function DefaultMoreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="6" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  );
}

const ChatConversationListItemActionsStyled = React.forwardRef<
  HTMLDivElement,
  ConversationListItemActionsProps
>(function ChatConversationListItemActionsStyled(props, ref) {
  return (
    <ConversationListItemActions
      ref={ref}
      {...props}
      slots={{ root: ChatConversationListItemActionsRoot, ...props.slots }}
    >
      {props.children ?? <DefaultMoreIcon />}
    </ConversationListItemActions>
  );
});

const ChatConversationList = React.forwardRef<HTMLDivElement, ChatConversationListProps>(
  function ChatConversationList(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConversationList' });
    const {
      variant = 'default',
      slots,
      slotProps,
      className,
      classes: classesProp,
      sx,
      ...other
    } = props;
    const classes = useChatConversationListUtilityClasses(classesProp);
    const isCompact = variant === 'compact';

    const resolvedSlots: Partial<ConversationListRootSlots> = {
      root: slots?.root ?? ChatConversationListStyled,
      scroller: slots?.scroller ?? ChatConversationListScrollerStyled,
      viewport: slots?.viewport ?? ChatConversationListViewportStyled,
      scrollbar: slots?.scrollbar ?? NoopScrollbar,
      scrollbarThumb: slots?.scrollbarThumb ?? NoopScrollbar,
      item: slots?.item ?? ChatConversationListItemSlot,
      itemAvatar: slots?.itemAvatar ?? ChatConversationListItemAvatarStyled,
      itemContent: slots?.itemContent ?? ChatConversationListItemContentStyled,
      title: slots?.title ?? ChatConversationListTitleStyled,
      preview: slots?.preview ?? ChatConversationListPreviewStyled,
      timestamp: slots?.timestamp ?? ChatConversationListTimestampStyled,
      unreadBadge: slots?.unreadBadge ?? ChatConversationListUnreadBadgeStyled,
      itemActions: slots?.itemActions ?? ChatConversationListItemActionsStyled,
      ...slots,
    };

    // The headless `root` slot is typed as `SlotComponentProps<'div', ...>`,
    // which intentionally does NOT include `sx`. We funnel `sx` to the styled
    // root via a localized assertion — strictly typing the rest of the slot
    // wiring still catches signature drift.
    const rootSlotProps = {
      className: clsx(classes.root, isCompact && classes.compact, className),
      sx,
      ...slotProps?.root,
    } as unknown as ConversationListRootSlotProps['root'];

    const resolvedSlotProps: ConversationListRootSlotProps = {
      ...slotProps,
      root: rootSlotProps,
      scroller: {
        className: classes.scroller,
        ...slotProps?.scroller,
      },
      item: (ownerState: ConversationListItemOwnerState) => {
        const externalItemProps =
          typeof slotProps?.item === 'function'
            ? slotProps.item(ownerState)
            : slotProps?.item;

        return {
          className: clsx(
            classes.item,
            ownerState.selected && classes.itemSelected,
            ownerState.unread && classes.itemUnread,
            ownerState.focused && classes.itemFocused,
          ),
          ...externalItemProps,
        };
      },
      itemAvatar: {
        className: classes.itemAvatar,
        ...slotProps?.itemAvatar,
      },
      itemContent: {
        className: classes.itemContent,
        ...slotProps?.itemContent,
      },
      title: {
        className: classes.itemTitle,
        ...slotProps?.title,
      },
      preview: {
        className: classes.itemPreview,
        ...slotProps?.preview,
      },
      timestamp: {
        className: classes.itemTimestamp,
        ...slotProps?.timestamp,
      },
      unreadBadge: {
        className: classes.itemUnreadBadge,
        ...slotProps?.unreadBadge,
      },
      itemActions: {
        className: classes.itemActions,
        ...slotProps?.itemActions,
      },
    };

    return (
      <ConversationListRoot
        ref={ref}
        variant={variant}
        {...other}
        slots={resolvedSlots}
        slotProps={resolvedSlotProps}
      />
    );
  },
);

ChatConversationList.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The visual variant of the conversation list.
   * - `'default'` – shows avatar, title, preview, timestamp, and unread badge.
   * - `'compact'` – shows only a small unread indicator, the title, and an actions button.
   * @default 'default'
   */
  variant: PropTypes.oneOf(['compact', 'default']),
} as any;

export { ChatConversationList };
