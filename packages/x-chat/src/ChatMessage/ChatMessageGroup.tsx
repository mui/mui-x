'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { MessageGroup, type MessageGroupProps } from '@mui/x-chat-unstyled';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

const useThemeProps = createUseThemeProps('MuiChatMessage');

export interface ChatMessageGroupProps extends MessageGroupProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageGroupStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Group',
  overridesResolver: (_, styles) => styles.group,
})<{ ownerState?: { variant?: string } }>(({ ownerState }) => ({
  '--MuiChatMessage-avatarSize': ownerState?.variant === 'compact' ? '28px' : '36px',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
}));

const ChatMessageGroupAuthorNameStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'GroupAuthorName',
})<{ ownerState?: { authorRole?: string; variant?: string } }>(({ theme, ownerState }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.secondary,
  marginBottom: 0,
  ...(ownerState?.variant === 'compact'
    ? {
        // Compact: author name lives inside the message grid in the "authorName" area.
        // It shares a row with the avatar. Flex to push timestamp to the right.
        gridArea: 'authorName',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing(1),
        color: (theme.vars || theme).palette.primary.main,
      }
    : {
        // Default: offset by avatar width, user right-aligned
        ...(ownerState?.authorRole === 'user'
          ? {
              textAlign: 'right' as const,
              paddingInlineEnd: `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
            }
          : {
              paddingInlineStart: `calc(var(--MuiChatMessage-avatarSize) + ${theme.spacing(2)} + ${theme.spacing(0.5)})`,
            }),
      }),
}));

const ChatMessageGroupTimestampStyled = styled('span', {
  name: 'MuiChatMessage',
  slot: 'GroupTimestamp',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightRegular,
  color: (theme.vars || theme).palette.text.disabled,
  whiteSpace: 'nowrap',
  flexShrink: 0,
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
          groupTimestamp: slots?.groupTimestamp ?? ChatMessageGroupTimestampStyled,
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
