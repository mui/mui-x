'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { TypingIndicator, type TypingIndicatorProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import {
  useChatTypingIndicatorUtilityClasses,
  type ChatTypingIndicatorClasses,
} from './chatTypingIndicatorClasses';

const useThemeProps = createUseThemeProps('MuiChatTypingIndicator');

export interface ChatTypingIndicatorProps extends TypingIndicatorProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatTypingIndicatorClasses>;
}

const ChatTypingIndicatorStyled = styled('div', {
  name: 'MuiChatTypingIndicator',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  fontStyle: 'italic',
}));

const ChatTypingIndicator = React.forwardRef<HTMLDivElement, ChatTypingIndicatorProps>(
  function ChatTypingIndicator(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatTypingIndicator' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatTypingIndicatorUtilityClasses(classesProp);

    return (
      <TypingIndicator
        ref={ref}
        {...other}
        slots={{
          ...slots,
          root: slots?.root ?? ChatTypingIndicatorStyled,
        }}
        slotProps={{
          ...slotProps,
          root: mergeSlotProps(
            {
              className: clsx(classes.root, className),
              sx,
            },
            slotProps?.root,
          ) as any,
        }}
      />
    );
  },
);

ChatTypingIndicator.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatTypingIndicator };
