'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { ConversationTitle, type ConversationTitleProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

const useThemeProps = createUseThemeProps('MuiChatConversation');

export interface ChatConversationTitleProps extends ConversationTitleProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationTitleStyled = styled('h2', {
  name: 'MuiChatConversation',
  slot: 'Title',
  overridesResolver: (_, styles) => styles.title,
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.subtitle1.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: 1.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const ChatConversationTitle = React.forwardRef<HTMLHeadingElement, ChatConversationTitleProps>(
  function ChatConversationTitle(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatConversationUtilityClasses(classesProp);

    return (
      <ConversationTitle
        ref={ref}
        {...other}
        slots={{
          title: slots?.title ?? ChatConversationTitleStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          title: {
            className: clsx(classes.title, className),
            sx,
            ...(slotProps?.title as object),
          } as any,
        }}
      />
    );
  },
);

ChatConversationTitle.propTypes = {
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

export { ChatConversationTitle };
