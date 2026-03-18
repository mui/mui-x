'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  ScrollToBottomAffordance as UnstyledScrollToBottomAffordance,
  type ScrollToBottomAffordanceOwnerState,
  type ScrollToBottomAffordanceProps as UnstyledScrollToBottomAffordanceProps,
  type ScrollToBottomAffordanceSlotProps as UnstyledScrollToBottomAffordanceSlotProps,
  type ScrollToBottomAffordanceSlots as UnstyledScrollToBottomAffordanceSlots,
} from '@mui/x-chat-unstyled/indicators';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { chatCssVarKeys, getChatCssVars } from '../internals/material/chatThemeVars';
import {
  chatScrollToBottomAffordanceClasses,
  getChatScrollToBottomAffordanceUtilityClass,
} from './chatScrollToBottomAffordanceClasses';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { createSxRootSlot } from './utils';

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

export interface ChatScrollToBottomAffordanceSlots {
  root: UnstyledScrollToBottomAffordanceSlots['root'];
  badge: UnstyledScrollToBottomAffordanceSlots['badge'];
}

export interface ChatScrollToBottomAffordanceSlotProps {
  root?: UnstyledScrollToBottomAffordanceSlotProps['root'];
  badge?: UnstyledScrollToBottomAffordanceSlotProps['badge'];
}

export interface ChatScrollToBottomAffordanceProps extends Omit<
  UnstyledScrollToBottomAffordanceProps,
  'scrollBehavior' | 'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatScrollToBottomAffordanceSlotProps;
  slots?: Partial<ChatScrollToBottomAffordanceSlots>;
  sx?: SxProps<Theme>;
}

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

export { chatScrollToBottomAffordanceClasses, getChatScrollToBottomAffordanceUtilityClass };
