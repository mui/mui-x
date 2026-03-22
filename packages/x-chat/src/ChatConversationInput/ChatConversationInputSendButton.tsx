'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatConversationInput');
import { SxProps, Theme } from '@mui/system';
import {
  ConversationInputSendButton,
  type ConversationInputSendButtonProps,
} from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputSendButtonProps extends ConversationInputSendButtonProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputSendButtonStyled = styled('button', {
  name: 'MuiChatConversationInput',
  slot: 'SendButton',
  overridesResolver: (_, styles) => styles.sendButton,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.primary.contrastText,
  cursor: 'pointer',
  flexShrink: 0,
  transition: theme.transitions.create(['background-color', 'opacity'], {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
  padding: 0,
  fontSize: '1.25rem',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.primary.dark,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
  '&:disabled': {
    backgroundColor: (theme.vars || theme).palette.action.disabledBackground,
    color: (theme.vars || theme).palette.action.disabled,
    cursor: 'not-allowed',
    opacity: (theme.vars || theme).palette.action.disabledOpacity,
  },
  '& svg': {
    width: '1em',
    height: '1em',
    fontSize: 'inherit',
  },
}));

const ChatConversationInputSendButton = React.forwardRef<
  HTMLButtonElement,
  ChatConversationInputSendButtonProps
>(function ChatConversationInputSendButton(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationInputUtilityClasses(classesProp);

  return (
    <ConversationInputSendButton
      ref={ref}
      {...other}
      slots={{
        sendButton: slots?.sendButton ?? ChatConversationInputSendButtonStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        sendButton: {
          className: clsx(classes.sendButton, className),
          sx,
          ...slotProps?.sendButton,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      }}
    />
  );
});

ChatConversationInputSendButton.propTypes = {
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

export { ChatConversationInputSendButton };
