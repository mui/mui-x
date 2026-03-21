'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { MessageGroup, type MessageGroupProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

export interface ChatMessageGroupProps extends MessageGroupProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageGroupStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Group',
  overridesResolver: (_, styles) => styles.group,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.1),
  width: '100%',
}));

const ChatMessageGroupAuthorNameStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'GroupAuthorName',
})<{ ownerState?: { authorRole?: string } }>(({ theme, ownerState }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.secondary,
  marginBottom: 0,
  ...(ownerState?.authorRole === 'user'
    ? {
        textAlign: 'right' as const,
        paddingInlineEnd: `calc(36px + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
      }
    : {
        paddingInlineStart: `calc(36px + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
      }),
}));

export const ChatMessageGroup = React.forwardRef<HTMLDivElement, ChatMessageGroupProps>(
  function ChatMessageGroup(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageGroup
        ref={ref}
        {...other}
        slots={{
          group: slots?.group ?? ChatMessageGroupStyled,
          authorName: slots?.authorName ?? ChatMessageGroupAuthorNameStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          group: {
            className: clsx(classes.group, className),
            sx,
            ...(slotProps?.group as object),
          } as any,
        }}
      />
    );
  },
);
