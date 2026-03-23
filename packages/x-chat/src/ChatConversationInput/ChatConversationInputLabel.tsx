'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatConversationInput');
import { SxProps, Theme } from '@mui/system';
import { ConversationInputLabel, type ConversationInputLabelProps } from '@mui/x-chat-unstyled';
import {
  useChatConversationInputUtilityClasses,
  type ChatConversationInputClasses,
} from './chatConversationInputClasses';

export interface ChatConversationInputLabelProps extends ConversationInputLabelProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatConversationInputClasses>;
}

const ChatConversationInputLabelStyled = styled('label', {
  name: 'MuiChatConversationInput',
  slot: 'Label',
  overridesResolver: (_, styles) => styles.label,
})(({ theme }) => ({
  display: 'block',
  fontSize: theme.typography.caption.fontSize,
  lineHeight: theme.typography.caption.lineHeight,
  color: (theme.vars || theme).palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  paddingInline: theme.spacing(0.5),
}));

const ChatConversationInputLabel = React.forwardRef<
  HTMLLabelElement,
  ChatConversationInputLabelProps
>(function ChatConversationInputLabel(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiChatConversationInput' });
  const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
  const classes = useChatConversationInputUtilityClasses(classesProp);

  return (
    <ConversationInputLabel
      ref={ref}
      {...other}
      slots={{
        label: slots?.label ?? ChatConversationInputLabelStyled,
        ...slots,
      }}
      slotProps={{
        ...slotProps,
        label: {
          className: clsx(classes.label, className),
          sx,
          ...slotProps?.label,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      }}
    />
  );
});

ChatConversationInputLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Label text. Falls back to the locale text `composerInputAriaLabel` when
   * omitted, so the default is consistent with the textarea's `aria-label`.
   */
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The `id` of the textarea this label is associated with.
   * Passed directly to the native `htmlFor` attribute.
   * When provided, the label is semantically linked to the textarea so that
   * clicking the label focuses the input and screen readers announce it on focus.
   */
  htmlFor: PropTypes.string,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatConversationInputLabel };
