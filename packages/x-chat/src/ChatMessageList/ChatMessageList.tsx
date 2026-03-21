'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import {
  MessageListRoot,
  type MessageListRootProps,
  type MessageListRootHandle,
} from '@mui/x-chat-unstyled';
import {
  useChatMessageListUtilityClasses,
  type ChatMessageListClasses,
} from './chatMessageListClasses';

export interface ChatMessageListProps extends MessageListRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageListClasses>;
}

const ChatMessageListStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
}));

const ChatMessageListScrollerStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Scroller',
  overridesResolver: (_, styles) => styles.scroller,
})(() => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  minHeight: 0,
}));

const ChatMessageListContentStyled = styled('div', {
  name: 'MuiChatMessageList',
  slot: 'Content',
  overridesResolver: (_, styles) => styles.content,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingBlock: theme.spacing(1),
  paddingInline: theme.spacing(2),
  boxSizing: 'border-box',
}));

export const ChatMessageList = React.forwardRef<MessageListRootHandle, ChatMessageListProps>(
  function ChatMessageList(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageList' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageListUtilityClasses(classesProp);

    return (
      <MessageListRoot
        ref={ref}
        {...other}
        slots={{
          messageList: slots?.messageList ?? ChatMessageListStyled,
          messageListScroller: slots?.messageListScroller ?? ChatMessageListScrollerStyled,
          messageListContent: slots?.messageListContent ?? ChatMessageListContentStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          messageList: {
            className: clsx(classes.root, className),
            sx,
            ...(slotProps?.messageList as object),
          } as any,
          messageListScroller: {
            className: classes.scroller,
            ...(slotProps?.messageListScroller as object),
          } as any,
          messageListContent: {
            className: classes.content,
            ...(slotProps?.messageListContent as object),
          } as any,
        }}
      />
    );
  },
);
