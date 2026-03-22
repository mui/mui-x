'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatConversationInput');
import { SxProps, Theme } from '@mui/system';
import {
  ConversationInputAttachButton,
  type ConversationInputAttachButtonProps,
} from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputAttachButtonProps extends ConversationInputAttachButtonProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputAttachButtonStyled = styled('button', {
  name: 'MuiChatConversationInput',
  slot: 'AttachButton',
  overridesResolver: (_, styles) => styles.attachButton,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  color: (theme.vars || theme).palette.text.secondary,
  cursor: 'pointer',
  flexShrink: 0,
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
  padding: 0,
  fontSize: '1.25rem',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    color: (theme.vars || theme).palette.text.primary,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
  '&:disabled': {
    color: (theme.vars || theme).palette.action.disabled,
    cursor: 'not-allowed',
  },
  '& svg': {
    width: '1em',
    height: '1em',
    fontSize: 'inherit',
  },
}));

const ChatConversationInputAttachButton = React.forwardRef<
  HTMLButtonElement,
  ChatConversationInputAttachButtonProps
>(function ChatConversationInputAttachButton(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationInputUtilityClasses(classesProp);

  return (
    <ConversationInputAttachButton
      ref={ref}
      {...other}
      slots={{
        attachButton: slots?.attachButton ?? ChatConversationInputAttachButtonStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        attachButton: {
          className: clsx(classes.attachButton, className),
          sx,
          ...(slotProps?.attachButton as object),
        } as any,
      }}
    />
  );
});

ChatConversationInputAttachButton.propTypes = {
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

export { ChatConversationInputAttachButton };
