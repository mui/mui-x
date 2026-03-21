'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import {
  ConversationInputHelperText,
  type ConversationInputHelperTextProps,
} from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputHelperTextProps extends ConversationInputHelperTextProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputHelperTextStyled = styled('p', {
  name: 'MuiChatConversationInput',
  slot: 'HelperText',
  overridesResolver: (_, styles) => styles.helperText,
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: theme.typography.caption.lineHeight,
  color: (theme.vars || theme).palette.error.main,
  paddingInline: theme.spacing(0.5),
}));

export const ChatConversationInputHelperText = React.forwardRef<
  HTMLParagraphElement,
  ChatConversationInputHelperTextProps
>(function ChatConversationInputHelperText(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationInputUtilityClasses(classesProp);

  return (
    <ConversationInputHelperText
      ref={ref}
      {...other}
      slots={{
        helperText: slots?.helperText ?? ChatConversationInputHelperTextStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        helperText: {
          className: clsx(classes.helperText, className),
          sx,
          ...(slotProps?.helperText as object),
        } as any,
      }}
    />
  );
});
