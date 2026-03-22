'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatMessage');
import { SxProps, Theme } from '@mui/system';
import { useMessage } from '@mui/x-chat-headless';
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

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, messageId, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);
    const message = useMessage(messageId);

    const stateClasses = clsx(
      message?.role === 'user' && classes.roleUser,
      message?.role === 'assistant' && classes.roleAssistant,
      message?.status === 'streaming' && classes.streaming,
      message?.status === 'error' && classes.error,
    );

    return (
      <MessageRoot
        ref={ref}
        messageId={messageId}
        {...other}
        slots={{
          root: slots?.root ?? ChatMessageStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, stateClasses, className),
            sx,
            ...slotProps?.root,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }}
      />
    );
  },
);

ChatMessage.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  isGrouped: PropTypes.bool,
  messageId: PropTypes.string.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessage };
