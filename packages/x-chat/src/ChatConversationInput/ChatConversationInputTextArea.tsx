'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ConversationInputTextArea as UnstyledConversationInputTextArea,
  type ConversationInputTextAreaOwnerState,
  type ConversationInputTextAreaProps as UnstyledConversationInputTextAreaProps,
  type ConversationInputTextAreaSlotProps as UnstyledConversationInputTextAreaSlotProps,
  type ConversationInputTextAreaSlots as UnstyledConversationInputTextAreaSlots,
} from '@mui/x-chat-unstyled/conversation-input';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys } from '../internals/material/chatThemeVars';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatConversationInputClasses } from './chatConversationInputClasses';

const ChatConversationInputTextAreaSlot = styled('textarea', {
  name: 'MuiChatConversationInput',
  slot: 'Input',
})(({ theme }) => ({
  ...theme.typography.body1,
  appearance: 'none',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid var(${chatCssVarKeys.composerBorder})`,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  font: 'inherit',
  lineHeight: 'inherit',
  margin: 0,
  maxHeight: theme.spacing(24),
  minHeight: theme.spacing(7),
  minWidth: 0,
  outline: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: theme.spacing(1.25, 1.5),
  resize: 'none',
  width: '100%',
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  '&:focus-visible': {
    borderColor: `var(${chatCssVarKeys.composerFocusRing})`,
    boxShadow: `0 0 0 3px var(${chatCssVarKeys.composerFocusRing})`,
  },
}));

function createDefaultInputSlot(sx: ChatConversationInputTextAreaProps['sx']) {
  return React.forwardRef(function DefaultInput(
    props: React.ComponentPropsWithoutRef<'textarea'> & {
      ownerState?: ConversationInputTextAreaOwnerState;
    },
    ref: React.Ref<HTMLTextAreaElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationInputTextAreaSlot
        className={joinClassNames(chatConversationInputClasses.input, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export interface ChatConversationInputTextAreaSlots {
  input: UnstyledConversationInputTextAreaSlots['input'];
}

export interface ChatConversationInputTextAreaSlotProps {
  input?: UnstyledConversationInputTextAreaSlotProps['input'];
}

export interface ChatConversationInputTextAreaProps extends Omit<
  UnstyledConversationInputTextAreaProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatConversationInputTextAreaSlotProps;
  slots?: Partial<ChatConversationInputTextAreaSlots>;
  sx?: SxProps<Theme>;
}

export const ChatConversationInputTextArea = React.forwardRef(
  function ChatConversationInputTextArea(
    inProps: ChatConversationInputTextAreaProps,
    ref: React.Ref<HTMLTextAreaElement>,
  ) {
    const props = useChatThemeProps({
      props: inProps,
      name: 'MuiChatConversationInput',
    });
    const { className, slotProps, slots, sx, ...other } = props;
    const Input = React.useMemo(
      () => slots?.input ?? createDefaultInputSlot(sx),
      [slots?.input, sx],
    );

    return (
      <UnstyledConversationInputTextArea
        ref={ref}
        slotProps={{
          input: mergeSlotPropsWithClassName(
            slotProps?.input,
            className ?? chatConversationInputClasses.input,
          ),
        }}
        slots={{ input: Input }}
        {...other}
      />
    );
  },
);
