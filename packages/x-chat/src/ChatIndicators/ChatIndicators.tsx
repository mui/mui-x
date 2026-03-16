'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import type { SlotComponentProps } from '@mui/utils/types';
import {
  ScrollToBottomAffordance as UnstyledScrollToBottomAffordance,
  TypingIndicator as UnstyledTypingIndicator,
  UnreadMarker as UnstyledUnreadMarker,
  type ScrollToBottomAffordanceOwnerState,
  type ScrollToBottomAffordanceProps as UnstyledScrollToBottomAffordanceProps,
  type ScrollToBottomAffordanceSlotProps as UnstyledScrollToBottomAffordanceSlotProps,
  type ScrollToBottomAffordanceSlots as UnstyledScrollToBottomAffordanceSlots,
  type TypingIndicatorOwnerState,
  type TypingIndicatorProps as UnstyledTypingIndicatorProps,
  type TypingIndicatorSlotProps as UnstyledTypingIndicatorSlotProps,
  type TypingIndicatorSlots as UnstyledTypingIndicatorSlots,
  type UnreadMarkerOwnerState,
  type UnreadMarkerProps as UnstyledUnreadMarkerProps,
  type UnreadMarkerSlotProps as UnstyledUnreadMarkerSlotProps,
  type UnreadMarkerSlots as UnstyledUnreadMarkerSlots,
} from '@mui/x-chat-unstyled/indicators';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import {
  chatScrollToBottomAffordanceClasses,
  getChatScrollToBottomAffordanceUtilityClass,
} from './chatScrollToBottomAffordanceClasses';
import {
  chatTypingIndicatorClasses,
  getChatTypingIndicatorUtilityClass,
} from './chatTypingIndicatorClasses';
import {
  chatUnreadMarkerClasses,
  getChatUnreadMarkerUtilityClass,
} from './chatUnreadMarkerClasses';

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

const ChatTypingIndicatorRootSlot = styled('div', {
  name: 'MuiChatTypingIndicator',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: TypingIndicatorOwnerState }>(({ theme }) => ({
  ...getChatCssVars(theme),
  alignItems: 'center',
  animation: 'MuiChatTypingIndicator-fade-in 160ms ease-out',
  color: theme.palette.text.secondary,
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  marginInline: theme.spacing(2),
  marginTop: theme.spacing(1),
  maxWidth: 'fit-content',
  minWidth: 0,
  paddingBlock: theme.spacing(0.5),
  ...theme.typography.caption,
  '&::after': {
    animation: 'MuiChatTypingIndicator-dots 1.2s steps(4, end) infinite',
    content: '"..."',
    display: 'inline-block',
    inlineSize: '1.5em',
    overflow: 'hidden',
    verticalAlign: 'bottom',
    whiteSpace: 'nowrap',
  },
  '@keyframes MuiChatTypingIndicator-fade-in': {
    from: {
      opacity: 0,
      transform: 'translateY(4px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes MuiChatTypingIndicator-dots': {
    from: {
      inlineSize: '0',
    },
    to: {
      inlineSize: '1.5em',
    },
  },
}));

const ChatUnreadMarkerRootSlot = styled('div', {
  name: 'MuiChatUnreadMarker',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: UnreadMarkerOwnerState }>(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.secondary.main,
  columnGap: theme.spacing(1.5),
  display: 'flex',
  minWidth: 0,
  paddingBlock: theme.spacing(0.5),
  width: '100%',
  '&::before, &::after': {
    borderTop: `1px solid ${theme.palette.divider}`,
    content: '""',
    flex: '1 1 auto',
    minWidth: 0,
  },
}));

const ChatUnreadMarkerLabelSlot = styled('span', {
  name: 'MuiChatUnreadMarker',
  slot: 'Label',
})<{ ownerState: UnreadMarkerOwnerState }>(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: theme.typography.fontWeightMedium,
  whiteSpace: 'nowrap',
}));

const ChatScrollToBottomAffordanceRootSlot = styled('button', {
  name: 'MuiChatScrollToBottomAffordance',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: ScrollToBottomAffordanceOwnerState }>(({ theme }) => ({
  ...getChatCssVars(theme),
  alignItems: 'center',
  animation: 'MuiChatScrollToBottomAffordance-fade-in 160ms ease-out',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid var(${chatCssVarKeys.composerBorder})`,
  borderRadius: (Number(theme.shape.borderRadius) || 0) * 999,
  boxShadow: theme.shadows[3],
  color: theme.palette.text.primary,
  cursor: 'pointer',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  justifyContent: 'center',
  minHeight: 40,
  minWidth: 40,
  padding: theme.spacing(1),
  position: 'relative',
  transition: theme.transitions.create(['background-color', 'box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&::before': {
    content: '"\\2193"',
    fontSize: theme.typography.pxToRem(18),
    lineHeight: 1,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[6],
  },
  '&:focus-visible': {
    outline: `2px solid var(${chatCssVarKeys.composerFocusRing})`,
    outlineOffset: 2,
  },
  '& > span:first-of-type': {
    blockSize: 1,
    inlineSize: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
  '@keyframes MuiChatScrollToBottomAffordance-fade-in': {
    from: {
      opacity: 0,
      transform: 'translateY(6px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const ChatScrollToBottomAffordanceBadgeSlot = styled('span', {
  name: 'MuiChatScrollToBottomAffordance',
  slot: 'Badge',
})<{ ownerState: ScrollToBottomAffordanceOwnerState }>(({ theme }) => ({
  ...theme.typography.caption,
  alignItems: 'center',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: (Number(theme.shape.borderRadius) || 0) * 999,
  color: theme.palette.secondary.contrastText,
  display: 'inline-flex',
  fontWeight: theme.typography.fontWeightMedium,
  justifyContent: 'center',
  minHeight: 20,
  minWidth: 20,
  paddingInline: theme.spacing(0.5),
}));

function createSxRootSlot(Component: React.ElementType, className: string, sx?: SxProps<Theme>) {
  return React.forwardRef(function RootSlot(
    props: React.HTMLAttributes<HTMLElement> & {
      ownerState?: unknown;
    },
    ref: React.Ref<any>,
  ) {
    const { ownerState, ...other } = props;

    return (
      <Component
        className={joinClassNames(className, (other as { className?: string }).className)}
        ownerState={ownerState}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}

export interface ChatTypingIndicatorSlots {
  root: UnstyledTypingIndicatorSlots['root'];
}

export interface ChatTypingIndicatorSlotProps {
  root?: UnstyledTypingIndicatorSlotProps['root'];
}

export interface ChatTypingIndicatorProps
  extends Omit<UnstyledTypingIndicatorProps, 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatTypingIndicatorSlotProps;
  slots?: Partial<ChatTypingIndicatorSlots>;
  sx?: SxProps<Theme>;
}

export interface ChatUnreadMarkerSlots {
  root: UnstyledUnreadMarkerSlots['root'];
  label: UnstyledUnreadMarkerSlots['label'];
}

export interface ChatUnreadMarkerSlotProps {
  root?: UnstyledUnreadMarkerSlotProps['root'];
  label?: UnstyledUnreadMarkerSlotProps['label'];
}

export interface ChatUnreadMarkerProps
  extends Omit<UnstyledUnreadMarkerProps, 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatUnreadMarkerSlotProps;
  slots?: Partial<ChatUnreadMarkerSlots>;
  sx?: SxProps<Theme>;
}

export interface ChatScrollToBottomAffordanceSlots {
  root: UnstyledScrollToBottomAffordanceSlots['root'];
  badge: UnstyledScrollToBottomAffordanceSlots['badge'];
}

export interface ChatScrollToBottomAffordanceSlotProps {
  root?: UnstyledScrollToBottomAffordanceSlotProps['root'];
  badge?: UnstyledScrollToBottomAffordanceSlotProps['badge'];
}

export interface ChatScrollToBottomAffordanceProps
  extends Omit<UnstyledScrollToBottomAffordanceProps, 'scrollBehavior' | 'slotProps' | 'slots'> {
  className?: string;
  slotProps?: ChatScrollToBottomAffordanceSlotProps;
  slots?: Partial<ChatScrollToBottomAffordanceSlots>;
  sx?: SxProps<Theme>;
}

export const ChatTypingIndicator = React.forwardRef(function ChatTypingIndicator(
  inProps: ChatTypingIndicatorProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatTypingIndicator',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Root = React.useMemo(
    () => slots?.root ?? createSxRootSlot(ChatTypingIndicatorRootSlot, chatTypingIndicatorClasses.root, sx),
    [slots?.root, sx],
  );

  return (
    <UnstyledTypingIndicator
      ref={ref}
      slotProps={{
        root: mergeSlotPropsWithClassName(
          slotProps?.root,
          joinClassNames(chatTypingIndicatorClasses.root, className),
        ),
      }}
      slots={{ root: Root }}
      {...other}
    />
  );
});

export const ChatUnreadMarker = React.forwardRef(function ChatUnreadMarker(
  inProps: ChatUnreadMarkerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatUnreadMarker',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Root = React.useMemo(
    () => slots?.root ?? createSxRootSlot(ChatUnreadMarkerRootSlot, chatUnreadMarkerClasses.root, sx),
    [slots?.root, sx],
  );
  const Label = slots?.label ?? ChatUnreadMarkerLabelSlot;

  return (
    <UnstyledUnreadMarker
      ref={ref}
      slotProps={{
        label: mergeSlotPropsWithClassName(slotProps?.label, chatUnreadMarkerClasses.label),
        root: mergeSlotPropsWithClassName(
          slotProps?.root,
          joinClassNames(chatUnreadMarkerClasses.root, className),
        ),
      }}
      slots={{
        label: Label,
        root: Root,
      }}
      {...other}
    />
  );
});

export const ChatScrollToBottomAffordance = React.forwardRef(function ChatScrollToBottomAffordance(
  inProps: ChatScrollToBottomAffordanceProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatScrollToBottomAffordance',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Root = React.useMemo(
    () =>
      slots?.root ??
      createSxRootSlot(
        ChatScrollToBottomAffordanceRootSlot,
        chatScrollToBottomAffordanceClasses.root,
        sx,
      ),
    [slots?.root, sx],
  );
  const Badge = slots?.badge ?? ChatScrollToBottomAffordanceBadgeSlot;

  return (
    <UnstyledScrollToBottomAffordance
      ref={ref}
      scrollBehavior="smooth"
      slotProps={{
        badge: mergeSlotPropsWithClassName(
          slotProps?.badge,
          chatScrollToBottomAffordanceClasses.badge,
        ),
        root: mergeSlotPropsWithClassName(
          slotProps?.root,
          joinClassNames(chatScrollToBottomAffordanceClasses.root, className),
        ),
      }}
      slots={{
        badge: Badge,
        root: Root,
      }}
      {...other}
    />
  );
});

export {
  chatScrollToBottomAffordanceClasses,
  chatTypingIndicatorClasses,
  chatUnreadMarkerClasses,
  getChatScrollToBottomAffordanceUtilityClass,
  getChatTypingIndicatorUtilityClass,
  getChatUnreadMarkerUtilityClass,
};
