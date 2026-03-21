'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { MessageMeta, type MessageMetaProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

export interface ChatMessageMetaProps extends MessageMetaProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageMetaStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Meta',
  overridesResolver: (_, styles) => styles.meta,
})(({ theme }) => ({
  gridArea: 'meta',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  lineHeight: 1.4,
  minHeight: '1.2em',
}));

export const ChatMessageMeta = React.forwardRef<HTMLDivElement, ChatMessageMetaProps>(
  function ChatMessageMeta(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageMeta
        ref={ref}
        {...other}
        slots={{
          meta: slots?.meta ?? ChatMessageMetaStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          meta: {
            className: clsx(classes.meta, className),
            sx,
            ...(slotProps?.meta as object),
          } as any,
        }}
      />
    );
  },
);
