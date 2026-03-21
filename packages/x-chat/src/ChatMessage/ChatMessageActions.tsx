'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { MessageActions, type MessageActionsProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

export interface ChatMessageActionsProps extends MessageActionsProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageActionsStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Actions',
  overridesResolver: (_, styles) => styles.actions,
})(({ theme }) => ({
  gridArea: 'actions',
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(0.25),
  opacity: 0,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
  '.MuiChatMessage-root:hover &, .MuiChatMessage-root:focus-within &': {
    opacity: 1,
  },
}));

export const ChatMessageActions = React.forwardRef<HTMLDivElement, ChatMessageActionsProps>(
  function ChatMessageActions(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageActions
        ref={ref}
        {...other}
        slots={{
          actions: slots?.actions ?? ChatMessageActionsStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          actions: {
            className: clsx(classes.actions, className),
            sx,
            ...(slotProps?.actions as object),
          } as any,
        }}
      />
    );
  },
);
