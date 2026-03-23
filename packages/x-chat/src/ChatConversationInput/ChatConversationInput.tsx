'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatConversationInput');
import { SxProps, Theme } from '@mui/system';
import { ConversationInputRoot, type ConversationInputRootProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputProps extends ConversationInputRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputStyled = styled('form', {
  name: 'MuiChatConversationInput',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderTop: '1px solid',
  borderTopColor: (theme.vars || theme).palette.divider,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxSizing: 'border-box',
  flexShrink: 0,
}));

const ChatConversationInput = React.forwardRef<HTMLFormElement, ChatConversationInputProps>(
  function ChatConversationInput(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatConversationInputUtilityClasses(classesProp);

    return (
      <ConversationInputRoot
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatConversationInputStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            sx,
            ...slotProps?.root,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }}
      />
    );
  },
);

ChatConversationInput.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatConversationInput };
