'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  MessageRoot as UnstyledMessageRoot,
  type MessageRootProps as UnstyledMessageRootProps,
  type MessageRootSlotProps as UnstyledMessageRootSlotProps,
  type MessageRootSlots as UnstyledMessageRootSlots,
} from '@mui/x-chat-unstyled';
import type { MessageRootOwnerState } from '@mui/x-chat-unstyled/message';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import { getChatCssVars } from '../internals/material/chatThemeVars';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';

const ChatMessageRootSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: MessageRootOwnerState }>(({ theme, ownerState }) => {
  const isSystem = ownerState.role === 'system';
  const isUser = ownerState.role === 'user';
  const contentColumn = isSystem || isUser ? 1 : 2;

  let alignSelf: string;
  if (isSystem) {
    alignSelf = 'center';
  } else if (isUser) {
    alignSelf = 'end';
  } else {
    alignSelf = 'start';
  }

  let gridTemplateColumns: string;
  if (isSystem) {
    gridTemplateColumns = 'minmax(0, 1fr)';
  } else if (isUser) {
    gridTemplateColumns = 'minmax(0, 1fr) auto';
  } else {
    gridTemplateColumns = 'auto minmax(0, 1fr)';
  }

  let justifySelf: string;
  if (isSystem) {
    justifySelf = 'center';
  } else if (isUser) {
    justifySelf = 'end';
  } else {
    justifySelf = 'start';
  }

  return {
    ...getChatCssVars(theme),
    alignSelf,
    display: 'grid',
    gridTemplateColumns,
    maxWidth: isSystem ? '100%' : 'min(100%, 48rem)',
    minWidth: 0,
    rowGap: theme.spacing(0.5),
    width: '100%',
    [`& .${chatMessageClasses.avatar}`]: {
      alignSelf: 'end',
      gridColumn: isUser ? 2 : 1,
      gridRow: '1 / span 3',
    },
    [`& .${chatMessageClasses.content}`]: {
      gridColumn: contentColumn,
      gridRow: 1,
      justifySelf,
      maxWidth: '100%',
      minWidth: 0,
    },
    [`& .${chatMessageClasses.actions}`]: {
      gridColumn: contentColumn,
      gridRow: 2,
      justifySelf,
      opacity: 0,
      pointerEvents: 'none',
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shorter,
      }),
    },
    [`& .${chatMessageClasses.meta}`]: {
      gridColumn: contentColumn,
      gridRow: 3,
      justifySelf,
      maxWidth: '100%',
      minWidth: 0,
    },
    [`& .${chatMessageClasses.actions}:empty`]: {
      display: 'none',
    },
    '&:hover, &:focus-within': {
      [`& .${chatMessageClasses.actions}`]: {
        opacity: 1,
        pointerEvents: 'auto',
      },
    },
  };
});

export type ChatMessageRootSlots = UnstyledMessageRootSlots;
export type ChatMessageRootSlotProps = UnstyledMessageRootSlotProps;
export interface ChatMessageRootProps extends Omit<
  UnstyledMessageRootProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageRootSlotProps;
  slots?: Partial<ChatMessageRootSlots>;
  sx?: SxProps<Theme>;
}

export const ChatMessageRoot = React.forwardRef(function ChatMessageRoot(
  inProps: ChatMessageRootProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useChatThemeProps({
    props: inProps,
    name: 'MuiChatMessage',
  });
  const { className, slotProps, slots, sx, ...other } = props;
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultSlot(ChatMessageRootSlot, sx),
    [slots?.root, sx],
  );

  return (
    <UnstyledMessageRoot
      ref={ref}
      slotProps={{
        root: mergeSlotPropsWithClassName(
          slotProps?.root,
          className ? joinClassNames(chatMessageClasses.root, className) : chatMessageClasses.root,
        ),
      }}
      slots={{ root: Root }}
      {...other}
    />
  );
});
