'use client';
import * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import { ChatMessageGroup } from '../ChatMessage/ChatMessageGroup';
import { ChatDateDivider } from '../ChatMessage/ChatDateDivider';
import { ChatUnreadMarker } from '../ChatIndicators/ChatUnreadMarker';
import { ChatStreamingIndicatorRow } from '../ChatIndicators/ChatStreamingIndicatorRow';
import { useChatSlots } from '../internals/ChatSlotsContext';
import type { ChatBoxSlots, ChatBoxSlotProps } from '../ChatBox/ChatBox.types';

function warnIfHostElementRowSlot(
  slotName: 'dateDivider' | 'unreadMarker' | 'streamingIndicator',
  value: unknown,
) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  if (typeof value === 'string') {
    warnOnce([
      `MUI X: The \`${slotName}\` slot was given a host element (e.g. \`'div'\`).`,
      `The ${slotName} is a self-suppressing row component: it reads \`messageId\`/\`index\`/\`items\` and renders only at its boundary, returning \`null\` otherwise.`,
      `A host element ignores those props (leaking them onto the DOM node) and renders on every message row.`,
      `Pass a component, or \`null\` to hide the slot entirely.`,
    ]);
  }
}

function warnIfDividerSlotWithoutFeature(
  slotName: 'dateDivider' | 'unreadMarker',
  hasCustomization: boolean,
) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  if (hasCustomization) {
    warnOnce([
      `MUI X: A \`${slotName}\` slot or slotProps entry was provided, but the \`${slotName}\` feature is disabled.`,
      `Dividers are opt-in and render nothing unless enabled, so the customization has no effect.`,
      `Pass \`features={{ ${slotName}: true }}\` to render it.`,
    ]);
  }
}

/**
 * Opt-in row dividers rendered by the default message row. Shared by `ChatBox`
 * (`features` prop) and the standalone `ChatMessageList` (`features` prop).
 */
export interface ChatMessageListFeatures {
  /**
   * Whether to render a date divider between messages whose `createdAt` values
   * fall on different calendar days. Use the `dateDivider` slot to customize the
   * rendered component once enabled.
   * @default false
   */
  dateDivider?: boolean;
  /**
   * Whether to render the unread "new messages" marker above the first unread
   * message (derived from the active conversation's `unreadCount` / `readState`).
   * Use the `unreadMarker` slot to customize the rendered component once enabled.
   * @default false
   */
  unreadMarker?: boolean;
  /**
   * Whether to show the animated streaming indicator while waiting for /
   * receiving an assistant response.
   * - `'auto'` – shown only in assistant-backed conversations (auto-detected).
   * - `true` – always shown while a response is in flight.
   * - `false` – never shown.
   * Use the `streamingIndicator` slot to customize the rendered component.
   * @default 'auto'
   */
  streamingIndicator?: boolean | 'auto';
}

/**
 * Flat per-row slot keys shared by `ChatBox` and `ChatMessageList` — the
 * message-rendering pipeline vocabulary (group wrapper, dividers, and the
 * per-row `message*` parts). A subset of the public `ChatBoxSlots`.
 */
type ChatMessageRowSlotKeys =
  | 'messageGroup'
  | 'dateDivider'
  | 'unreadMarker'
  | 'streamingIndicator'
  | 'messageRoot'
  | 'messageAvatar'
  | 'messageContent'
  | 'messageMeta'
  | 'messageInlineMeta'
  | 'messageError'
  | 'messageActions'
  | 'messageAuthorName';

export interface ChatMessageRowSlots extends Pick<ChatBoxSlots, ChatMessageRowSlotKeys> {}

export interface ChatMessageRowSlotProps extends Pick<ChatBoxSlotProps, ChatMessageRowSlotKeys> {}

export interface DefaultMessageItemProps {
  id: string;
  /**
   * Index of this row within the rendered list. Forwarded to the group so grouping
   * (previous/next neighbor lookup) is computed against the rendered list rather than
   * the full conversation when a custom `items` subset is used.
   */
  index?: number;
  /** The rendered list's message ids. Forwarded to the group alongside `index`. */
  items?: string[];
  slots?: ChatMessageRowSlots;
  slotProps?: ChatMessageRowSlotProps;
  /**
   * Opt-in row dividers. Both are disabled by default; pass `{ dateDivider: true }`
   * and/or `{ unreadMarker: true }` to render them.
   */
  features?: ChatMessageListFeatures;
}

/**
 * Default message-row composition used by `ChatBox` and `ChatMessageList`
 * when no custom `renderItem` is provided.
 *
 * Slots are read from the `ChatSlots` context (the `ChatBox` path) unless passed
 * explicitly via props (the standalone `ChatMessageList` path, which partitions
 * its own flat slots and forwards the row keys here). `messageGroup` swaps the
 * group component; the flat `message*` keys flow into the group, which maps them
 * onto the inner `ChatMessage`'s short local slots.
 *
 * Memoized because this is the per-row component inside the virtualized list:
 * `ChatBox`'s `renderItem` carries no slot payload (it reads context), so
 * scroll-driven re-renders short-circuit on the shallow id/index/items compare.
 */
export const DefaultMessageItem = React.memo(function DefaultMessageItem({
  id,
  index,
  items,
  slots: slotsProp,
  slotProps: slotPropsProp,
  features,
}: DefaultMessageItemProps) {
  const context = useChatSlots();
  const slots = slotsProp ?? context.slots;
  const slotProps = slotPropsProp ?? context.slotProps;

  // Row-level dividers are opt-in capabilities: absent unless the corresponding
  // feature flag is enabled. Once enabled, both the date divider and the unread
  // marker are self-suppressing: they read `messageId`/`index`/`items` and render
  // only at their boundary (a new calendar day, or the first unread message derived
  // from the active conversation's `unreadCount`/`readState`), returning null
  // otherwise. The slot then customizes the rendered component (`undefined` falls
  // back to the default; `null` still hides it). A custom slot must be a component
  // (it receives `messageId`/`index`/`items`); a raw host element would both fail
  // to self-suppress and leak those as DOM attributes.
  const showDateDivider = features?.dateDivider === true && slots.dateDivider !== null;
  const showUnreadMarker = features?.unreadMarker === true && slots.unreadMarker !== null;
  const DateDividerComponent = (slots.dateDivider ?? ChatDateDivider) as React.ElementType;
  const UnreadMarkerComponent = (slots.unreadMarker ?? ChatUnreadMarker) as React.ElementType;

  // Streaming indicator: enabled by default ('auto'), unlike the opt-in dividers.
  // The trailing row below covers the waiting phase (response in flight, no
  // assistant message yet); the in-bubble phase is rendered by `ChatMessage`.
  // Disabling the feature nulls the slot for the whole row pipeline, so the
  // in-bubble instance is gated without threading the mode through slotProps.
  const streamingIndicatorMode = features?.streamingIndicator ?? 'auto';
  const showStreamingIndicator =
    streamingIndicatorMode !== false && slots.streamingIndicator !== null;
  const isLastRow = items != null && index != null && index === items.length - 1;
  const rowSlots = React.useMemo(
    () => (streamingIndicatorMode === false ? { ...slots, streamingIndicator: null } : slots),
    [slots, streamingIndicatorMode],
  );

  warnIfHostElementRowSlot('dateDivider', slots.dateDivider);
  warnIfHostElementRowSlot('unreadMarker', slots.unreadMarker);
  warnIfHostElementRowSlot('streamingIndicator', slots.streamingIndicator);
  warnIfDividerSlotWithoutFeature(
    'dateDivider',
    features?.dateDivider !== true && (slots.dateDivider != null || slotProps.dateDivider != null),
  );
  warnIfDividerSlotWithoutFeature(
    'unreadMarker',
    features?.unreadMarker !== true &&
      (slots.unreadMarker != null || slotProps.unreadMarker != null),
  );

  return (
    <React.Fragment>
      {showDateDivider && (
        <DateDividerComponent
          {...resolveComponentProps(slotProps.dateDivider ?? {}, { messageId: id, index, items })}
          messageId={id}
          index={index}
          items={items}
        />
      )}
      {showUnreadMarker && (
        <UnreadMarkerComponent
          {...resolveComponentProps(slotProps.unreadMarker ?? {}, { messageId: id, index, items })}
          messageId={id}
          index={index}
          items={items}
        />
      )}
      {/*
        Always render `ChatMessageGroup`. It consumes `slots.messageGroup` as the
        group's wrapper element (and `slotProps.messageGroup` as that wrapper's
        props), so the default avatar/content/meta tree still renders inside it.
        Hoisting `messageGroup` to the row component here would let a plain wrapper
        element (e.g. `'section'`) replace the entire row and render empty, with the
        internal `messageId`/`index`/`items` props leaking onto the DOM node.
      */}
      <ChatMessageGroup
        messageId={id}
        index={index}
        items={items}
        slots={rowSlots}
        slotProps={slotProps}
      />
      {/*
        Mounted only on the last row so a single store subscriber exists per
        list (and the avatar/bubble chrome work is paid once, not per row).
        The row self-suppresses outside the waiting phase (e.g. while the
        in-bubble indicator takes over, or in non-assistant chats under 'auto').
        A custom slot replaces the whole presentation (no built-in chrome);
        the default renders an incoming assistant row — avatar + typing bubble.
      */}
      {showStreamingIndicator &&
        isLastRow &&
        (slots.streamingIndicator ? (
          React.createElement(slots.streamingIndicator as React.ElementType, {
            mode: streamingIndicatorMode,
            message: null,
            messageId: id,
            index,
            items,
            ...resolveComponentProps(slotProps.streamingIndicator ?? {}, {
              messageId: id,
              index,
              items,
            }),
          })
        ) : (
          <ChatStreamingIndicatorRow
            mode={streamingIndicatorMode}
            messageId={id}
            index={index}
            items={items}
            hasAvatar={slots.messageAvatar !== null}
            slotProps={slotProps.streamingIndicator}
          />
        ))}
    </React.Fragment>
  );
});
