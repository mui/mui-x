'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { UnreadMarker, type UnreadMarkerProps } from '@mui/x-chat-unstyled';
import { useChatIndicatorUtilityClasses, type ChatIndicatorClasses } from './chatIndicatorClasses';

export interface ChatUnreadMarkerProps extends UnreadMarkerProps {
  className?: string;
  classes?: Partial<ChatIndicatorClasses>;
}

const ChatUnreadMarkerStyled = styled('div', {
  name: 'MuiChatIndicator',
  slot: 'UnreadMarker',
  overridesResolver: (_, styles) => styles.unreadMarker,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(0.5),
}));

const ChatUnreadMarkerLabelStyled = styled('div', {
  name: 'MuiChatIndicator',
  slot: 'UnreadMarkerLabel',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.primary.main,
  whiteSpace: 'nowrap',
}));

export const ChatUnreadMarker = React.forwardRef<HTMLDivElement, ChatUnreadMarkerProps>(
  function ChatUnreadMarker(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatIndicator' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatIndicatorUtilityClasses(classesProp);

    return (
      <UnreadMarker
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatUnreadMarkerStyled,
          label: slots?.label ?? ChatUnreadMarkerLabelStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.unreadMarker, className),
            ...(slotProps?.root as object),
          } as any,
        }}
      />
    );
  },
);
