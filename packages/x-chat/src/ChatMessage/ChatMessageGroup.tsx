'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  MessageGroup as UnstyledMessageGroup,
  type MessageGroupProps as UnstyledMessageGroupProps,
  type MessageGroupSlotProps as UnstyledMessageGroupSlotProps,
  type MessageGroupSlots as UnstyledMessageGroupSlots,
} from '@mui/x-chat-unstyled';
import type { MessageGroupOwnerState } from '@mui/x-chat-unstyled/message-group';
import { styled } from '../internals/material/chatStyled';
import { createDefaultSlot, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';
import { ChatMessageAvatar } from './ChatMessageAvatar';
import { ChatMessageContent } from './ChatMessageContent';
import { ChatMessageMeta } from './ChatMessageMeta';

const ChatMessageGroupSlot = styled('div')<{ ownerState: MessageGroupOwnerState }>(({
  theme,
  ownerState,
}) => {
  const connectedRadius = Math.max((Number(theme.shape.borderRadius) || 0) - 2, 4);
  const isUser = ownerState.authorRole === 'user';
  const isSystem = ownerState.authorRole === 'system';

  let firstRadiusOverride = {};
  if (!ownerState.isFirst && !isSystem) {
    firstRadiusOverride = isUser
      ? { borderStartEndRadius: connectedRadius }
      : { borderStartStartRadius: connectedRadius };
  }

  let lastRadiusOverride = {};
  if (!ownerState.isLast && !isSystem) {
    lastRadiusOverride = isUser
      ? { borderEndEndRadius: connectedRadius }
      : { borderEndStartRadius: connectedRadius };
  }

  return {
    marginBlockStart: ownerState.isFirst ? theme.spacing(2) : theme.spacing(0.5),
    width: '100%',
    ...(isSystem
      ? {}
      : {
          [`& .${chatMessageClasses.bubble}`]: {
            ...firstRadiusOverride,
            ...lastRadiusOverride,
          },
        }),
  };
});

const ChatMessageAuthorNameSlot = styled('div')<{ ownerState: MessageGroupOwnerState }>(
  ({ theme, ownerState }) => ({
    ...theme.typography.caption,
    color: theme.palette.text.secondary,
    marginBlockEnd: theme.spacing(0.5),
    textAlign: ownerState.authorRole === 'user' ? 'end' : 'start',
  }),
);

export type ChatMessageGroupSlots = UnstyledMessageGroupSlots;
export type ChatMessageGroupSlotProps = UnstyledMessageGroupSlotProps;
export interface ChatMessageGroupProps extends Omit<
  UnstyledMessageGroupProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageGroupSlotProps;
  slots?: Partial<ChatMessageGroupSlots>;
  sx?: SxProps<Theme>;
}

export const ChatMessageGroup = React.forwardRef(function ChatMessageGroup(
  props: ChatMessageGroupProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, className, slotProps, slots, sx, ...other } = props;
  const Group = React.useMemo(
    () => slots?.group ?? createDefaultSlot(ChatMessageGroupSlot, sx),
    [slots?.group, sx],
  );
  const AuthorName = slots?.authorName ?? ChatMessageAuthorNameSlot;

  return (
    <UnstyledMessageGroup
      ref={ref}
      slotProps={{
        authorName: slotProps?.authorName,
        group: mergeSlotPropsWithClassName(slotProps?.group, className),
      }}
      slots={{
        authorName: AuthorName,
        group: Group,
      }}
      {...other}
    >
      {children ?? (
        <React.Fragment>
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
        </React.Fragment>
      )}
    </UnstyledMessageGroup>
  );
});
