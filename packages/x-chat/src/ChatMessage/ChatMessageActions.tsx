'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { warnOnce } from '@mui/x-internals/warning';
import { SxProps, Theme } from '@mui/system';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {
  MessageActions,
  useChatActions,
  type ChatMessage,
  type ChatRuntimeActions,
  type MessageActionsProps,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses } from './chatMessageClasses';
import { mergeSlotProps } from '../internals/mergeSlotProps';

const useThemeProps = createUseThemeProps('MuiChatMessageActions');

export interface ChatMessageExtraActionContext {
  /** The message this action bar belongs to (null while loading). */
  message: ChatMessage | null;
  /** Runtime actions (sendMessage, retry, regenerate, …). */
  chat: ChatRuntimeActions;
}

export interface ChatMessageExtraAction {
  /** Stable id; used as the React key and in the rendered button's data-action attribute. */
  id: string;
  /** Accessible label. Rendered as the button text when no icon is given, and as `aria-label` + tooltip when an icon is given. */
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    context: ChatMessageExtraActionContext,
  ) => void;
}

export interface ChatMessageActionsProps extends MessageActionsProps {
  className?: string;
  sx?: SxProps<Theme>;
  /**
   * Declarative action buttons appended after `children`. Lets consumers add
   * actions without replacing the `messageActions` slot component.
   */
  extraActions?: ChatMessageExtraAction[];
  /**
   * The message this bar belongs to. Injected by `ChatMessage` (from its
   * existing `useMessage` subscription); pass explicitly in standalone usage.
   */
  message?: ChatMessage | null;
}

const ChatMessageActionsStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Actions',
  overridesResolver: (_, styles) => styles.actions,
})<{ ownerState?: { role?: string; isOwnMessage?: boolean } }>(({ theme, ownerState }) => ({
  gridArea: 'actions',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  // `visibility: hidden` (not just opacity) removes the action buttons from
  // the tab order and from hit-testing while hidden, so tabbing through the
  // chat never stops on an invisible control. Actions are revealed on hover
  // (mouse), when the user drills into the focused message with Enter
  // (`data-actionable` set by the roving message list), or while focus is
  // inside the actions themselves. Visibility flips at the end of the
  // opacity fade when hiding, and immediately when revealing.
  opacity: 0,
  visibility: 'hidden',
  transition: theme.transitions.create(['opacity', 'visibility'], {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
  '.MuiChatMessage-root:hover &, .MuiChatMessage-root[data-actionable="true"] &, &:focus-within': {
    opacity: 1,
    visibility: 'visible',
  },
  ...(ownerState?.isOwnMessage && {
    justifySelf: 'end',
  }),
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: (theme.vars || theme).shadows[1],
  padding: theme.spacing(0.25),
  '& .MuiIconButton-root': {
    padding: theme.spacing(0.5),
  },
  '& .MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(16),
  },
}));

const ChatMessageActions = React.forwardRef<HTMLDivElement, ChatMessageActionsProps>(
  function ChatMessageActions(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageActions' });
    // Drop a JS/theme-injected `classes` (not a prop on this sub-part — it shares
    // the `MuiChatMessage-*` namespace) so it can't leak onto the DOM via `...other`.
    const {
      slots,
      slotProps,
      className,
      sx,
      extraActions,
      message = null,
      children,
      classes: classesProp,
      ...other
    } = props as ChatMessageActionsProps & { classes?: unknown; children?: React.ReactNode };
    void classesProp;
    const classes = useChatMessageUtilityClasses(undefined);

    // Optional so `ChatMessageActions` stays renderable without a `<ChatProvider>`
    // (it is a public, presentational wrapper). When there is no provider,
    // `extraActions` buttons render disabled (their `onClick` would have no
    // runtime to drive), and a dev warning explains why.
    const chat = useChatActions(true);
    const hasExtraActions = (extraActions?.length ?? 0) > 0;

    if (process.env.NODE_ENV !== 'production' && hasExtraActions && chat == null) {
      warnOnce([
        'MUI X Chat: `extraActions` on the message actions bar require a `<ChatProvider>` (or `<ChatBox>`/`<ChatRoot>`).',
        'Without a runtime the action buttons cannot drive `chat.regenerate`/`chat.retry`, so they render disabled.',
        'Render the actions inside a chat provider to enable them.',
      ]);
    }

    return (
      <MessageActions
        ref={ref}
        {...other}
        slots={{
          ...slots,
          actions: slots?.actions ?? ChatMessageActionsStyled,
        }}
        slotProps={{
          ...slotProps,
          actions: mergeSlotProps(
            {
              className: clsx(classes.actions, className),
              sx,
            },
            slotProps?.actions,
          ) as any,
        }}
      >
        {children}
        {hasExtraActions &&
          extraActions!.map((action) => {
            const disabled = action.disabled || chat == null;
            const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
              if (chat == null) {
                return;
              }
              action.onClick(event, { message, chat });
            };

            if (action.icon != null) {
              return (
                <IconButton
                  key={action.id}
                  size="small"
                  aria-label={action.label}
                  title={action.label}
                  data-action={action.id}
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {action.icon}
                </IconButton>
              );
            }

            return (
              <Button
                key={action.id}
                size="small"
                data-action={action.id}
                disabled={disabled}
                onClick={handleClick}
              >
                {action.label}
              </Button>
            );
          })}
      </MessageActions>
    );
  },
);

ChatMessageActions.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  /**
   * Declarative action buttons appended after `children`. Lets consumers add
   * actions without replacing the `messageActions` slot component.
   */
  extraActions: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      icon: PropTypes.node,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
  /**
   * The message this bar belongs to. Injected by `ChatMessage` (from its
   * existing `useMessage` subscription); pass explicitly in standalone usage.
   */
  message: PropTypes.shape({
    author: PropTypes.shape({
      avatarUrl: PropTypes.string,
      displayName: PropTypes.string,
      id: PropTypes.string.isRequired,
      isOnline: PropTypes.bool,
      metadata: PropTypes.object,
      role: PropTypes.oneOf(['assistant', 'system', 'user']),
    }),
    conversationId: PropTypes.string,
    createdAt: PropTypes.string,
    editedAt: PropTypes.string,
    id: PropTypes.string.isRequired,
    metadata: PropTypes.object,
    parts: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          data: PropTypes.any.isRequired,
          id: PropTypes.string,
          transient: PropTypes.bool,
          type: PropTypes.object.isRequired,
        }),
        PropTypes.shape({
          filename: PropTypes.string,
          mediaType: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['file']).isRequired,
          url: PropTypes.string.isRequired,
        }),
        PropTypes.shape({
          sourceId: PropTypes.string.isRequired,
          text: PropTypes.string,
          title: PropTypes.string,
          type: PropTypes.oneOf(['source-document']).isRequired,
        }),
        PropTypes.shape({
          sourceId: PropTypes.string.isRequired,
          title: PropTypes.string,
          type: PropTypes.oneOf(['source-url']).isRequired,
          url: PropTypes.string.isRequired,
        }),
        PropTypes.shape({
          state: PropTypes.oneOf(['done', 'streaming']),
          text: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['reasoning']).isRequired,
        }),
        PropTypes.shape({
          state: PropTypes.oneOf(['done', 'streaming']),
          text: PropTypes.string.isRequired,
          type: PropTypes.oneOf(['text']).isRequired,
        }),
        PropTypes.shape({
          toolInvocation: PropTypes.shape({
            approval: PropTypes.object,
            approvalId: PropTypes.string,
            callProviderMetadata: PropTypes.object,
            errorText: PropTypes.string,
            input: PropTypes.any,
            output: PropTypes.any,
            preliminary: PropTypes.bool,
            providerExecuted: PropTypes.bool,
            state: PropTypes.oneOf([
              'approval-requested',
              'approval-responded',
              'input-available',
              'input-streaming',
              'output-available',
              'output-denied',
              'output-error',
            ]).isRequired,
            title: PropTypes.string,
            toolCallId: PropTypes.string.isRequired,
            toolName: PropTypes.string.isRequired,
          }).isRequired,
          type: PropTypes.oneOf(['dynamic-tool']).isRequired,
        }),
        PropTypes.shape({
          toolInvocation: PropTypes.shape({
            approval: PropTypes.object,
            approvalId: PropTypes.string,
            callProviderMetadata: PropTypes.object,
            errorText: PropTypes.string,
            input: PropTypes.any,
            output: PropTypes.any,
            preliminary: PropTypes.bool,
            providerExecuted: PropTypes.bool,
            state: PropTypes.oneOf([
              'approval-requested',
              'approval-responded',
              'input-available',
              'input-streaming',
              'output-available',
              'output-denied',
              'output-error',
            ]).isRequired,
            title: PropTypes.string,
            toolCallId: PropTypes.string.isRequired,
            toolName: PropTypes.string.isRequired,
          }).isRequired,
          type: PropTypes.oneOf(['tool']).isRequired,
        }),
        PropTypes.shape({
          type: PropTypes.oneOf(['step-start']).isRequired,
        }),
      ]).isRequired,
    ).isRequired,
    role: PropTypes.oneOf(['assistant', 'system', 'user']).isRequired,
    status: PropTypes.oneOf([
      'cancelled',
      'error',
      'pending',
      'read',
      'sending',
      'sent',
      'streaming',
    ]),
    updatedAt: PropTypes.string,
  }),
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageActions };
