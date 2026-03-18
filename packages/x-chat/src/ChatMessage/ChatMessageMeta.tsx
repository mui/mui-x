'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  MessageMeta as UnstyledMessageMeta,
  type MessageMetaProps as UnstyledMessageMetaProps,
  type MessageMetaSlotProps as UnstyledMessageMetaSlotProps,
  type MessageMetaSlots as UnstyledMessageMetaSlots,
} from '@mui/x-chat-unstyled';
import type { MessageMetaOwnerState } from '@mui/x-chat-unstyled/message';
import { styled } from '../internals/material/chatStyled';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';

const ChatMessageMetaSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Meta',
})<{ ownerState: MessageMetaOwnerState }>(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
}));

const ChatMessageTimestampSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'Timestamp',
})<{ ownerState: MessageMetaOwnerState }>({});

const ChatMessageStatusSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'Status',
})<{ ownerState: MessageMetaOwnerState }>(({ theme, ownerState }) => ({
  ...(ownerState.streaming && ownerState.role === 'assistant'
    ? {
        '&::before': {
          animation: 'mui-chat-pulse 1.2s ease-in-out infinite',
          backgroundColor: theme.palette.text.secondary,
          borderRadius: '50%',
          content: '""',
          display: 'inline-block',
          height: 6,
          marginInlineEnd: theme.spacing(0.5),
          verticalAlign: 'middle',
          width: 6,
        },
        '@keyframes mui-chat-pulse': {
          '0%, 100%': { opacity: 0.35 },
          '50%': { opacity: 1 },
        },
      }
    : {}),
}));

const ChatMessageEditedSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'Edited',
})<{ ownerState: MessageMetaOwnerState }>({});

export type ChatMessageMetaSlots = UnstyledMessageMetaSlots;
export type ChatMessageMetaSlotProps = UnstyledMessageMetaSlotProps;
export interface ChatMessageMetaProps extends Omit<
  UnstyledMessageMetaProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageMetaSlotProps;
  slots?: Partial<ChatMessageMetaSlots>;
  sx?: SxProps<Theme>;
}

export const ChatMessageMeta = React.forwardRef(function ChatMessageMeta(
  props: ChatMessageMetaProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const Meta = React.useMemo(
    () => slots?.meta ?? createDefaultSlot(ChatMessageMetaSlot, sx),
    [slots?.meta, sx],
  );
  const Timestamp = slots?.timestamp ?? ChatMessageTimestampSlot;
  const Status = slots?.status ?? ChatMessageStatusSlot;
  const Edited = slots?.edited ?? ChatMessageEditedSlot;

  return (
    <UnstyledMessageMeta
      ref={ref}
      slotProps={{
        edited: mergeSlotPropsWithClassName(slotProps?.edited, chatMessageClasses.edited),
        meta: mergeSlotPropsWithClassName(
          slotProps?.meta,
          className ? joinClassNames(chatMessageClasses.meta, className) : chatMessageClasses.meta,
        ),
        status: mergeSlotPropsWithClassName(slotProps?.status, chatMessageClasses.status),
        timestamp: mergeSlotPropsWithClassName(slotProps?.timestamp, chatMessageClasses.timestamp),
      }}
      slots={{
        edited: Edited,
        meta: Meta,
        status: Status,
        timestamp: Timestamp,
      }}
      {...other}
    />
  );
});
