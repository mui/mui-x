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
})(({ theme }) => ({
  gridArea: 'avatar',
  width: 'var(--MuiChatMessage-avatarSize, 36px)',
  height: 'var(--MuiChatMessage-avatarSize, 36px)',
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  alignSelf: 'flex-start',
  marginTop: theme.spacing(0.5),
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
