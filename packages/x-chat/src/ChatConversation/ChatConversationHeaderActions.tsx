'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import {
  ConversationHeaderActions,
  type ConversationHeaderActionsProps,
} from '@mui/x-chat-unstyled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

export interface ChatConversationHeaderActionsProps extends ConversationHeaderActionsProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationHeaderActionsStyled = styled('div', {
  name: 'MuiChatConversation',
  slot: 'HeaderActions',
  overridesResolver: (_, styles) => styles.headerActions,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginInlineStart: 'auto',
}));

export const ChatConversationHeaderActions = React.forwardRef<
  HTMLDivElement,
  ChatConversationHeaderActionsProps
>(function ChatConversationHeaderActions(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationUtilityClasses(classesProp);

  return (
    <ConversationHeaderActions
      ref={ref}
      {...other}
      slots={{
        actions: slots?.actions ?? ChatConversationHeaderActionsStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        actions: {
          className: clsx(classes.headerActions, className),
          sx,
          ...(slotProps?.actions as object),
        } as any,
      }}
    />
  );
});
