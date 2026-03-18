'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ConversationInputHelperText as UnstyledConversationInputHelperText,
  type ConversationInputHelperTextOwnerState,
  type ConversationInputHelperTextProps as UnstyledConversationInputHelperTextProps,
  type ConversationInputHelperTextSlotProps as UnstyledConversationInputHelperTextSlotProps,
  type ConversationInputHelperTextSlots as UnstyledConversationInputHelperTextSlots,
} from '@mui/x-chat-unstyled/conversation-input';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatConversationInputClasses } from './chatConversationInputClasses';

const ChatConversationInputHelperTextSlot = styled('div', {
  name: 'MuiChatConversationInput',
  slot: 'HelperText',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  minHeight: theme.spacing(2),
  minWidth: 0,
}));

function createDefaultHelperTextSlot(sx: ChatConversationInputHelperTextProps['sx']) {
  return React.forwardRef(function DefaultHelperText(
    props: React.ComponentPropsWithoutRef<'div'> & {
      ownerState?: ConversationInputHelperTextOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationInputHelperTextSlot
        className={joinClassNames(chatConversationInputClasses.helperText, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export interface ChatConversationInputHelperTextSlots {
  helperText: UnstyledConversationInputHelperTextSlots['helperText'];
}

export interface ChatConversationInputHelperTextSlotProps {
  helperText?: UnstyledConversationInputHelperTextSlotProps['helperText'];
}

export interface ChatConversationInputHelperTextProps extends Omit<
  UnstyledConversationInputHelperTextProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatConversationInputHelperTextSlotProps;
  slots?: Partial<ChatConversationInputHelperTextSlots>;
  sx?: SxProps<Theme>;
}

export const ChatConversationInputHelperText = React.forwardRef(
  function ChatConversationInputHelperText(
    inProps: ChatConversationInputHelperTextProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const props = useChatThemeProps({
      props: inProps,
      name: 'MuiChatConversationInput',
    });
    const { className, slotProps, slots, sx, ...other } = props;
    const HelperText = React.useMemo(
      () => slots?.helperText ?? createDefaultHelperTextSlot(sx),
      [slots?.helperText, sx],
    );

    return (
      <UnstyledConversationInputHelperText
        ref={ref}
        slotProps={{
          helperText: mergeSlotPropsWithClassName(
            slotProps?.helperText,
            className ?? chatConversationInputClasses.helperText,
          ),
        }}
        slots={{ helperText: HelperText }}
        {...other}
      />
    );
  },
);
