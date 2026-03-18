'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  MessageAvatar as UnstyledMessageAvatar,
  type MessageAvatarProps as UnstyledMessageAvatarProps,
  type MessageAvatarSlotProps as UnstyledMessageAvatarSlotProps,
  type MessageAvatarSlots as UnstyledMessageAvatarSlots,
} from '@mui/x-chat-unstyled';
import type { MessageAvatarOwnerState } from '@mui/x-chat-unstyled/message';
import { styled } from '../internals/material/chatStyled';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';

function getAvatarLabel(ownerState: MessageAvatarOwnerState) {
  const author = ownerState.message?.author;

  return author?.displayName ?? author?.id ?? ownerState.role ?? ownerState.messageId;
}

function getAvatarFallback(ownerState: MessageAvatarOwnerState) {
  const source = getAvatarLabel(ownerState).trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return ownerState.messageId.slice(0, 2).toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

const ChatMessageAvatarSlot = styled(Avatar, {
  name: 'MuiChatMessage',
  slot: 'Avatar',
})<{ ownerState: MessageAvatarOwnerState }>(({ theme }) => ({
  fontSize: theme.typography.pxToRem(13),
  height: 32,
  width: 32,
}));

function DefaultAvatarSlot(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: MessageAvatarOwnerState;
  },
) {
  const { children: childrenProp, ownerState, ...other } = props;

  void childrenProp;

  return (
    <ChatMessageAvatarSlot
      alt={ownerState ? getAvatarLabel(ownerState) : ''}
      ownerState={ownerState as MessageAvatarOwnerState}
      src={ownerState?.message?.author?.avatarUrl}
      {...other}
    >
      {ownerState ? getAvatarFallback(ownerState) : null}
    </ChatMessageAvatarSlot>
  );
}

export type ChatMessageAvatarSlots = UnstyledMessageAvatarSlots;
export type ChatMessageAvatarSlotProps = UnstyledMessageAvatarSlotProps;
export interface ChatMessageAvatarProps extends Omit<
  UnstyledMessageAvatarProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageAvatarSlotProps;
  slots?: Partial<ChatMessageAvatarSlots>;
  sx?: SxProps<Theme>;
}

export const ChatMessageAvatar = React.forwardRef(function ChatMessageAvatar(
  props: ChatMessageAvatarProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const AvatarSlot = React.useMemo(
    () => slots?.avatar ?? createDefaultSlot(DefaultAvatarSlot, sx),
    [slots?.avatar, sx],
  );

  return (
    <UnstyledMessageAvatar
      ref={ref}
      slotProps={{
        avatar: mergeSlotPropsWithClassName(
          slotProps?.avatar,
          className
            ? joinClassNames(chatMessageClasses.avatar, className)
            : chatMessageClasses.avatar,
        ),
      }}
      slots={{ avatar: AvatarSlot }}
      {...other}
    />
  );
});
