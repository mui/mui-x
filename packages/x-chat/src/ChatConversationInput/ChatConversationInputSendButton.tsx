'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ConversationInputSendButton as UnstyledConversationInputSendButton,
  type ConversationInputSendButtonOwnerState,
  type ConversationInputSendButtonProps as UnstyledConversationInputSendButtonProps,
  type ConversationInputSendButtonSlotProps as UnstyledConversationInputSendButtonSlotProps,
  type ConversationInputSendButtonSlots as UnstyledConversationInputSendButtonSlots,
} from '@mui/x-chat-unstyled/conversation-input';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatConversationInputClasses } from './chatConversationInputClasses';

function DefaultSendIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="m3.4 20.4 17.75-7.61c.47-.2.47-.87 0-1.07L3.4 4.1a.58.58 0 0 0-.8.53l-.01 4.71c0 .4.3.75.69.82l10.2 1.84-10.2 1.82c-.4.08-.69.43-.69.83l.01 4.72c0 .42.43.71.8.53Z" />
    </svg>
  );
}

const ChatConversationInputSendButtonSlot = styled(IconButton, {
  name: 'MuiChatConversationInput',
  slot: 'SendButton',
})(({ theme }) => ({
  alignSelf: 'flex-end',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

function createDefaultSendButtonSlot(sx: ChatConversationInputSendButtonProps['sx']) {
  return React.forwardRef(function DefaultSendButton(
    props: React.ComponentProps<typeof IconButton> & {
      ownerState?: ConversationInputSendButtonOwnerState;
    },
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const { children, className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationInputSendButtonSlot
        className={joinClassNames(chatConversationInputClasses.sendButton, className)}
        ref={ref}
        sx={sx}
        {...other}
      >
        {children ?? <DefaultSendIcon />}
      </ChatConversationInputSendButtonSlot>
    );
  });
}

export interface ChatConversationInputSendButtonSlots {
  sendButton: UnstyledConversationInputSendButtonSlots['sendButton'];
}

export interface ChatConversationInputSendButtonSlotProps {
  sendButton?: UnstyledConversationInputSendButtonSlotProps['sendButton'];
}

export interface ChatConversationInputSendButtonProps extends Omit<
  UnstyledConversationInputSendButtonProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatConversationInputSendButtonSlotProps;
  slots?: Partial<ChatConversationInputSendButtonSlots>;
  sx?: SxProps<Theme>;
}

export const ChatConversationInputSendButton = React.forwardRef(
  function ChatConversationInputSendButton(
    inProps: ChatConversationInputSendButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const props = useChatThemeProps({
      props: inProps,
      name: 'MuiChatConversationInput',
    });
    const { className, slotProps, slots, sx, ...other } = props;
    const SendButton = React.useMemo(
      () => slots?.sendButton ?? createDefaultSendButtonSlot(sx),
      [slots?.sendButton, sx],
    );

    return (
      <UnstyledConversationInputSendButton
        ref={ref}
        slotProps={{
          sendButton: mergeSlotPropsWithClassName(
            slotProps?.sendButton,
            className ?? chatConversationInputClasses.sendButton,
          ),
        }}
        slots={{ sendButton: SendButton }}
        {...other}
      />
    );
  },
);
