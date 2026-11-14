'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useForkRef from '@mui/utils/useForkRef';
import type { SxProps, Theme } from '@mui/system';
import { ComposerTextArea } from '@mui/x-chat-headless';
import type { ComposerTextAreaProps, ComposerTextAreaSlots } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { mergeSlotProps } from '../internals/mergeSlotProps';
import { useChatComposerUtilityClasses } from './chatComposerClasses';
import type { ChatComposerClasses } from './chatComposerClasses';

const useThemeProps = createUseThemeProps('MuiChatComposerTextArea');

const MAX_ROWS_STYLE = { minHeight: 'unset', margin: 'auto 0px', height: '28px' } as const;
// Theme spacing factor for the text area padding, shared with the `maxRows` height cap.
const TEXT_AREA_PADDING = 0.5;

export interface ChatComposerTextAreaSlots extends ComposerTextAreaSlots {}

export interface ChatComposerTextAreaProps extends ComposerTextAreaProps {
  className?: string;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Override or extend the styles applied to the component.
   */
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
  padding: theme.spacing(TEXT_AREA_PADDING),
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: 'transparent',
  outline: 'none',
  boxSizing: 'border-box',
  minHeight: 40,
  // `maxRows` lines plus the rendered vertical padding (measured, as `sx` can change it). Without
  // `--ChatComposer-maxRows`, this custom property is invalid and `maxHeight` falls back to 200px.
  '--ChatComposer-maxRowsHeight': `calc(var(--ChatComposer-maxRows) * 1lh + var(--ChatComposer-paddingBlock, 2 * ${theme.spacing(TEXT_AREA_PADDING)}))`,
  maxHeight: 'var(--ChatComposer-maxRowsHeight, 200px)',
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
    const props = useThemeProps({ props: inProps, name: 'MuiChatComposerTextArea' });
    const { slots, slotProps, className, classes: classesProp, sx, maxRows, ...other } = props;
    const classes = useChatComposerUtilityClasses(classesProp);
    const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
    const handleRef = useForkRef(ref, inputRef);

    // Runs after every render because `sx` or theme changes can update the padding.
    useEnhancedEffect(() => {
      const textarea = inputRef.current;
      if (maxRows == null || !textarea) {
        return;
      }
      const style = getComputedStyle(textarea);
      const paddingBlock = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      textarea.style.setProperty('--ChatComposer-paddingBlock', `${paddingBlock}px`);
    });

    return (
      <ComposerTextArea
        ref={handleRef}
        {...other}
        slots={{
          ...slots,
          input: slots?.input ?? ChatComposerTextAreaStyled,
        }}
        slotProps={{
          ...slotProps,
          input: mergeSlotProps(
            {
              className: clsx(classes.textArea, className),
              sx,
              ...(maxRows != null
                ? {
                    style: { ...MAX_ROWS_STYLE, '--ChatComposer-maxRows': maxRows },
                    rows: 1,
                  }
                : {}),
            },
            slotProps?.input,
          ) as any,
        }}
      />
    );
  },
);

ChatComposerTextArea.propTypes /* remove-proptypes */ = {
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
   * Maximum number of rows the textarea can expand to before it starts scrolling.
   * When set, the textarea starts at 1 row and auto-grows up to `maxRows`.
   */
  maxRows: PropTypes.number,
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

export { ChatComposerTextArea };
