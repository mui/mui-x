'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { ConversationHeaderInfo } from '@mui/x-chat-headless';
import type { ConversationHeaderInfoProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { useChatConversationUtilityClasses } from './chatConversationClasses';
import type { ChatConversationClasses } from './chatConversationClasses';

const useThemeProps = createUseThemeProps('MuiChatConversationHeaderInfo');

export interface ChatConversationHeaderInfoProps extends ConversationHeaderInfoProps {
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
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationHeaderInfo' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationUtilityClasses(classesProp);

  return (
    <ConversationHeaderInfo
      ref={ref}
      {...other}
      slots={{
        ...slots,
        headerInfo: slots?.headerInfo ?? ChatConversationHeaderInfoStyled,
      }}
      slotProps={{
        ...slotProps,
        headerInfo: mergeSlotProps(
          {
            className: clsx(classes.headerInfo, className),
            sx,
          },
          slotProps?.headerInfo,
        ) as any,
      }}
    />
  );
});

ChatConversationHeaderInfo.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
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

export { ChatConversationHeaderInfo };
