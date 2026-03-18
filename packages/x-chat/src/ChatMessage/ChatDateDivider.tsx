'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  MessageListDateDivider as UnstyledMessageListDateDivider,
  type MessageListDateDividerProps as UnstyledMessageListDateDividerProps,
  type MessageListDateDividerSlotProps as UnstyledMessageListDateDividerSlotProps,
  type MessageListDateDividerSlots as UnstyledMessageListDateDividerSlots,
} from '@mui/x-chat-unstyled';
import { styled } from '../internals/material/chatStyled';
import { createDefaultSlot, mergeSlotPropsWithClassName } from '../internals/utils';

const ChatDateDividerSlot = styled('div')(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  gap: theme.spacing(1),
  marginBlock: theme.spacing(2),
}));

const ChatDateDividerLineSlot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.divider,
  flex: '1 1 auto',
  height: 1,
}));

const ChatDateDividerLabelSlot = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  flex: '0 0 auto',
}));

export type ChatDateDividerSlots = UnstyledMessageListDateDividerSlots;
export type ChatDateDividerSlotProps = UnstyledMessageListDateDividerSlotProps;
export interface ChatDateDividerProps extends Omit<
  UnstyledMessageListDateDividerProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatDateDividerSlotProps;
  slots?: Partial<ChatDateDividerSlots>;
  sx?: SxProps<Theme>;
}

export const ChatDateDivider = React.forwardRef(function ChatDateDivider(
  props: ChatDateDividerProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, slotProps, slots, sx, ...other } = props;
  const Divider = React.useMemo(
    () => slots?.divider ?? createDefaultSlot(ChatDateDividerSlot, sx),
    [slots?.divider, sx],
  );
  const Line = slots?.line ?? ChatDateDividerLineSlot;
  const Label = slots?.label ?? ChatDateDividerLabelSlot;

  return (
    <UnstyledMessageListDateDivider
      ref={ref}
      slotProps={{
        divider: mergeSlotPropsWithClassName(slotProps?.divider, className),
        label: slotProps?.label,
        line: slotProps?.line,
      }}
      slots={{
        divider: Divider,
        label: Label,
        line: Line,
      }}
      {...other}
    />
  );
});
