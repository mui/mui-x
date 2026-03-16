'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import type { SlotComponentProps } from '@mui/utils/types';
import {
  ComposerAttachButton as UnstyledComposerAttachButton,
  ComposerHelperText as UnstyledComposerHelperText,
  ComposerInput as UnstyledComposerInput,
  ComposerRoot,
  ComposerSendButton as UnstyledComposerSendButton,
  ComposerToolbar as UnstyledComposerToolbar,
  type ComposerAttachButtonOwnerState,
  type ComposerAttachButtonProps as UnstyledComposerAttachButtonProps,
  type ComposerAttachButtonSlotProps as UnstyledComposerAttachButtonSlotProps,
  type ComposerAttachButtonSlots as UnstyledComposerAttachButtonSlots,
  type ComposerHelperTextOwnerState,
  type ComposerHelperTextProps as UnstyledComposerHelperTextProps,
  type ComposerHelperTextSlotProps as UnstyledComposerHelperTextSlotProps,
  type ComposerHelperTextSlots as UnstyledComposerHelperTextSlots,
  type ComposerInputOwnerState,
  type ComposerInputProps as UnstyledComposerInputProps,
  type ComposerInputSlotProps as UnstyledComposerInputSlotProps,
  type ComposerInputSlots as UnstyledComposerInputSlots,
  type ComposerRootOwnerState,
  type ComposerRootProps as UnstyledComposerRootProps,
  type ComposerRootSlotProps as UnstyledComposerRootSlotProps,
  type ComposerRootSlots as UnstyledComposerRootSlots,
  type ComposerSendButtonOwnerState,
  type ComposerSendButtonProps as UnstyledComposerSendButtonProps,
  type ComposerSendButtonSlotProps as UnstyledComposerSendButtonSlotProps,
  type ComposerSendButtonSlots as UnstyledComposerSendButtonSlots,
  type ComposerToolbarOwnerState,
  type ComposerToolbarProps as UnstyledComposerToolbarProps,
  type ComposerToolbarSlotProps as UnstyledComposerToolbarSlotProps,
  type ComposerToolbarSlots as UnstyledComposerToolbarSlots,
} from '@mui/x-chat-unstyled/composer';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import { chatComposerClasses, getChatComposerUtilityClass } from './chatComposerClasses';

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function mergeSlotPropsWithClassName<TOwnerState>(
  slotProps: SlotComponentProps<any, {}, TOwnerState> | undefined,
  className: string,
) {
  return (ownerState: TOwnerState) => {
    const resolved = resolveComponentProps(slotProps, ownerState) ?? {};

    return {
      ...resolved,
      className: joinClassNames(className, (resolved as { className?: string }).className),
    };
  };
}

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

export interface ChatComposerInputSlots {
  input: UnstyledComposerInputSlots['input'];
}

export interface ChatComposerInputSlotProps {
  input?: UnstyledComposerInputSlotProps['input'];
}

export interface ChatComposerInputProps
  extends Omit<UnstyledComposerInputProps, 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatComposerInputSlotProps;
  slots?: Partial<ChatComposerInputSlots>;
  sx?: SxProps<Theme>;
}

export interface ChatComposerSendButtonSlots {
  sendButton: UnstyledComposerSendButtonSlots['sendButton'];
}

export interface ChatComposerSendButtonSlotProps {
  sendButton?: UnstyledComposerSendButtonSlotProps['sendButton'];
}

export interface ChatComposerSendButtonProps
  extends Omit<UnstyledComposerSendButtonProps, 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatComposerSendButtonSlotProps;
  slots?: Partial<ChatComposerSendButtonSlots>;
  sx?: SxProps<Theme>;
}

export interface ChatComposerAttachButtonSlots {
  attachButton: UnstyledComposerAttachButtonSlots['attachButton'];
  attachInput: UnstyledComposerAttachButtonSlots['attachInput'];
}

export interface ChatComposerAttachButtonSlotProps {
  attachButton?: UnstyledComposerAttachButtonSlotProps['attachButton'];
  attachInput?: UnstyledComposerAttachButtonSlotProps['attachInput'];
}

export interface ChatComposerAttachButtonProps
  extends Omit<UnstyledComposerAttachButtonProps, 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatComposerAttachButtonSlotProps;
  slots?: Partial<ChatComposerAttachButtonSlots>;
  sx?: SxProps<Theme>;
}

export interface ChatComposerToolbarSlots {
  toolbar: UnstyledComposerToolbarSlots['toolbar'];
}

export interface ChatComposerToolbarSlotProps {
  toolbar?: UnstyledComposerToolbarSlotProps['toolbar'];
}

export interface ChatComposerToolbarProps
  extends Omit<UnstyledComposerToolbarProps, 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatComposerToolbarSlotProps;
  slots?: Partial<ChatComposerToolbarSlots>;
  sx?: SxProps<Theme>;
}

export interface ChatComposerHelperTextSlots {
  helperText: UnstyledComposerHelperTextSlots['helperText'];
}

export interface ChatComposerHelperTextSlotProps {
  helperText?: UnstyledComposerHelperTextSlotProps['helperText'];
}

export interface ChatComposerHelperTextProps
  extends Omit<UnstyledComposerHelperTextProps, 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatComposerHelperTextSlotProps;
  slots?: Partial<ChatComposerHelperTextSlots>;
  sx?: SxProps<Theme>;
}

export interface ChatComposerSlots {
  root: UnstyledComposerRootSlots['root'];
  input: UnstyledComposerInputSlots['input'];
  sendButton: UnstyledComposerSendButtonSlots['sendButton'];
  attachButton: UnstyledComposerAttachButtonSlots['attachButton'];
  attachInput: UnstyledComposerAttachButtonSlots['attachInput'];
  toolbar: UnstyledComposerToolbarSlots['toolbar'];
  helperText: UnstyledComposerHelperTextSlots['helperText'];
}

export interface ChatComposerSlotProps {
  root?: UnstyledComposerRootSlotProps['root'];
  input?: UnstyledComposerInputSlotProps['input'];
  sendButton?: UnstyledComposerSendButtonSlotProps['sendButton'];
  attachButton?: UnstyledComposerAttachButtonSlotProps['attachButton'];
  attachInput?: UnstyledComposerAttachButtonSlotProps['attachInput'];
  toolbar?: UnstyledComposerToolbarSlotProps['toolbar'];
  helperText?: UnstyledComposerHelperTextSlotProps['helperText'];
}

export interface ChatComposerProps
  extends Omit<UnstyledComposerRootProps, 'children' | 'slotProps' | 'slots'> {
  children?: React.ReactNode;
  className?: string;
  helperText?: React.ReactNode;
  slotProps?: ChatComposerSlotProps;
  slots?: Partial<ChatComposerSlots>;
  sx?: SxProps<Theme>;
  toolbar?: React.ReactNode;
}

const ChatComposerRootSlot = styled('form', {
  name: 'MuiChatComposer',
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

const ChatComposerMainRow = styled('div')(({ theme }) => ({
  alignItems: 'flex-end',
  columnGap: theme.spacing(1),
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  minWidth: 0,
}));

const ChatComposerInputSlot = styled('textarea', {
  name: 'MuiChatComposer',
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

const ChatComposerAttachButtonSlot = styled(IconButton, {
  name: 'MuiChatComposer',
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

const ChatComposerSendButtonSlot = styled(IconButton, {
  name: 'MuiChatComposer',
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

const ChatComposerToolbarSlot = styled('div', {
  name: 'MuiChatComposer',
  slot: 'Toolbar',
})(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

const ChatComposerHelperTextSlot = styled('div', {
  name: 'MuiChatComposer',
  slot: 'HelperText',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  minHeight: theme.spacing(2),
  minWidth: 0,
}));

function createDefaultRootSlot(sx: ChatComposerProps['sx']) {
  return React.forwardRef(function DefaultRoot(
    props: React.ComponentPropsWithoutRef<'form'> & {
      ownerState?: ComposerRootOwnerState;
    },
    ref: React.Ref<HTMLFormElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatComposerRootSlot
        className={joinClassNames(chatComposerClasses.root, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

function createDefaultInputSlot(sx: ChatComposerInputProps['sx']) {
  return React.forwardRef(function DefaultInput(
    props: React.ComponentPropsWithoutRef<'textarea'> & {
      ownerState?: ComposerInputOwnerState;
    },
    ref: React.Ref<HTMLTextAreaElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatComposerInputSlot
        className={joinClassNames(chatComposerClasses.input, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

function createDefaultSendButtonSlot(sx: ChatComposerSendButtonProps['sx']) {
  return React.forwardRef(function DefaultSendButton(
    props: React.ComponentProps<typeof IconButton> & {
      ownerState?: ComposerSendButtonOwnerState;
    },
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const { children, className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatComposerSendButtonSlot
        className={joinClassNames(chatComposerClasses.sendButton, className)}
        ref={ref}
        sx={sx}
        {...other}
      >
        {children ?? <DefaultSendIcon />}
      </ChatComposerSendButtonSlot>
    );
  });
}

function createDefaultAttachButtonSlot(sx: ChatComposerAttachButtonProps['sx']) {
  return React.forwardRef(function DefaultAttachButton(
    props: React.ComponentProps<typeof IconButton> & {
      ownerState?: ComposerAttachButtonOwnerState;
    },
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const { children, className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatComposerAttachButtonSlot
        className={joinClassNames(chatComposerClasses.attachButton, className)}
        ref={ref}
        sx={sx}
        {...other}
      >
        {children ?? <DefaultAttachIcon />}
      </ChatComposerAttachButtonSlot>
    );
  });
}

function createDefaultToolbarSlot(sx: ChatComposerToolbarProps['sx']) {
  return React.forwardRef(function DefaultToolbar(
    props: React.ComponentPropsWithoutRef<'div'> & {
      ownerState?: ComposerToolbarOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatComposerToolbarSlot
        className={joinClassNames(chatComposerClasses.toolbar, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

function createDefaultHelperTextSlot(sx: ChatComposerHelperTextProps['sx']) {
  return React.forwardRef(function DefaultHelperText(
    props: React.ComponentPropsWithoutRef<'div'> & {
      ownerState?: ComposerHelperTextOwnerState;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, ownerState: ownerStateProp, ...other } = props;

    void ownerStateProp;

    return (
      <ChatComposerHelperTextSlot
        className={joinClassNames(chatComposerClasses.helperText, className)}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export const ChatComposerInput = React.forwardRef(function ChatComposerInput(
  inProps: ChatComposerInputProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatComposer',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Input = React.useMemo(
    () => slots?.input ?? createDefaultInputSlot(sx),
    [slots?.input, sx],
  );

  return (
    <UnstyledComposerInput
      ref={ref}
      slotProps={{
        input: mergeSlotPropsWithClassName(slotProps?.input, className ?? chatComposerClasses.input),
      }}
      slots={{ input: Input }}
      {...other}
    />
  );
});

export const ChatComposerSendButton = React.forwardRef(function ChatComposerSendButton(
  inProps: ChatComposerSendButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatComposer',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const SendButton = React.useMemo(
    () => slots?.sendButton ?? createDefaultSendButtonSlot(sx),
    [slots?.sendButton, sx],
  );

  return (
    <UnstyledComposerSendButton
      ref={ref}
      slotProps={{
        sendButton: mergeSlotPropsWithClassName(
          slotProps?.sendButton,
          className ?? chatComposerClasses.sendButton,
        ),
      }}
      slots={{ sendButton: SendButton }}
      {...other}
    />
  );
});

export const ChatComposerAttachButton = React.forwardRef(function ChatComposerAttachButton(
  inProps: ChatComposerAttachButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatComposer',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const AttachButton = React.useMemo(
    () => slots?.attachButton ?? createDefaultAttachButtonSlot(sx),
    [slots?.attachButton, sx],
  );
  const AttachInput = slots?.attachInput ?? 'input';

  return (
    <UnstyledComposerAttachButton
      ref={ref}
      slotProps={{
        attachButton: mergeSlotPropsWithClassName(
          slotProps?.attachButton,
          className ?? chatComposerClasses.attachButton,
        ),
        attachInput: slotProps?.attachInput,
      }}
      slots={{ attachButton: AttachButton, attachInput: AttachInput }}
      {...other}
    />
  );
});

export const ChatComposerToolbar = React.forwardRef(function ChatComposerToolbar(
  inProps: ChatComposerToolbarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatComposer',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Toolbar = React.useMemo(
    () => slots?.toolbar ?? createDefaultToolbarSlot(sx),
    [slots?.toolbar, sx],
  );

  return (
    <UnstyledComposerToolbar
      ref={ref}
      slotProps={{
        toolbar: mergeSlotPropsWithClassName(slotProps?.toolbar, className ?? chatComposerClasses.toolbar),
      }}
      slots={{ toolbar: Toolbar }}
      {...other}
    />
  );
});

export const ChatComposerHelperText = React.forwardRef(function ChatComposerHelperText(
  inProps: ChatComposerHelperTextProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatComposer',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const HelperText = React.useMemo(
    () => slots?.helperText ?? createDefaultHelperTextSlot(sx),
    [slots?.helperText, sx],
  );

  return (
    <UnstyledComposerHelperText
      ref={ref}
      slotProps={{
        helperText: mergeSlotPropsWithClassName(
          slotProps?.helperText,
          className ?? chatComposerClasses.helperText,
        ),
      }}
      slots={{ helperText: HelperText }}
      {...other}
    />
  );
});

export const ChatComposer = React.forwardRef(function ChatComposer(
  inProps: ChatComposerProps,
  ref: React.Ref<HTMLFormElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatComposer',
  });
  const {
    children,
    className,
    helperText,
    slotProps,
    slots,
    sx,
    toolbar,
    ...other
  } = props;
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultRootSlot(sx),
    [slots?.root, sx],
  );

  return (
    <ComposerRoot
      ref={ref}
      slotProps={{
        root: mergeSlotPropsWithClassName(slotProps?.root, joinClassNames(chatComposerClasses.root, className)),
      }}
      slots={{ root: Root }}
      {...other}
    >
      {children ?? (
        <React.Fragment>
          <ChatComposerMainRow>
            <ChatComposerAttachButton
              slotProps={{
                attachButton: slotProps?.attachButton,
                attachInput: slotProps?.attachInput,
              }}
              slots={{
                attachButton: slots?.attachButton,
                attachInput: slots?.attachInput,
              }}
            />
            <ChatComposerInput
              slotProps={{ input: slotProps?.input }}
              slots={{ input: slots?.input }}
            />
            <ChatComposerSendButton
              slotProps={{ sendButton: slotProps?.sendButton }}
              slots={{ sendButton: slots?.sendButton }}
            />
          </ChatComposerMainRow>
          {toolbar != null ? (
            <ChatComposerToolbar
              slotProps={{ toolbar: slotProps?.toolbar }}
              slots={{ toolbar: slots?.toolbar }}
            >
              {toolbar}
            </ChatComposerToolbar>
          ) : null}
          <ChatComposerHelperText
            slotProps={{ helperText: slotProps?.helperText }}
            slots={{ helperText: slots?.helperText }}
          >
            {helperText}
          </ChatComposerHelperText>
        </React.Fragment>
      )}
    </ComposerRoot>
  );
});
