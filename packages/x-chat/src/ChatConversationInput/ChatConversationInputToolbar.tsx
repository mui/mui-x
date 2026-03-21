'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { ConversationInputToolbar, type ConversationInputToolbarProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputToolbarProps extends ConversationInputToolbarProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputToolbarStyled = styled('div', {
  name: 'MuiChatConversationInput',
  slot: 'Toolbar',
  overridesResolver: (_, styles) => styles.toolbar,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(0.5),
}));

export const ChatConversationInputToolbar = React.forwardRef<
  HTMLDivElement,
  ChatConversationInputToolbarProps
>(function ChatConversationInputToolbar(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationInputUtilityClasses(classesProp);

  return (
    <ConversationInputToolbar
      ref={ref}
      {...other}
      slots={{
        toolbar: slots?.toolbar ?? ChatConversationInputToolbarStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        toolbar: {
          className: clsx(classes.toolbar, className),
          sx,
          ...(slotProps?.toolbar as object),
        } as any,
      }}
    />
  );
});
