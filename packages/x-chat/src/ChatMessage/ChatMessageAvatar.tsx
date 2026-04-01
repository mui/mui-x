'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatMessage');
import { MessageAvatar, type MessageAvatarProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

export interface ChatMessageAvatarProps extends MessageAvatarProps {
  className?: string;
  classes?: Partial<ChatMessageClasses>;
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
  // Compact: avatar spans both the authorName and content rows, centered vertically
  // so it aligns with the combined height of the name + first line of text.
  ...(ownerState?.variant === 'compact' && {
    gridRow: '1 / 3',
    alignSelf: 'center',
  }),
}));

const ChatMessageAvatar = React.forwardRef<HTMLDivElement, ChatMessageAvatarProps>(
  function ChatMessageAvatar(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageAvatar
        ref={ref}
        {...other}
        slots={{
          avatar: slots?.avatar ?? ChatMessageAvatarStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          avatar: {
            className: clsx(classes.avatar, className),
            ...(slotProps?.avatar as object),
          } as any,
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
  classes: PropTypes.object,
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatMessageAvatar };
