'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { ScrollToBottomAffordance, type ScrollToBottomAffordanceProps } from '@mui/x-chat-unstyled';
import { useChatIndicatorUtilityClasses, type ChatIndicatorClasses } from './chatIndicatorClasses';

export interface ChatScrollToBottomAffordanceProps extends ScrollToBottomAffordanceProps {
  className?: string;
  classes?: Partial<ChatIndicatorClasses>;
}

const ChatScrollToBottomAffordanceStyled = styled(IconButton, {
  name: 'MuiChatIndicator',
  slot: 'ScrollToBottom',
  overridesResolver: (_, styles) => styles.scrollToBottom,
})(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  left: '50%',
  transform: 'translateX(-50%)',
  pointerEvents: 'auto',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxShadow: theme.shadows[2],
  fontSize: '1.25rem',
  transition: theme.transitions.create(['box-shadow', 'background-color'], {
    duration: theme.transitions.duration.short,
  }),
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },

  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.background.paper,
    boxShadow: theme.shadows[4],
  },
}));

function DefaultScrollToBottomIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
    </svg>
  );
}

export const ChatScrollToBottomAffordance = React.forwardRef<
  HTMLButtonElement,
  ChatScrollToBottomAffordanceProps
>(function ChatScrollToBottomAffordance(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatIndicator' });
  const { slots, slotProps, className, classes: classesProp, ...other } = props;
  const classes = useChatIndicatorUtilityClasses(classesProp);

  return (
    <ScrollToBottomAffordance
      ref={ref}
      {...other}
      slots={{
        root: ChatScrollToBottomAffordanceStyled,
        icon: DefaultScrollToBottomIcon,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        root: {
          size: 'small',
          className: clsx(classes.scrollToBottom, className),
          ...(slotProps?.root as object),
        } as any,
      }}
    />
  );
});
