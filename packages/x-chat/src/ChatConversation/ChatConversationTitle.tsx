'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { ConversationTitle, type ConversationTitleProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

export interface ChatConversationTitleProps extends ConversationTitleProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationTitleStyled = styled('h2', {
  name: 'MuiChatConversation',
  slot: 'Title',
  overridesResolver: (_, styles) => styles.title,
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.subtitle1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: 1.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const ChatConversationTitle = React.forwardRef<
  HTMLHeadingElement,
  ChatConversationTitleProps
>(function ChatConversationTitle(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationUtilityClasses(classesProp);

  return (
    <ConversationTitle
      ref={ref}
      {...other}
      slots={{
        title: slots?.title ?? ChatConversationTitleStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        title: {
          className: clsx(classes.title, className),
          sx,
          ...(slotProps?.title as object),
        } as any,
      }}
    />
  );
});
