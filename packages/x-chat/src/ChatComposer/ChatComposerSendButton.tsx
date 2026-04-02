'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { ComposerSendButton, type ComposerSendButtonProps } from '@mui/x-chat-unstyled';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatComposerUtilityClasses, type ChatComposerClasses } from './chatComposerClasses';

const useThemeProps = createUseThemeProps('MuiChatComposer');

export interface ChatComposerSendButtonProps extends ComposerSendButtonProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
}

const ChatComposerSendButtonStyled = styled('button', {
  name: 'MuiChatComposer',
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
  marginInlineStart: 'auto',
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

const ChatComposerSendButton = React.forwardRef<HTMLButtonElement, ChatComposerSendButtonProps>(
  function ChatComposerSendButton(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposer' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);

    return (
      <ComposerSendButton
        ref={ref}
        {...other}
        slots={{
          sendButton: slots?.sendButton ?? ChatComposerSendButtonStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          sendButton: {
            className: clsx(classes.sendButton, className),
            sx,
            ...slotProps?.sendButton,
          } as any,
        }}
      />
    );
  },
);

ChatComposerSendButton.propTypes = {
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

export { ChatComposerSendButton };
