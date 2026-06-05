'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { MessageListDateDivider, type MessageListDateDividerProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses } from './chatMessageClasses';
import { mergeSlotProps } from '../internals/mergeSlotProps';

const useThemeProps = createUseThemeProps('MuiChatDateDivider');

export interface ChatDateDividerProps extends MessageListDateDividerProps {
  className?: string;
  sx?: SxProps<Theme>;
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
    const props = useThemeProps({ props: inProps, name: 'MuiChatDateDivider' });
    const { slots, slotProps, className, sx, ...other } = props;
    const classes = useChatMessageUtilityClasses(undefined);

    return (
      <MessageListDateDivider
        ref={ref}
        {...other}
        slots={{
          ...slots,
          divider: slots?.divider ?? ChatDateDividerStyled,
          line: slots?.line ?? ChatDateDividerLineStyled,
          label: slots?.label ?? ChatDateDividerLabelStyled,
        }}
        slotProps={{
          ...slotProps,
          divider: mergeSlotProps(
            {
              className: clsx(classes.dateDivider, className),
              sx,
            },
            slotProps?.divider,
          ) as any,
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
  className: PropTypes.string,
  formatDate: PropTypes.func,
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

export { ChatDateDivider };
