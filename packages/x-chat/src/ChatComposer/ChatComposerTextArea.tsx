'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/system';
import { ComposerTextArea, type ComposerTextAreaProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatComposerUtilityClasses, type ChatComposerClasses } from './chatComposerClasses';

const useThemeProps = createUseThemeProps('MuiChatComposer');

export interface ChatComposerTextAreaProps extends ComposerTextAreaProps {
  className?: string;
  sx?: SxProps<Theme>;
  classes?: Partial<ChatComposerClasses>;
  /**
   * Maximum number of rows the textarea can expand to before it starts scrolling.
   * When set, the textarea starts at 1 row and auto-grows up to `maxRows`.
   */
  maxRows?: number;
}

const ChatComposerTextAreaStyled = styled('textarea', {
  name: 'MuiChatComposer',
  slot: 'TextArea',
  overridesResolver: (_, styles) => styles.textArea,
})(({ theme }) => ({
  flex: 1,
  resize: 'none',
  border: 'none',
  borderRadius: 0,
  padding: theme.spacing(0.5),
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: 'transparent',
  outline: 'none',
  boxSizing: 'border-box',
  minHeight: 40,
  maxHeight: 200,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  '&:disabled': {
    color: (theme.vars || theme).palette.text.disabled,
    cursor: 'not-allowed',
  },
  '&::placeholder': {
    color: (theme.vars || theme).palette.text.disabled,
  },
}));

const ChatComposerTextArea = React.forwardRef<HTMLTextAreaElement, ChatComposerTextAreaProps>(
  function ChatComposerTextArea(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposer' });
    const { slots, slotProps, className, classes: classesProp, sx, maxRows, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);

    return (
      <ComposerTextArea
        ref={ref}
        {...other}
        slots={{
          input: slots?.input ?? ChatComposerTextAreaStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          input: {
            className: clsx(classes.textArea, className),
            sx,
            ...(maxRows != null
              ? {
                  style: {
                    minHeight: 'unset',
                    margin: 'auto 0px',
                    height: '28px',
                  },
                  rows: 1,
                }
              : {}),
            ...slotProps?.input,
          } as any,
        }}
      />
    );
  },
);

ChatComposerTextArea.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Maximum number of rows the textarea can expand to before it starts scrolling.
   * When set, the textarea starts at 1 row and auto-grows up to `maxRows`.
   */
  maxRows: PropTypes.number,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChatComposerTextArea };
