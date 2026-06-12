'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  MessageRoot,
  type MessageRootProps,
  useChatVariant,
  useMessage,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';
import { ChatMessageError, type ChatMessageErrorProps } from '../ChatMessageError/ChatMessageError';
import { ChatMessageAvatar, type ChatMessageAvatarProps } from './ChatMessageAvatar';
import { ChatMessageContent, type ChatMessageContentProps } from './ChatMessageContent';
import { ChatMessageMeta, type ChatMessageMetaProps } from './ChatMessageMeta';
import { ChatMessageInlineMeta } from './ChatMessageInlineMeta';
import { ChatMessageActions, type ChatMessageActionsProps } from './ChatMessageActions';

const useThemeProps = createUseThemeProps('MuiChatMessage');

export interface ChatMessageSlots {
  /** The styled root element. */
  root: React.ElementType;
  /**
   * The avatar component. Pass `null` to hide it and collapse the avatar grid track.
   * Function form receives the message context and may return `null` for per-message hiding,
   * but the grid track is only dropped when the slot itself is `null`.
   */
  avatar: React.ElementType | null;
  /** The bubble component that renders message content. */
  content: React.ElementType;
  /**
   * The external meta component (compact variant). Pass `null` to hide it.
   */
  meta: React.ElementType | null;
  /**
   * The inline meta component (default variant; rendered inside the bubble). Pass `null` to hide it.
   */
  inlineMeta: React.ElementType | null;
  /** The error component rendered under the bubble when status === 'error'. */
  error: React.ElementType;
  /**
   * The actions component, rendered under the bubble.
   * Receives `{ messageId }` as props.
   * Pass `null` (or omit) to hide actions entirely.
   */
  actions: React.ElementType | null;
  /**
   * The author-name label. Rendered by the surrounding `ChatMessageGroup`
   * (default variant: above the bubble; compact variant: inside the message
   * grid). Forwarded through `slots.message.authorName` from `ChatBox`. Pass
   * `null` to hide.
   */
  authorName: React.ElementType | null;
}

export interface ChatMessageSlotProps {
  root?: any;
  avatar?: Partial<ChatMessageAvatarProps>;
  content?: Partial<ChatMessageContentProps>;
  meta?: Partial<ChatMessageMetaProps>;
  inlineMeta?: Record<string, unknown>;
  error?: Partial<ChatMessageErrorProps>;
  actions?: Partial<ChatMessageActionsProps>;
  authorName?: Record<string, unknown>;
}

export interface ChatMessageProps extends Omit<MessageRootProps, 'slots' | 'slotProps'> {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
  slots?: Partial<ChatMessageSlots>;
  slotProps?: ChatMessageSlotProps;
  /**
   * @ignore
   * Internal: the group's author label, injected by the headless `MessageGroup`
   * in compact mode so it can share the message's CSS grid. Not part of a
   * consumer's custom composition (which uses `children`).
   */
  groupAuthorName?: React.ReactNode;
}

const ChatMessageStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    styles.root,
    props.ownerState?.role === 'user' && styles.roleUser,
    props.ownerState?.role === 'assistant' && styles.roleAssistant,
  ],
})<{
  ownerState?: {
    role?: string;
    isGrouped?: boolean;
    variant?: string;
    density?: string;
    isOwnMessage?: boolean;
  };
}>(({ theme, ownerState }) => {
  const isCompact = ownerState?.variant === 'compact';
  const isOwnMessage = ownerState?.isOwnMessage ?? false;
  const densityPaddingBlock: Record<string, string> = {
    compact: theme.spacing(0.25),
    standard: theme.spacing(1),
    comfortable: theme.spacing(2),
  };
  const paddingBottom = densityPaddingBlock[ownerState?.density ?? 'standard'];

  if (isCompact) {
    // Compact: avatar and author name share the first row, content below.
    // For grouped messages (not first in group) the avatar column stays for alignment
    // but no avatar/author name is rendered.
    const isGrouped = ownerState?.isGrouped;
    return {
      display: 'grid',
      columnGap: theme.spacing(1),
      width: '100%',
      boxSizing: 'border-box',
      paddingInline: theme.spacing(2),
      paddingBlock: `0 ${paddingBottom}`,
      fontFamily: theme.typography.fontFamily,
      ...(isGrouped
        ? {
            gridTemplateColumns: 'var(--MuiChatMessage-avatarSize) 1fr auto',
            gridTemplateRows: 'auto auto',
            gridTemplateAreas: '". content meta" ". error ."',
          }
        : {
            gridTemplateColumns: 'var(--MuiChatMessage-avatarSize) 1fr auto',
            gridTemplateRows: 'auto auto auto',
            gridTemplateAreas: '"avatar authorName meta" "avatar content ." ". error ."',
          }),
      // Avatar-less layout: collapse the reserved avatar grid track so the bubble
      // and meta lane reclaim the row. Applies to both grouped and first-in-group.
      '&.MuiChatMessage-noAvatar': {
        gridTemplateColumns: '1fr auto',
        gridTemplateAreas: isGrouped
          ? '"content meta" "error ."'
          : '"authorName meta" "content ." "error ."',
      },
    };
  }

  const isGrouped = ownerState?.isGrouped;

  // Default variant: two-row grid. First row holds avatar + content bubble,
  // second row holds message actions below the bubble, aligned to the avatar side.
  // Meta is rendered inline inside the bubble via ChatMessageInlineMeta.
  return {
    display: 'grid',
    gridTemplateColumns: isGrouped ? 'var(--MuiChatMessage-avatarSize) 1fr' : 'auto 1fr',
    gridTemplateRows: 'auto auto auto',
    gridTemplateAreas: isGrouped
      ? '". content" ". error" ". actions"'
      : '"avatar content" ". error" ". actions"',
    columnGap: theme.spacing(0.5),
    width: '100%',
    boxSizing: 'border-box',
    paddingInline: theme.spacing(2),
    // Phantom column: reserve the same width as the avatar on the opposite side so
    // assistant and user bubbles always share the same horizontal content lane.
    paddingInlineEnd: `calc(${theme.spacing(2)} + var(--MuiChatMessage-avatarSize))`,
    paddingBlock: `0 ${paddingBottom}`,
    // When actions are present, their row already provides visual spacing,
    // so reduce the bottom padding to avoid double spacing between messages.
    '&:has(.MuiChatMessage-actions)': {
      paddingBlockEnd: theme.spacing(0.25),
    },
    fontFamily: theme.typography.fontFamily,
    ...(isOwnMessage && {
      gridTemplateColumns: isGrouped ? '1fr var(--MuiChatMessage-avatarSize)' : '1fr auto',
      gridTemplateAreas: isGrouped
        ? '"content ." "error ." "actions ."'
        : '"content avatar" "error ." "actions ."',
      paddingInlineStart: `calc(${theme.spacing(2)} + var(--MuiChatMessage-avatarSize))`,
      paddingInlineEnd: theme.spacing(2),
    }),
    // Avatar-less layout: collapse the reserved avatar column and drop the phantom
    // padding so the bubble fills the full content lane on both sides.
    '&.MuiChatMessage-noAvatar': {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: '"content" "error" "actions"',
      paddingInlineStart: theme.spacing(2),
      paddingInlineEnd: theme.spacing(2),
    },
  };
});

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const {
      slots,
      slotProps,
      className,
      classes: classesProp,
      sx,
      messageId,
      children,
      groupAuthorName,
      ...other
    } = props;
    const classes = useChatMessageUtilityClasses(classesProp);
    const message = useMessage(messageId);
    const variant = useChatVariant();
    const isCompact = variant === 'compact';

    const stateClasses = clsx(
      message?.role === 'user' && classes.roleUser,
      message?.role === 'assistant' && classes.roleAssistant,
      message?.status === 'streaming' && classes.streaming,
      message?.status === 'error' && classes.error,
    );

    // Slot resolution: `null` means "hide and adjust layout"; `undefined` means "use default".
    const AvatarSlot = slots?.avatar;
    const hasAvatar = AvatarSlot !== null;

    // The error surface is resolved through the `error` slot in both branches so custom
    // message composition via `children` can still customize (or keep consistent) the
    // error rendering, matching the slot-driven path below.
    const ErrorComp = (slots?.error ?? ChatMessageError) as typeof ChatMessageError;

    // Build the inner tree from slots when no `children` were passed (slot-driven).
    // When a consumer provides `children`, render them as-is for backward-compatible
    // custom composition — in every variant, including compact. The compact author
    // label is delivered separately via `groupAuthorName` (see headless MessageGroup),
    // so it never conflates with a consumer's children.
    let innerTree: React.ReactNode;
    if (children !== undefined) {
      innerTree = (
        <React.Fragment>
          {children}
          <ErrorComp {...(slotProps?.error ?? {})} />
        </React.Fragment>
      );
    } else {
      const ContentComp = (slots?.content ?? ChatMessageContent) as typeof ChatMessageContent;
      const MetaSlot = slots?.meta;
      const InlineMetaSlot = slots?.inlineMeta;
      const ActionsSlot = slots?.actions;
      const AvatarComp = (AvatarSlot ?? ChatMessageAvatar) as typeof ChatMessageAvatar;

      const isStreaming = message?.status === 'streaming';
      const hasMeta =
        Boolean(message?.createdAt) || Boolean(message?.editedAt) || Boolean(message?.status);
      const InlineMetaComp = (InlineMetaSlot ??
        ChatMessageInlineMeta) as typeof ChatMessageInlineMeta;
      const inlineMeta =
        !isCompact && !isStreaming && hasMeta && InlineMetaSlot !== null
          ? React.createElement(InlineMetaComp, slotProps?.inlineMeta ?? {})
          : undefined;

      const MetaComp = (MetaSlot ?? ChatMessageMeta) as typeof ChatMessageMeta;
      const externalMeta =
        isCompact && MetaSlot !== null ? <MetaComp {...(slotProps?.meta ?? {})} /> : null;

      innerTree = (
        <React.Fragment>
          {groupAuthorName}
          {hasAvatar && <AvatarComp {...(slotProps?.avatar ?? {})} />}
          <ContentComp afterContent={inlineMeta} {...(slotProps?.content ?? {})} />
          {externalMeta}
          <ErrorComp {...(slotProps?.error ?? {})} />
          {ActionsSlot && (
            <ChatMessageActions {...(slotProps?.actions ?? {})}>
              <ActionsSlot messageId={messageId} />
            </ChatMessageActions>
          )}
        </React.Fragment>
      );
    }

    return (
      <MessageRoot
        ref={ref}
        messageId={messageId}
        {...other}
        slots={{
          root: slots?.root ?? ChatMessageStyled,
        }}
        slotProps={{
          root: {
            className: clsx(classes.root, stateClasses, !hasAvatar && classes.noAvatar, className),
            sx,
            ...slotProps?.root,
          } as any,
        }}
      >
        {innerTree}
      </MessageRoot>
    );
  },
);

ChatMessage.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * @ignore
   * Internal: the group's author label, injected by the headless `MessageGroup`
   * in compact mode so it can share the message's CSS grid. Not part of a
   * consumer's custom composition (which uses `children`).
   */
  groupAuthorName: PropTypes.node,
  isGrouped: PropTypes.bool,
  messageId: PropTypes.string.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessage };
