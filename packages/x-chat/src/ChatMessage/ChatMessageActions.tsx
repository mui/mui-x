'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  MessageActions as UnstyledMessageActions,
  type MessageActionsProps as UnstyledMessageActionsProps,
  type MessageActionsSlotProps as UnstyledMessageActionsSlotProps,
  type MessageActionsSlots as UnstyledMessageActionsSlots,
} from '@mui/x-chat-unstyled';
import type { MessageActionsOwnerState } from '@mui/x-chat-unstyled/message';
import { styled } from '../internals/material/chatStyled';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';

const ChatMessageActionsSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Actions',
})<{ ownerState: MessageActionsOwnerState }>(({ theme }) => ({
  alignItems: 'center',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  minHeight: 28,
}));

export type ChatMessageActionsSlots = UnstyledMessageActionsSlots;
export type ChatMessageActionsSlotProps = UnstyledMessageActionsSlotProps;
export interface ChatMessageActionsProps extends Omit<
  UnstyledMessageActionsProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatMessageActionsSlotProps;
  slots?: Partial<ChatMessageActionsSlots>;
  sx?: SxProps<Theme>;
}

export const ChatMessageActions = React.forwardRef(function ChatMessageActions(
  props: ChatMessageActionsProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const Actions = React.useMemo(
    () => slots?.actions ?? createDefaultSlot(ChatMessageActionsSlot, sx),
    [slots?.actions, sx],
  );

  return (
    <UnstyledMessageActions
      ref={ref}
      slotProps={{
        actions: mergeSlotPropsWithClassName(
          slotProps?.actions,
          className
            ? joinClassNames(chatMessageClasses.actions, className)
            : chatMessageClasses.actions,
        ),
      }}
      slots={{ actions: Actions }}
      {...other}
    />
  );
});
