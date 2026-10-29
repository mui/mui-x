'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { ConversationRoot, markChatLayoutPane } from '@mui/x-chat-headless';
import type { ConversationRootProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { useChatConversationUtilityClasses } from './chatConversationClasses';
import type { ChatConversationClasses } from './chatConversationClasses';

const useThemeProps = createUseThemeProps('MuiChatConversation');

export interface ChatConversationProps extends ConversationRootProps {
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
          ...slots,
          root: slots?.root ?? ChatConversationStyled,
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

ChatConversation.propTypes /* remove-proptypes */ = {
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

// Mirror the headless `ConversationRoot` pane marker on the Material wrapper so
// `ChatLayout` assigns it to the thread pane (the symbol lives on the headless
// primitive, not this wrapper).
// `markChatLayoutPane` mutates the component in place and returns it for the
// `const X = markChatLayoutPane(...)` form; here the return is intentionally discarded.
void markChatLayoutPane(ChatConversation, 'thread');

export { ChatConversation };
