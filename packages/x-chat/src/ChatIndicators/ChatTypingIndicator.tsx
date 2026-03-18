'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  TypingIndicator as UnstyledTypingIndicator,
  type TypingIndicatorOwnerState,
  type TypingIndicatorProps as UnstyledTypingIndicatorProps,
  type TypingIndicatorSlotProps as UnstyledTypingIndicatorSlotProps,
  type TypingIndicatorSlots as UnstyledTypingIndicatorSlots,
} from '@mui/x-chat-unstyled/indicators';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { getChatCssVars } from '../internals/material/chatThemeVars';
import {
  chatTypingIndicatorClasses,
  getChatTypingIndicatorUtilityClass,
} from './chatTypingIndicatorClasses';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { createSxRootSlot } from './utils';

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

export interface ChatTypingIndicatorSlots {
  root: UnstyledTypingIndicatorSlots['root'];
}

export interface ChatTypingIndicatorSlotProps {
  root?: UnstyledTypingIndicatorSlotProps['root'];
}

export interface ChatTypingIndicatorProps extends Omit<
  UnstyledTypingIndicatorProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatTypingIndicatorSlotProps;
  slots?: Partial<ChatTypingIndicatorSlots>;
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
    () =>
      slots?.root ??
      createSxRootSlot(ChatTypingIndicatorRootSlot, chatTypingIndicatorClasses.root, sx),
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

export { chatTypingIndicatorClasses, getChatTypingIndicatorUtilityClass };
