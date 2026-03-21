'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { ConversationInputRoot, type ConversationInputRootProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputProps extends ConversationInputRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputStyled = styled('form', {
  name: 'MuiChatConversationInput',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderTop: '1px solid',
  borderTopColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxSizing: 'border-box',
  flexShrink: 0,
}));

export const ChatConversationInput = React.forwardRef<HTMLFormElement, ChatConversationInputProps>(
  function ChatConversationInput(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatConversationInputUtilityClasses(classesProp);

    return (
      <ConversationInputRoot
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatConversationInputStyled,
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
