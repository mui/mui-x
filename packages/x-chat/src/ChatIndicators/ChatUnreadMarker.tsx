'use client';
import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  UnreadMarker as UnstyledUnreadMarker,
  type UnreadMarkerOwnerState,
  type UnreadMarkerProps as UnstyledUnreadMarkerProps,
  type UnreadMarkerSlotProps as UnstyledUnreadMarkerSlotProps,
  type UnreadMarkerSlots as UnstyledUnreadMarkerSlots,
} from '@mui/x-chat-unstyled/indicators';
import { styled, useChatThemeProps } from '../internals/material/chatStyled';
import {
  chatUnreadMarkerClasses,
  getChatUnreadMarkerUtilityClass,
} from './chatUnreadMarkerClasses';
import { joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { createSxRootSlot } from './utils';

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

export interface ChatUnreadMarkerSlots {
  root: UnstyledUnreadMarkerSlots['root'];
  label: UnstyledUnreadMarkerSlots['label'];
}

export interface ChatUnreadMarkerSlotProps {
  root?: UnstyledUnreadMarkerSlotProps['root'];
  label?: UnstyledUnreadMarkerSlotProps['label'];
}

export interface ChatUnreadMarkerProps extends Omit<
  UnstyledUnreadMarkerProps,
  'slotProps' | 'slots'
> {
  className?: string;
  slotProps?: ChatUnreadMarkerSlotProps;
  slots?: Partial<ChatUnreadMarkerSlots>;
  sx?: SxProps<Theme>;
}

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
    () =>
      slots?.root ?? createSxRootSlot(ChatUnreadMarkerRootSlot, chatUnreadMarkerClasses.root, sx),
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

export { chatUnreadMarkerClasses, getChatUnreadMarkerUtilityClass };
