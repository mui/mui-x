'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { MessageListRoot, useChatDensity } from '@mui/x-chat-headless';
import type {
  MessageListRootProps,
  MessageListRootSlots,
  MessageListRootSlotProps,
  MessageListRootHandle,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { useChatMessageListUtilityClasses } from './chatMessageListClasses';
import type { ChatMessageListClasses } from './chatMessageListClasses';
import { DefaultMessageItem } from './DefaultMessageItem';
import type {
  ChatMessageRowSlots,
  ChatMessageRowSlotProps,
  ChatMessageListFeatures,
} from './DefaultMessageItem';

const useThemeProps = createUseThemeProps('MuiChatMessageList');

export interface ChatMessageListSlots extends MessageListRootSlots, Partial<ChatMessageRowSlots> {}

export interface ChatMessageListSlotProps
  extends MessageListRootSlotProps, ChatMessageRowSlotProps {}

export interface ChatMessageListProps extends Omit<
  MessageListRootProps,
  'renderItem' | 'slots' | 'slotProps'
> {
  /**
   * Render a custom row for each message. When omitted, the default row used by
   * `ChatBox` is rendered (group → message → avatar → content, with conditional
   * inline meta, external meta in compact variant, and message actions slot).
   * Provide a function to fully replace the row; use slot overrides to tweak
   * individual sub-components without losing the default chrome.
   */
  renderItem?: MessageListRootProps['renderItem'];
  slots?: Partial<ChatMessageListSlots>;
  slotProps?: ChatMessageListSlotProps;
  /**
   * Feature flags for the row extras rendered by the default row: the opt-in
   * dividers (`dateDivider` / `unreadMarker`, disabled by default) and the
   * streaming indicator (`streamingIndicator`, `'auto'` by default). Ignored
   * when a custom `renderItem` replaces the default row.
   */
  features?: ChatMessageListFeatures;
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageListClasses>;
}

const ChatMessageListStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  backgroundColor: (theme.vars || theme).palette.background.default,
}));

const ChatMessageListScrollerStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Scroller',
  overridesResolver: (_, styles) => styles.scroller,
})(() => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  minHeight: 0,
}));

const ChatMessageListContentStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Content',
  overridesResolver: (_, styles) => styles.content,
})<{ ownerState?: { density?: string } }>(({ theme, ownerState }) => {
  const densityPaddingBlock: Record<string, string> = {
    compact: theme.spacing(0.5),
    standard: theme.spacing(1),
    comfortable: theme.spacing(1.5),
  };
  return {
    display: 'flex',
    flexDirection: 'column',
    paddingBlock: densityPaddingBlock[ownerState?.density ?? 'standard'],
    boxSizing: 'border-box',
  };
});

// The row renderer wants the flat message-pipeline keys (group wrapper, dividers,
// and per-row `message*` parts). Everything else on `slots` (e.g. `messageList`,
// `messageListScroller`, `messageListContent`) belongs to `MessageListRoot`.
const ROW_SLOT_KEYS: ReadonlyArray<keyof ChatMessageRowSlots> = [
  'messageGroup',
  'dateDivider',
  'unreadMarker',
  'streamingIndicator',
  'messageRoot',
  'messageAvatar',
  'messageContent',
  'messageMeta',
  'messageInlineMeta',
  'messageError',
  'messageActions',
  'messageAuthorName',
];

const ChatMessageList = React.forwardRef<MessageListRootHandle, ChatMessageListProps>(
  function ChatMessageList(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageList' });
    const {
      renderItem: renderItemProp,
      slots,
      slotProps,
      features,
      className,
      classes: classesProp,
      sx,
      ...other
    } = props;
    const classes = useChatMessageListUtilityClasses(classesProp);
    const density = useChatDensity();

    // Partition slots/slotProps: row-level keys go to the default renderer,
    // list-level keys go to MessageListRoot. Row-level entries are extracted
    // even when a custom renderItem is provided so they don't get forwarded to
    // MessageListRoot — which would reject unknown slot keys at runtime.
    const { rowSlots, listSlots } = React.useMemo(() => {
      const row: Partial<ChatMessageRowSlots> = {};
      const list: Partial<MessageListRootSlots> = {};
      if (slots) {
        for (const key of Object.keys(slots) as Array<keyof ChatMessageListSlots>) {
          if ((ROW_SLOT_KEYS as ReadonlyArray<string>).includes(key)) {
            (row as any)[key] = slots[key];
          } else {
            (list as any)[key] = slots[key];
          }
        }
      }
      return { rowSlots: row, listSlots: list };
    }, [slots]);

    const { rowSlotProps, listSlotProps } = React.useMemo(() => {
      const row: ChatMessageRowSlotProps = {};
      const list: MessageListRootSlotProps = {};
      if (slotProps) {
        for (const key of Object.keys(slotProps) as Array<keyof ChatMessageListSlotProps>) {
          if ((ROW_SLOT_KEYS as ReadonlyArray<string>).includes(key)) {
            (row as any)[key] = slotProps[key];
          } else {
            (list as any)[key] = slotProps[key];
          }
        }
      }
      return { rowSlotProps: row, listSlotProps: list };
    }, [slotProps]);

    // Normalize the row feature flags into an identity-stable object so an
    // inline `features={{ ... }}` doesn't churn the memoized rows on every render.
    const showDateDivider = features?.dateDivider === true;
    const showUnreadMarker = features?.unreadMarker === true;
    const streamingIndicator = features?.streamingIndicator ?? 'auto';
    const rowFeatures = React.useMemo<ChatMessageListFeatures>(
      () => ({
        dateDivider: showDateDivider,
        unreadMarker: showUnreadMarker,
        streamingIndicator,
      }),
      [showDateDivider, showUnreadMarker, streamingIndicator],
    );

    // Keep the default renderer stable; read latest slot overrides and the resolved
    // `items` from refs so updates don't churn the virtualized list. `items` is read
    // without destructuring so it still flows to MessageListRoot via `...other`.
    const rowSlotsRef = React.useRef(rowSlots);
    const rowSlotPropsRef = React.useRef(rowSlotProps);
    const rowFeaturesRef = React.useRef(rowFeatures);
    const itemsRef = React.useRef<string[] | undefined>(undefined);
    rowSlotsRef.current = rowSlots;
    rowSlotPropsRef.current = rowSlotProps;
    rowFeaturesRef.current = rowFeatures;
    itemsRef.current = (other as { items?: string[] }).items;

    // Forward `index` (rendered-list relative) and the rendered `items` so the group
    // computes grouping against the rendered list — otherwise a custom `items` subset
    // would regroup against the full conversation and drop avatars/author labels.
    const defaultRenderItem = React.useCallback(
      ({ id, index }: { id: string; index: number }) => (
        <DefaultMessageItem
          key={id}
          id={id}
          index={index}
          items={itemsRef.current}
          slots={rowSlotsRef.current}
          slotProps={rowSlotPropsRef.current}
          features={rowFeaturesRef.current}
        />
      ),
      [],
    );

    const renderItem = renderItemProp ?? defaultRenderItem;

    return (
      <MessageListRoot
        ref={ref}
        {...other}
        renderItem={renderItem}
        slots={{
          ...listSlots,
          messageList: listSlots.messageList ?? ChatMessageListStyled,
          messageListScroller: listSlots.messageListScroller ?? ChatMessageListScrollerStyled,
          messageListContent: listSlots.messageListContent ?? ChatMessageListContentStyled,
        }}
        slotProps={{
          ...listSlotProps,
          messageList: mergeSlotProps(
            {
              className: clsx(classes.root, className),
              sx,
            },
            listSlotProps?.messageList,
          ) as any,
          messageListScroller: mergeSlotProps(
            {
              className: classes.scroller,
            },
            listSlotProps?.messageListScroller,
          ) as any,
          messageListContent: mergeSlotProps(
            {
              className: classes.content,
              ownerState: { density },
            },
            listSlotProps?.messageListContent,
          ) as any,
        }}
      />
    );
  },
);

ChatMessageList.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Controls automatic scrolling to the bottom when new messages arrive or
   * streaming content grows, as long as the user is within `buffer` pixels of
   * the bottom.
   *
   * - `true` – enable with the default buffer (150 px).
   * - `{ buffer: number }` – enable with a custom threshold.
   * - `false` – disable (the scroll-to-bottom affordance is still available).
   *
   * Scrolling when the *user* sends a message is always active.
   * @default true
   */
  autoScroll: PropTypes.oneOfType([
    PropTypes.shape({
      buffer: PropTypes.number,
    }),
    PropTypes.bool,
  ]),
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Whether the message list manages a roving tabindex over its messages:
   * the list is a single Tab stop, ArrowUp/ArrowDown (plus Home/End) move
   * focus between messages, Enter drills into a message's interior controls
   * and Escape returns to the message.
   *
   * Disable when rendering fully custom rows that manage focus themselves.
   * @default true
   */
  enableRovingFocus: PropTypes.bool,
  estimatedItemSize: PropTypes.number,
  /**
   * Feature flags for the row extras rendered by the default row: the opt-in
   * dividers (`dateDivider` / `unreadMarker`, disabled by default) and the
   * streaming indicator (`streamingIndicator`, `'auto'` by default). Ignored
   * when a custom `renderItem` replaces the default row.
   */
  features: PropTypes.shape({
    dateDivider: PropTypes.bool,
    streamingIndicator: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.bool]),
    unreadMarker: PropTypes.bool,
  }),
  getItemKey: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.string),
  /**
   * Callback fired when the viewport enters the bottom zone of the list — within
   * `autoScroll.buffer` pixels (150 by default; `estimatedItemSize` when `autoScroll`
   * is disabled) of the bottom edge. Fires once per entry: it does not fire again until
   * the user scrolls away from the bottom and back. Entries caused by programmatic
   * scrolls (`scrollToBottom()`, the scroll-to-bottom affordance, the forced scroll
   * after the user sends a message) count. It does not fire on mount, while the list
   * stays pinned to the bottom during streaming, when new messages arrive while already
   * at the bottom, or when the conversation (item set) is switched. Growing the buffer
   * so that it newly encloses the current position counts as entering the zone.
   */
  onReachBottom: PropTypes.func,
  /**
   * Callback fired when the viewport enters the top zone of the list — within
   * `estimatedItemSize` pixels (84 by default) of the top edge. Fires once per
   * entry: it does not fire again until the user scrolls away from the top,
   * past the threshold, and back. It is coupled to history loading: it only
   * fires when more history is available and no history page load is in
   * flight, right before the next page is requested.
   */
  onReachTop: PropTypes.func,
  /**
   * Floating layer rendered above the message list, anchored to its bottom edge; pointer-transparent.
   * @default null
   */
  overlay: PropTypes.node,
  /**
   * Render a custom row for each message. When omitted, the default row used by
   * `ChatBox` is rendered (group → message → avatar → content, with conditional
   * inline meta, external meta in compact variant, and message actions slot).
   * Provide a function to fully replace the row; use slot overrides to tweak
   * individual sub-components without losing the default chrome.
   */
  renderItem: PropTypes.func,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageList };
