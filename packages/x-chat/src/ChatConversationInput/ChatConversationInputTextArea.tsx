'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import {
  ConversationInputTextArea,
  type ConversationInputTextAreaProps,
} from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputTextAreaProps extends ConversationInputTextAreaProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputTextAreaStyled = styled('textarea', {
  name: 'MuiChatConversationInput',
  slot: 'TextArea',
  overridesResolver: (_, styles) => styles.textArea,
})(({ theme }) => ({
  flex: 1,
  resize: 'none',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 1.5),
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  outline: 'none',
  boxSizing: 'border-box',
  minHeight: 40,
  maxHeight: 200,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  transition: theme.transitions.create('border-color', {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },

  '&:focus': {
    borderColor: (theme.vars || theme).palette.primary.main,
    boxShadow: `0 0 0 2px ${(theme.vars || theme).palette.primary.main}33`,
  },

  '&:disabled': {
    backgroundColor: (theme.vars || theme).palette.action.disabledBackground,
    color: (theme.vars || theme).palette.text.disabled,
    cursor: 'not-allowed',
  },

  '&::placeholder': {
    color: (theme.vars || theme).palette.text.disabled,
  },
}));

export const ChatConversationInputTextArea = React.forwardRef<
  HTMLTextAreaElement,
  ChatConversationInputTextAreaProps
>(function ChatConversationInputTextArea(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationInputUtilityClasses(classesProp);

  return (
    <ConversationInputTextArea
      ref={ref}
      {...other}
      slots={{
        input: slots?.input ?? ChatConversationInputTextAreaStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        input: {
          className: clsx(classes.textArea, className),
          sx,
          ...(slotProps?.input as object),
        } as any,
      }}
    />
  );
});
