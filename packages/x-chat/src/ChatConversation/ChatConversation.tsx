'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { ConversationRoot, type ConversationRootProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

export interface ChatConversationProps extends ConversationRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationStyled = styled('div', {
  name: 'MuiChatConversation',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
}));

export const ChatConversation = React.forwardRef<HTMLDivElement, ChatConversationProps>(
  function ChatConversation(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatConversationUtilityClasses(classesProp);

    return (
      <ConversationRoot
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatConversationStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            sx,
            ...(slotProps?.root as object),
          } as any,
        }}
      />
    );
  },
);
