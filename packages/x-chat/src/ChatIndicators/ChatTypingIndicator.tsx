'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { TypingIndicator, type TypingIndicatorProps } from '@mui/x-chat-unstyled';
import { useChatIndicatorUtilityClasses, type ChatIndicatorClasses } from './chatIndicatorClasses';

export interface ChatTypingIndicatorProps extends TypingIndicatorProps {
  className?: string;
  classes?: Partial<ChatIndicatorClasses>;
}

const ChatTypingIndicatorStyled = styled('div', {
  name: 'MuiChatIndicator',
  slot: 'TypingIndicator',
  overridesResolver: (_, styles) => styles.typingIndicator,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  fontStyle: 'italic',
}));

export const ChatTypingIndicator = React.forwardRef<HTMLDivElement, ChatTypingIndicatorProps>(
  function ChatTypingIndicator(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatIndicator' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatIndicatorUtilityClasses(classesProp);

    return (
      <TypingIndicator
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatTypingIndicatorStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.typingIndicator, className),
            ...(slotProps?.root as object),
          } as any,
        }}
      />
    );
  },
);
