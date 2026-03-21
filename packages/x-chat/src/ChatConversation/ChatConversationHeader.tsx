'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { ConversationHeader, type ConversationHeaderProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

export interface ChatConversationHeaderProps extends ConversationHeaderProps {
  className?: string;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationHeaderStyled = styled('header', {
  name: 'MuiChatConversation',
  slot: 'Header',
  overridesResolver: (_, styles) => styles.header,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  borderBottom: '1px solid',
  borderBottomColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  flexShrink: 0,
  minHeight: 56,
  boxSizing: 'border-box',
}));

export const ChatConversationHeader = React.forwardRef<HTMLElement, ChatConversationHeaderProps>(
  function ChatConversationHeader(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatConversationUtilityClasses(classesProp);

    return (
      <ConversationHeader
        {...other}
        slots={{
          header: slots?.header ?? ChatConversationHeaderStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          header: {
            ref,
            className: clsx(classes.header, className),
            ...(slotProps?.header as object),
          } as any,
        }}
      />
    );
  },
);
