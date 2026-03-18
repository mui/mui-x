'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ConversationInputAttachButton as UnstyledConversationInputAttachButton,
  type ConversationInputAttachButtonOwnerState,
  type ConversationInputAttachButtonProps as UnstyledConversationInputAttachButtonProps,
  type ConversationInputAttachButtonSlotProps as UnstyledConversationInputAttachButtonSlotProps,
  type ConversationInputAttachButtonSlots as UnstyledConversationInputAttachButtonSlots,
} from '@mui/x-chat-unstyled/conversation-input';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys } from '../internals/material/chatThemeVars';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatConversationInputClasses } from './chatConversationInputClasses';

function DefaultAttachIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M16.5 6v11.5a4.5 4.5 0 1 1-9 0V5a2.5 2.5 0 0 1 5 0v10.5a.5.5 0 0 1-1 0V5a1.5 1.5 0 1 0-3 0v12.5a3.5 3.5 0 1 0 7 0V6h1Z" />
    </svg>
  );
}

const ChatConversationInputAttachButtonSlot = styled(IconButton, {
  name: 'MuiChatConversationInput',
  slot: 'AttachButton',
})(({ theme }) => ({
  alignSelf: 'flex-end',
  border: `1px solid var(${chatCssVarKeys.composerBorder})`,
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

function createDefaultAttachButtonSlot(sx: ChatConversationInputAttachButtonProps['sx']) {
  return React.forwardRef(function DefaultAttachButton(
    props: React.ComponentProps<typeof IconButton> & {
      ownerState?: ConversationInputAttachButtonOwnerState;
    },
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const { children, className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationInputAttachButtonSlot
        className={joinClassNames(chatConversationInputClasses.attachButton, className)}
        ref={ref}
        sx={sx}
        {...other}
      >
        {children ?? <DefaultAttachIcon />}
      </ChatConversationInputAttachButtonSlot>
    );
  });
}

export interface ChatConversationInputAttachButtonSlots {
  attachButton: UnstyledConversationInputAttachButtonSlots['attachButton'];
  attachInput: UnstyledConversationInputAttachButtonSlots['attachInput'];
}

export interface ChatConversationInputAttachButtonSlotProps {
  attachButton?: UnstyledConversationInputAttachButtonSlotProps['attachButton'];
  attachInput?: UnstyledConversationInputAttachButtonSlotProps['attachInput'];
}

export interface ChatConversationInputAttachButtonProps extends Omit<
  UnstyledConversationInputAttachButtonProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatConversationInputAttachButtonSlotProps;
  slots?: Partial<ChatConversationInputAttachButtonSlots>;
  sx?: SxProps<Theme>;
}

export const ChatConversationInputAttachButton = React.forwardRef(
  function ChatConversationInputAttachButton(
    inProps: ChatConversationInputAttachButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const props = useChatThemeProps({
      props: inProps,
      name: 'MuiChatConversationInput',
    });
    const { className, slotProps, slots, sx, ...other } = props;
    const AttachButton = React.useMemo(
      () => slots?.attachButton ?? createDefaultAttachButtonSlot(sx),
      [slots?.attachButton, sx],
    );
    const AttachInput = slots?.attachInput ?? 'input';

    return (
      <UnstyledConversationInputAttachButton
        ref={ref}
        slotProps={{
          attachButton: mergeSlotPropsWithClassName(
            slotProps?.attachButton,
            className ?? chatConversationInputClasses.attachButton,
          ),
          attachInput: slotProps?.attachInput,
        }}
        slots={{ attachButton: AttachButton, attachInput: AttachInput }}
        {...other}
      />
    );
  },
);
