'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ConversationInputRoot,
  type ConversationInputRootOwnerState,
  type ConversationInputRootProps as UnstyledConversationInputRootProps,
  type ConversationInputRootSlotProps as UnstyledConversationInputRootSlotProps,
  type ConversationInputRootSlots as UnstyledConversationInputRootSlots,
  ConversationInputTextAreaSlots as UnstyledConversationInputTextAreaSlots,
  ConversationInputSendButtonSlots as UnstyledConversationInputSendButtonSlots,
  ConversationInputAttachButtonSlots as UnstyledConversationInputAttachButtonSlots,
  ConversationInputAttachButtonSlotProps as UnstyledConversationInputAttachButtonSlotProps,
  ConversationInputToolbarSlots as UnstyledConversationInputToolbarSlots,
  ConversationInputHelperTextSlots as UnstyledConversationInputHelperTextSlots,
  ConversationInputTextAreaSlotProps as UnstyledConversationInputTextAreaSlotProps,
  ConversationInputSendButtonSlotProps as UnstyledConversationInputSendButtonSlotProps,
  ConversationInputToolbarSlotProps as UnstyledConversationInputToolbarSlotProps,
  ConversationInputHelperTextSlotProps as UnstyledConversationInputHelperTextSlotProps,
} from '@mui/x-chat-unstyled/conversation-input';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatConversationInputClasses } from './chatConversationInputClasses';
import { ChatConversationInputTextArea } from './ChatConversationInputTextArea';
import { ChatConversationInputSendButton } from './ChatConversationInputSendButton';
import { ChatConversationInputAttachButton } from './ChatConversationInputAttachButton';
import { ChatConversationInputToolbar } from './ChatConversationInputToolbar';
import { ChatConversationInputHelperText } from './ChatConversationInputHelperText';

export { ChatConversationInputTextArea } from './ChatConversationInputTextArea';
export type {
  ChatConversationInputTextAreaProps,
  ChatConversationInputTextAreaSlotProps,
  ChatConversationInputTextAreaSlots,
} from './ChatConversationInputTextArea';
export { ChatConversationInputSendButton } from './ChatConversationInputSendButton';
export type {
  ChatConversationInputSendButtonProps,
  ChatConversationInputSendButtonSlotProps,
  ChatConversationInputSendButtonSlots,
} from './ChatConversationInputSendButton';
export { ChatConversationInputAttachButton } from './ChatConversationInputAttachButton';
export type {
  ChatConversationInputAttachButtonProps,
  ChatConversationInputAttachButtonSlotProps,
  ChatConversationInputAttachButtonSlots,
} from './ChatConversationInputAttachButton';
export { ChatConversationInputToolbar } from './ChatConversationInputToolbar';
export type {
  ChatConversationInputToolbarProps,
  ChatConversationInputToolbarSlotProps,
  ChatConversationInputToolbarSlots,
} from './ChatConversationInputToolbar';
export { ChatConversationInputHelperText } from './ChatConversationInputHelperText';
export type {
  ChatConversationInputHelperTextProps,
  ChatConversationInputHelperTextSlotProps,
  ChatConversationInputHelperTextSlots,
} from './ChatConversationInputHelperText';

const ChatConversationInputRootSlot = styled('form', {
  name: 'MuiChatConversationInput',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  ...getChatCssVars(theme),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid var(${chatCssVarKeys.composerBorder})`,
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  minWidth: 0,
  padding: theme.spacing(1.5, 2),
}));

const ChatConversationInputMainRow = styled('div')(({ theme }) => ({
  alignItems: 'flex-end',
  columnGap: theme.spacing(1),
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  minWidth: 0,
}));

function createDefaultRootSlot(sx: ChatConversationInputProps['sx']) {
  return React.forwardRef(function DefaultRoot(
    props: React.ComponentPropsWithoutRef<'form'> & {
      ownerState?: ConversationInputRootOwnerState;
    },
    ref: React.Ref<HTMLFormElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatConversationInputRootSlot
        className={joinClassNames(chatConversationInputClasses.root, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export interface ChatConversationInputSlots {
  root: UnstyledConversationInputRootSlots['root'];
  input: UnstyledConversationInputTextAreaSlots['input'];
  sendButton: UnstyledConversationInputSendButtonSlots['sendButton'];
  attachButton: UnstyledConversationInputAttachButtonSlots['attachButton'];
  attachInput: UnstyledConversationInputAttachButtonSlots['attachInput'];
  toolbar: UnstyledConversationInputToolbarSlots['toolbar'];
  helperText: UnstyledConversationInputHelperTextSlots['helperText'];
}

export interface ChatConversationInputSlotProps {
  root?: UnstyledConversationInputRootSlotProps['root'];
  input?: UnstyledConversationInputTextAreaSlotProps['input'];
  sendButton?: UnstyledConversationInputSendButtonSlotProps['sendButton'];
  attachButton?: UnstyledConversationInputAttachButtonSlotProps['attachButton'];
  attachInput?: UnstyledConversationInputAttachButtonSlotProps['attachInput'];
  toolbar?: UnstyledConversationInputToolbarSlotProps['toolbar'];
  helperText?: UnstyledConversationInputHelperTextSlotProps['helperText'];
}

export interface ChatConversationInputProps extends Omit<
  UnstyledConversationInputRootProps,
  'children' | 'slotProps' | 'slots'
> {
  children?: React.ReactNode;
  className?: string;
  helperText?: React.ReactNode;
  slotProps?: ChatConversationInputSlotProps;
  slots?: Partial<ChatConversationInputSlots>;
  sx?: SxProps<Theme>;
  toolbar?: React.ReactNode;
}

export const ChatConversationInput = React.forwardRef(function ChatConversationInput(
  inProps: ChatConversationInputProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatConversationInput',
  });
  const { children, className, helperText, slotProps, slots, sx, toolbar, ...other } = props;
  const Root = React.useMemo(() => slots?.root ?? createDefaultRootSlot(sx), [slots?.root, sx]);

  return (
    <ConversationInputRoot
      ref={ref}
      slotProps={{
        root: mergeSlotPropsWithClassName(
          slotProps?.root,
          joinClassNames(chatConversationInputClasses.root, className),
        ),
      }}
      slots={{ root: Root }}
      {...other}
    >
      {children ?? (
        <React.Fragment>
          <ChatConversationInputMainRow>
            <ChatConversationInputAttachButton
              slotProps={{
                attachButton: slotProps?.attachButton,
                attachInput: slotProps?.attachInput,
              }}
              slots={{
                attachButton: slots?.attachButton,
                attachInput: slots?.attachInput,
              }}
            />
            <ChatConversationInputTextArea
              slotProps={{ input: slotProps?.input }}
              slots={{ input: slots?.input }}
            />
            <ChatConversationInputSendButton
              slotProps={{ sendButton: slotProps?.sendButton }}
              slots={{ sendButton: slots?.sendButton }}
            />
          </ChatConversationInputMainRow>
          {toolbar != null ? (
            <ChatConversationInputToolbar
              slotProps={{ toolbar: slotProps?.toolbar }}
              slots={{ toolbar: slots?.toolbar }}
            >
              {toolbar}
            </ChatConversationInputToolbar>
          ) : null}
          <ChatConversationInputHelperText
            slotProps={{ helperText: slotProps?.helperText }}
            slots={{ helperText: slots?.helperText }}
          >
            {helperText}
          </ChatConversationInputHelperText>
        </React.Fragment>
      )}
    </ConversationInputRoot>
  );
});
