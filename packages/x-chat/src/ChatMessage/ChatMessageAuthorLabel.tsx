'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MessageAuthorLabel } from '@mui/x-chat-headless';
import type { MessageAuthorLabelProps, MessageAuthorLabelSlots } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatMessageUtilityClasses } from './chatMessageClasses';
import type { ChatMessageClasses } from './chatMessageClasses';
import { mergeSlotProps } from '../internals/mergeSlotProps';

const useThemeProps = createUseThemeProps('MuiChatMessageAuthorLabel');

export interface ChatMessageAuthorLabelSlots extends MessageAuthorLabelSlots {}

export interface ChatMessageAuthorLabelProps extends MessageAuthorLabelProps {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageAuthorLabelStyled = styled('span', {
  name: 'MuiChatMessage',
  slot: 'AuthorLabel',
  overridesResolver: (_, styles) => styles.authorLabel,
})(({ theme }) => ({
  display: 'block',
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.secondary,
  marginBottom: theme.spacing(0.25),
  lineHeight: 1.4,
}));

const ChatMessageAuthorLabel = React.forwardRef<HTMLSpanElement, ChatMessageAuthorLabelProps>(
  function ChatMessageAuthorLabel(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageAuthorLabel' });
    const { slots, slotProps, className, classes: classesProp, ...other } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageAuthorLabel
        ref={ref}
        {...other}
        slots={{
          ...slots,
          authorLabel: slots?.authorLabel ?? ChatMessageAuthorLabelStyled,
        }}
        slotProps={{
          ...slotProps,
          authorLabel: mergeSlotProps(
            {
              className: clsx(classes.authorLabel, className),
            },
            slotProps?.authorLabel,
          ) as any,
        }}
      />
    );
  },
);

ChatMessageAuthorLabel.propTypes /* remove-proptypes */ = {
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
} as any;

export { ChatMessageAuthorLabel };
