'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { ConversationSubtitle } from '@mui/x-chat-headless';
import type { ConversationSubtitleProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { useChatConversationUtilityClasses } from './chatConversationClasses';
import type { ChatConversationClasses } from './chatConversationClasses';

const useThemeProps = createUseThemeProps('MuiChatConversationSubtitle');

export interface ChatConversationSubtitleProps extends ConversationSubtitleProps {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Override or extend the styles applied to the component.
   */
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
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationSubtitle' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationUtilityClasses(classesProp);

  return (
    <ConversationSubtitle
      ref={ref}
      {...other}
      slots={{
        ...slots,
        subtitle: slots?.subtitle ?? ChatConversationSubtitleStyled,
      }}
      slotProps={{
        ...slotProps,
        subtitle: mergeSlotProps(
          {
            className: clsx(classes.subtitle, className),
            sx,
          },
          slotProps?.subtitle,
        ) as any,
      }}
    />
  );
});

ChatConversationSubtitle.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatConversationSubtitle };
