'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { ConversationHeaderInfo, type ConversationHeaderInfoProps } from '@mui/x-chat-unstyled';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

const useThemeProps = createUseThemeProps('MuiChatConversation');

export interface ChatConversationHeaderInfoProps extends ConversationHeaderInfoProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationHeaderInfoStyled = styled('div', {
  name: 'MuiChatConversation',
  slot: 'HeaderInfo',
  overridesResolver: (_, styles) => styles.headerInfo,
})(() => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  overflow: 'hidden',
}));

const ChatConversationHeaderInfo = React.forwardRef<
  HTMLDivElement,
  ChatConversationHeaderInfoProps
>(function ChatConversationHeaderInfo(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationUtilityClasses(classesProp);

  return (
    <ConversationHeaderInfo
      ref={ref}
      {...other}
      slots={{
        headerInfo: slots?.headerInfo ?? ChatConversationHeaderInfoStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        headerInfo: {
          className: clsx(classes.headerInfo, className),
          sx,
          ...(slotProps?.headerInfo as object),
        } as any,
      }}
    />
  );
});

ChatConversationHeaderInfo.propTypes = {
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

export { ChatConversationHeaderInfo };
