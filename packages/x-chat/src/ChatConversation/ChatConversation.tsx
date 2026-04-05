'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { ConversationRoot, type ConversationRootProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

const useThemeProps = createUseThemeProps('MuiChatConversation');

export interface ChatConversationProps extends ConversationRootProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationStyled = styled('div', {
  name: 'MuiChatConversation',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
}));

const ChatConversation = React.forwardRef<HTMLDivElement, ChatConversationProps>(
  function ChatConversation(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatConversationUtilityClasses(classesProp);

    return (
      <ConversationRoot
        ref={ref}
        {...other}
        slots={{
          root: slots?.root ?? ChatConversationStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          root: {
            className: clsx(classes.root, className),
            sx,
            ...slotProps?.root,
          } as any,
        }}
      />
    );
  },
);

ChatConversation.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
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

export { ChatConversation };
