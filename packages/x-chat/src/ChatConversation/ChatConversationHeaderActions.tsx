'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import {
  ConversationHeaderActions,
  type ConversationHeaderActionsProps,
} from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

const useThemeProps = createUseThemeProps('MuiChatConversationHeaderActions');

export interface ChatConversationHeaderActionsProps extends ConversationHeaderActionsProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationHeaderActionsStyled = styled('div', {
  name: 'MuiChatConversation',
  slot: 'HeaderActions',
  overridesResolver: (_, styles) => styles.headerActions,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginInlineStart: 'auto',
}));

const ChatConversationHeaderActions = React.forwardRef<
  HTMLDivElement,
  ChatConversationHeaderActionsProps
>(function ChatConversationHeaderActions(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationHeaderActions' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationUtilityClasses(classesProp);

  return (
    <ConversationHeaderActions
      ref={ref}
      {...other}
      slots={{
        actions: slots?.actions ?? ChatConversationHeaderActionsStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        actions: {
          className: clsx(classes.headerActions, className),
          sx,
          ...(slotProps?.actions as object),
        } as any,
      }}
    />
  );
});

ChatConversationHeaderActions.propTypes = {
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

export { ChatConversationHeaderActions };
