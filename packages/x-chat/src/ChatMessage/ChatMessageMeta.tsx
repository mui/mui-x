'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { MessageMeta, type MessageMetaProps } from '@mui/x-chat-unstyled';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

const useThemeProps = createUseThemeProps('MuiChatMessage');

export interface ChatMessageMetaProps extends MessageMetaProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

// Inline SVG — avoids @mui/icons-material dependency
function StatusCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

const ChatMessageMetaStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Meta',
  overridesResolver: (_, styles) => styles.meta,
})<{ ownerState?: { role?: string; variant?: string } }>(({ theme, ownerState }) => ({
  gridArea: 'meta',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  lineHeight: 1.4,
  minHeight: '1.2em',
  // Compact: always right-align status + timestamp regardless of role.
  // Align to the top of the grid row so it stays at the top when content wraps.
  // Default: only right-align for user messages.
  ...((ownerState?.variant === 'compact' || ownerState?.role === 'user') && {
    justifyContent: 'flex-end',
  }),
  ...(ownerState?.variant === 'compact' && {
    alignSelf: 'start',
    whiteSpace: 'nowrap',
  }),
}));

const ChatMessageStatusStyled = styled('span', {
  name: 'MuiChatMessage',
  slot: 'Status',
  overridesResolver: (_, styles) => styles.status,
})<{ ownerState?: { variant?: string } }>(({ ownerState }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  // In compact mode, place the status icon before the timestamp.
  ...(ownerState?.variant === 'compact' && {
    order: -1,
  }),
}));

/**
 * Custom Status slot for ChatMessage.
 * In compact mode, renders a checkmark icon for "sent" status instead of text.
 */
const ChatMessageStatusSlot = React.forwardRef<HTMLSpanElement, any>(function ChatMessageStatusSlot(
  { ownerState, children, ...other },
  ref,
) {
  const isCompact = ownerState?.variant === 'compact';
  const isSent = ownerState?.message?.status === 'sent';

  return (
    <ChatMessageStatusStyled ref={ref} ownerState={ownerState} {...other}>
      {isCompact && isSent ? <StatusCheckIcon /> : children}
    </ChatMessageStatusStyled>
  );
});

const ChatMessageMeta = React.forwardRef<HTMLDivElement, ChatMessageMetaProps>(
  function ChatMessageMeta(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageMeta
        ref={ref}
        {...other}
        slots={{
          meta: ChatMessageMetaStyled,
          status: ChatMessageStatusSlot,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          meta: {
            className: clsx(classes.meta, className),
            sx,
            ...(slotProps?.meta as object),
          } as any,
        }}
      />
    );
  },
);

ChatMessageMeta.propTypes = {
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
} as any;

export { ChatMessageMeta };
