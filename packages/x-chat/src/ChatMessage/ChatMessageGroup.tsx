'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatMessage');
import { SxProps, Theme } from '@mui/system';
import { MessageGroup, type MessageGroupProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

export interface ChatMessageGroupProps extends MessageGroupProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageGroupStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Group',
  overridesResolver: (_, styles) => styles.group,
})(({ theme }) => ({
  '--MuiChatMessage-avatarSize': '36px',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
}));

const ChatMessageGroupAuthorNameStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'GroupAuthorName',
})<{ ownerState?: { authorRole?: string } }>(({ theme, ownerState }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.secondary,
  marginBottom: 0,
  ...(ownerState?.authorRole === 'user'
    ? {
        textAlign: 'right' as const,
        paddingInlineEnd: `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
      }
    : {
        paddingInlineStart: `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
      }),
}));

const ChatMessageGroup = React.forwardRef<HTMLDivElement, ChatMessageGroupProps>(
  function ChatMessageGroup(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageGroup
        ref={ref}
        {...other}
        slots={{
          group: slots?.group ?? ChatMessageGroupStyled,
          authorName: slots?.authorName ?? ChatMessageGroupAuthorNameStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          group: {
            className: clsx(classes.group, className),
            sx,
            ...(slotProps?.group as object),
          } as any,
        }}
      />
    );
  },
);

ChatMessageGroup.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  groupingWindowMs: PropTypes.number,
  index: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.string),
  messageId: PropTypes.string.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatMessageGroup };
