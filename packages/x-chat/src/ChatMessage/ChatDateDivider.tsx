'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MessageListDateDivider, type MessageListDateDividerProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';

const useThemeProps = createUseThemeProps('MuiChatMessage');

export interface ChatDateDividerProps extends MessageListDateDividerProps {
  className?: string;
  classes?: Partial<ChatMessageClasses>;
}

const ChatDateDividerStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'DateDivider',
  overridesResolver: (_, styles) => styles.dateDivider,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  userSelect: 'none',
}));

const ChatDateDividerLineStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'DateDividerLine',
})(({ theme }) => ({
  flex: 1,
  height: 1,
  backgroundColor: (theme.vars || theme).palette.divider,
}));

const ChatDateDividerLabelStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'DateDividerLabel',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  whiteSpace: 'nowrap',
}));

const ChatDateDivider = React.forwardRef<HTMLDivElement, ChatDateDividerProps>(
  function ChatDateDivider(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageListDateDivider
        ref={ref}
        {...other}
        slots={{
          divider: slots?.divider ?? ChatDateDividerStyled,
          line: slots?.line ?? ChatDateDividerLineStyled,
          label: slots?.label ?? ChatDateDividerLabelStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          divider: {
            className: clsx(classes.dateDivider, className),
            ...(slotProps?.divider as object),
          } as any,
        }}
      />
    );
  },
);

ChatDateDivider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  formatDate: PropTypes.func,
  index: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.string),
  messageId: PropTypes.string.isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatDateDivider };
