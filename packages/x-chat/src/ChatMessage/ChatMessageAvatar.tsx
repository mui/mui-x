'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MessageAvatar, type MessageAvatarProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses } from './chatMessageClasses';
import { mergeSlotProps } from '../internals/mergeSlotProps';

const useThemeProps = createUseThemeProps('MuiChatMessageAvatar');

export interface ChatMessageAvatarProps extends MessageAvatarProps {
  className?: string;
}

const ChatMessageAvatarStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Avatar',
  overridesResolver: (_, styles) => styles.avatar,
})<{ ownerState?: { variant?: string } }>(({ theme, ownerState }) => ({
  gridArea: 'avatar',
  width: 'var(--MuiChatMessage-avatarSize, 36px)',
  height: 'var(--MuiChatMessage-avatarSize, 36px)',
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  alignSelf: 'flex-start',
  backgroundColor: (theme.vars || theme).palette.grey[300],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.secondary,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  // Compact: avatar spans both the authorName and content rows, aligned to the top.
  ...(ownerState?.variant === 'compact' && {
    gridRow: '1 / 3',
    alignSelf: 'flex-start',
    marginTop: theme.spacing(0.25),
  }),
}));

const ChatMessageAvatar = React.forwardRef<HTMLDivElement, ChatMessageAvatarProps>(
  function ChatMessageAvatar(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageAvatar' });
    // Drop a JS/theme-injected `classes` (not a prop on this sub-part — it shares
    // the `MuiChatMessage-*` namespace) so it can't leak onto the DOM via `...other`.
    const {
      slots,
      slotProps,
      className,
      classes: classesProp,
      ...other
    } = props as ChatMessageAvatarProps & { classes?: unknown };
    void classesProp;
    const classes = useChatMessageUtilityClasses(undefined);

    return (
      <MessageAvatar
        ref={ref}
        {...other}
        slots={{
          ...slots,
          avatar: slots?.avatar ?? ChatMessageAvatarStyled,
        }}
        slotProps={{
          ...slotProps,
          avatar: mergeSlotProps(
            {
              className: clsx(classes.avatar, className),
            },
            slotProps?.avatar,
          ) as any,
        }}
      />
    );
  },
);

ChatMessageAvatar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatMessageAvatar };
