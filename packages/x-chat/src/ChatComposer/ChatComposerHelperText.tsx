'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { SxProps, Theme } from '@mui/system';
import { ComposerHelperText } from '@mui/x-chat-headless';
import type { ComposerHelperTextProps, ComposerHelperTextOwnerState } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { useChatComposerUtilityClasses } from './chatComposerClasses';
import type { ChatComposerClasses } from './chatComposerClasses';

const useThemeProps = createUseThemeProps('MuiChatComposerHelperText');

export interface ChatComposerHelperTextProps extends ComposerHelperTextProps {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChatComposerClasses>;
}

interface ChatComposerHelperTextOwnerState extends ComposerHelperTextOwnerState {
  error: boolean;
}

const ChatComposerHelperTextStyled = styled('p', {
  name: 'MuiChatComposer',
  slot: 'HelperText',
  overridesResolver: (_, styles) => styles.helperText,
})<{ ownerState?: ChatComposerHelperTextOwnerState }>(({ theme, ownerState }) => ({
  margin: 0,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: theme.typography.caption.lineHeight,
  color: ownerState?.error
    ? (theme.vars || theme).palette.error.main
    : (theme.vars || theme).palette.text.secondary,
  paddingInline: theme.spacing(0.5),
}));

const ChatComposerHelperText = React.forwardRef<HTMLParagraphElement, ChatComposerHelperTextProps>(
  function ChatComposerHelperText(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposerHelperText' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);

    return (
      <ComposerHelperText
        ref={ref}
        {...other}
        slots={{
          ...slots,
          helperText: slots?.helperText ?? ChatComposerHelperTextStyled,
        }}
        slotProps={{
          ...slotProps,
          helperText: mergeSlotProps(
            {
              className: clsx(classes.helperText, className),
              sx,
            },
            slotProps?.helperText,
          ) as any,
        }}
      />
    );
  },
);

ChatComposerHelperText.propTypes /* remove-proptypes */ = {
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

export { ChatComposerHelperText };
