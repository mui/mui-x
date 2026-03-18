'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ConversationInputAttachButton as UnstyledConversationInputAttachButton,
  ConversationInputHelperText as UnstyledConversationInputHelperText,
  ConversationInputTextArea as UnstyledConversationInputTextArea,
  ConversationInputRoot,
  ConversationInputSendButton as UnstyledConversationInputSendButton,
  ConversationInputToolbar as UnstyledConversationInputToolbar,
  type ConversationInputAttachButtonOwnerState,
  type ConversationInputAttachButtonProps as UnstyledConversationInputAttachButtonProps,
  type ConversationInputAttachButtonSlotProps as UnstyledConversationInputAttachButtonSlotProps,
  type ConversationInputAttachButtonSlots as UnstyledConversationInputAttachButtonSlots,
  type ConversationInputHelperTextOwnerState,
  type ConversationInputHelperTextProps as UnstyledConversationInputHelperTextProps,
  type ConversationInputHelperTextSlotProps as UnstyledConversationInputHelperTextSlotProps,
  type ConversationInputHelperTextSlots as UnstyledConversationInputHelperTextSlots,
  type ConversationInputTextAreaOwnerState,
  type ConversationInputTextAreaProps as UnstyledConversationInputTextAreaProps,
  type ConversationInputTextAreaSlotProps as UnstyledConversationInputTextAreaSlotProps,
  type ConversationInputTextAreaSlots as UnstyledConversationInputTextAreaSlots,
  type ConversationInputRootOwnerState,
  type ConversationInputRootProps as UnstyledConversationInputRootProps,
  type ConversationInputRootSlotProps as UnstyledConversationInputRootSlotProps,
  type ConversationInputRootSlots as UnstyledConversationInputRootSlots,
  type ConversationInputSendButtonOwnerState,
  type ConversationInputSendButtonProps as UnstyledConversationInputSendButtonProps,
  type ConversationInputSendButtonSlotProps as UnstyledConversationInputSendButtonSlotProps,
  type ConversationInputSendButtonSlots as UnstyledConversationInputSendButtonSlots,
  type ConversationInputToolbarOwnerState,
  type ConversationInputToolbarProps as UnstyledConversationInputToolbarProps,
  type ConversationInputToolbarSlotProps as UnstyledConversationInputToolbarSlotProps,
  type ConversationInputToolbarSlots as UnstyledConversationInputToolbarSlots,
} from '@mui/x-chat-unstyled/conversation-input';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatConversationInputClasses } from './chatConversationInputClasses';

function DefaultAttachIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M16.5 6v11.5a4.5 4.5 0 1 1-9 0V5a2.5 2.5 0 0 1 5 0v10.5a.5.5 0 0 1-1 0V5a1.5 1.5 0 1 0-3 0v12.5a3.5 3.5 0 1 0 7 0V6h1Z" />
    </svg>
  );
}

function DefaultSendIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="m3.4 20.4 17.75-7.61c.47-.2.47-.87 0-1.07L3.4 4.1a.58.58 0 0 0-.8.53l-.01 4.71c0 .4.3.75.69.82l10.2 1.84-10.2 1.82c-.4.08-.69.43-.69.83l.01 4.72c0 .42.43.71.8.53Z" />
    </svg>
  );
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

const ChatConversationInputHelperTextSlot = styled('div', {
  name: 'MuiChatConversationInput',
  slot: 'HelperText',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  minHeight: theme.spacing(2),
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
