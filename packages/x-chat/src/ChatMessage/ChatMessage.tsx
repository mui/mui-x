'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/system';
import { MessageRoot, type MessageRootProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

export interface ChatMessageProps extends MessageRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState?: { role?: string; isGrouped?: boolean; showAvatar?: boolean } }>(
  ({ theme, ownerState }) => ({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gridTemplateAreas: '"avatar content actions" ". meta ."',
    gap: theme.spacing(0.5),
    width: '100%',
    boxSizing: 'border-box',
    paddingInline: theme.spacing(2),
    // Phantom column: reserve the same width as the avatar on the opposite side so
    // assistant and user bubbles always share the same horizontal content lane.
    paddingInlineEnd: `calc(${theme.spacing(2)} + var(--MuiChatMessage-avatarSize))`,
    paddingBlock: ownerState?.isGrouped ? theme.spacing(0.25) : theme.spacing(0.75),
    fontFamily: theme.typography.fontFamily,
    // Collapse the phantom column when this row has no avatar (e.g. no avatarUrl set).
    ...(!ownerState?.showAvatar && {
      '--MuiChatMessage-avatarSize': '0px',
    }),
    ...(ownerState?.role === 'user' && {
      gridTemplateAreas: '"actions content avatar" ". meta ."',
      gridTemplateColumns: 'auto 1fr auto',
      paddingInlineStart: `calc(${theme.spacing(2)} + var(--MuiChatMessage-avatarSize))`,
      paddingInlineEnd: theme.spacing(2),
    }),
  }),
);

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageRoot
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatMessageStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            sx,
            ...(slotProps?.root as object),
          } as any,
        }}
      />
    );
  },
);
