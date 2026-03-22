'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatConversationInput');
import { SxProps, Theme } from '@mui/system';
import {
  ConversationInputHelperText,
  type ConversationInputHelperTextProps,
  type ConversationInputHelperTextOwnerState,
} from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputHelperTextProps extends ConversationInputHelperTextProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

interface ChatConversationInputHelperTextOwnerState extends ConversationInputHelperTextOwnerState {
  error: boolean;
}

const ChatConversationInputHelperTextStyled = styled('p', {
  name: 'MuiChatConversationInput',
  slot: 'HelperText',
  overridesResolver: (_, styles) => styles.helperText,
})<{ ownerState?: ChatConversationInputHelperTextOwnerState }>(({ theme, ownerState }) => ({
  margin: 0,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: theme.typography.caption.lineHeight,
  color: ownerState?.error
    ? (theme.vars || theme).palette.error.main
    : (theme.vars || theme).palette.text.secondary,
  paddingInline: theme.spacing(0.5),
}));

const ChatConversationInputHelperText = React.forwardRef<
  HTMLParagraphElement,
  ChatConversationInputHelperTextProps
>(function ChatConversationInputHelperText(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationInputUtilityClasses(classesProp);

  return (
    <ConversationInputHelperText
      ref={ref}
      {...other}
      slots={{
        helperText: slots?.helperText ?? ChatConversationInputHelperTextStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        helperText: {
          className: clsx(classes.helperText, className),
          sx,
          ...slotProps?.helperText,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      }}
    />
  );
});

ChatConversationInputHelperText.propTypes = {
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

export { ChatConversationInputHelperText };
