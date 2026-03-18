'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ConversationInputToolbar as UnstyledConversationInputToolbar,
  type ConversationInputToolbarOwnerState,
  type ConversationInputToolbarProps as UnstyledConversationInputToolbarProps,
  type ConversationInputToolbarSlotProps as UnstyledConversationInputToolbarSlotProps,
  type ConversationInputToolbarSlots as UnstyledConversationInputToolbarSlots,
} from '@mui/x-chat-unstyled/conversation-input';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatConversationInputClasses } from './chatConversationInputClasses';

const ChatConversationInputToolbarSlot = styled('div', {
  name: 'MuiChatConversationInput',
  slot: 'Toolbar',
})(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

function createDefaultToolbarSlot(sx: ChatConversationInputToolbarProps['sx']) {
  return React.forwardRef(function DefaultToolbar(
    props: React.ComponentPropsWithoutRef<'div'> & {
      ownerState?: ConversationInputToolbarOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationInputToolbarSlot
        className={joinClassNames(chatConversationInputClasses.toolbar, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export interface ChatConversationInputToolbarSlots {
  toolbar: UnstyledConversationInputToolbarSlots['toolbar'];
}

export interface ChatConversationInputToolbarSlotProps {
  toolbar?: UnstyledConversationInputToolbarSlotProps['toolbar'];
}

export interface ChatConversationInputToolbarProps extends Omit<
  UnstyledConversationInputToolbarProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatConversationInputToolbarSlotProps;
  slots?: Partial<ChatConversationInputToolbarSlots>;
  sx?: SxProps<Theme>;
}

export const ChatConversationInputToolbar = React.forwardRef(function ChatConversationInputToolbar(
  inProps: ChatConversationInputToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatConversationInput',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Toolbar = React.useMemo(
    () => slots?.toolbar ?? createDefaultToolbarSlot(sx),
    [slots?.toolbar, sx],
  );

  return (
    <UnstyledConversationInputToolbar
      ref={ref}
      slotProps={{
        toolbar: mergeSlotPropsWithClassName(
          slotProps?.toolbar,
          className ?? chatConversationInputClasses.toolbar,
        ),
      }}
      slots={{ toolbar: Toolbar }}
      {...other}
    />
  );
});
