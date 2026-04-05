'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { ComposerLabel, type ComposerLabelProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatComposerUtilityClasses, type ChatComposerClasses } from './chatComposerClasses';

const useThemeProps = createUseThemeProps('MuiChatComposer');

export interface ChatComposerLabelProps extends ComposerLabelProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
}

const ChatComposerLabelStyled = styled('label', {
  name: 'MuiChatComposer',
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

const ChatComposerLabel = React.forwardRef<HTMLLabelElement, ChatComposerLabelProps>(
  function ChatComposerLabel(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposer' });
    const { slots, slotProps, className, classes: classesProp, sx, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);

    return (
      <ComposerLabel
        ref={ref}
        {...other}
        slots={{
          label: slots?.label ?? ChatComposerLabelStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          label: {
            className: clsx(classes.label, className),
            sx,
            ...slotProps?.label,
          } as any,
        }}
      />
    );
  },
);

ChatComposerLabel.propTypes = {
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

export { ChatComposerLabel };
