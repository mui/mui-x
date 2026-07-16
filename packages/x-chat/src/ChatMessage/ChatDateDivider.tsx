'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { MessageListDateDivider } from '@mui/x-chat-headless';
import type { MessageListDateDividerProps } from '@mui/x-chat-headless';
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
    // Drop a JS/theme-injected `classes` (not a prop on this sub-part — it shares
    // the `MuiChatMessage-*` namespace) so it can't leak onto the DOM via `...other`.
    const {
      slots,
      slotProps,
      className,
      sx,
      classes: classesProp,
      ...other
    } = props as ChatDateDividerProps & { classes?: unknown };
    void classesProp;
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
          line: mergeSlotProps({ className: classes.dateDividerLine }, slotProps?.line) as any,
          label: mergeSlotProps({ className: classes.dateDividerLabel }, slotProps?.label) as any,
        }}
      />
    );
  },
);

ChatDateDivider.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  className: PropTypes.string,
  formatDate: PropTypes.func,
  index: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.string),
  messageId: PropTypes.string.isRequired,
  /**
   * Decides whether the divider renders above the message, replacing the
   * built-in rule when provided. `date`/`previousDate` are the parsed
   * `createdAt` values (`null` when missing or invalid); `previousMessage`
   * is `null` for the first message in the list.
   * @param {object} params The parameters used to decide whether to render the divider.
   * @param {ChatMessage} params.message The message the divider would render above.
   * @param {ChatMessage | null} params.previousMessage The previous message, or `null` for the first message in the list.
   * @param {number} params.index The index of the message in the list.
   * @param {Date | null} params.date The parsed `createdAt` of the message, or `null` when missing or invalid.
   * @param {Date | null} params.previousDate The parsed `createdAt` of the previous message, or `null` when missing or invalid.
   * @returns {boolean} `true` to render the divider above the message.
   * @default Renders when `message.createdAt` falls on a different UTC
   * calendar day than the previous message's.
   */
  shouldShowDivider: PropTypes.func,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatDateDivider };
