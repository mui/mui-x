'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatConversation');
import { SxProps, Theme } from '@mui/system';
import { ConversationSubtitle, type ConversationSubtitleProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationUtilityClasses,
  type ChatConversationClasses,
} from './chatConversationClasses';

export interface ChatConversationSubtitleProps extends ConversationSubtitleProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationClasses>;
}

const ChatConversationSubtitleStyled = styled('p', {
  name: 'MuiChatConversation',
  slot: 'Subtitle',
  overridesResolver: (_, styles) => styles.subtitle,
})(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  lineHeight: 1.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const ChatConversationSubtitle = React.forwardRef<
  HTMLParagraphElement,
  ChatConversationSubtitleProps
>(function ChatConversationSubtitle(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversation' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationUtilityClasses(classesProp);

  return (
    <ConversationSubtitle
      ref={ref}
      {...other}
      slots={{
        subtitle: slots?.subtitle ?? ChatConversationSubtitleStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        subtitle: {
          className: clsx(classes.subtitle, className),
          sx,
          ...(slotProps?.subtitle as object),
        } as any,
      }}
    />
  );
});

ChatConversationSubtitle.propTypes = {
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

export { ChatConversationSubtitle };
