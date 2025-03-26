import * as React from 'react';
import PropTypes from 'prop-types';
import { Timeout } from '@mui/utils/useTimeout';
import useLazyRef from '@mui/utils/useLazyRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridSlotProps, RenderProp } from '@mui/x-data-grid-pro';
import { useGridComponentRenderer } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { PromptFieldState, usePromptFieldContext } from './PromptFieldContext';
import { BrowserSpeechRecognition } from '../../utils/speechRecognition';

export type PromptFieldRecordProps = Omit<GridSlotProps['baseIconButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseIconButton'], PromptFieldState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: PromptFieldState) => string);
};

type SpeechRecognitionOptions = {
  onUpdate: (value: string) => void;
  onDone: (value: string) => void;
  onError: (error: string) => void;
};

/**
 * A button that records the user's voice when clicked.
 * It renders the `baseIconButton` slot.
 *
 * Demos:
 *
 * - [Prompt Field](https://mui.com/x/react-data-grid/components/prompt-field/)
 *
 * API:
 *
 * - [PromptFieldRecord API](https://mui.com/x/api/data-grid/prompt-field-record/)
 */
const PromptFieldRecord = forwardRef<HTMLButtonElement, PromptFieldRecordProps>(
  function PromptFieldRecord(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, lang, onRecordingChange, onStopRecording, onValueUpdate, onError } =
      usePromptFieldContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const recognition = useLazyRef(() => {
      if (!BrowserSpeechRecognition) {
        return {
          start: () => {},
          abort: () => {},
        };
      }

      const timeout = new Timeout();
      const instance = new BrowserSpeechRecognition();
      instance.continuous = true;
      instance.interimResults = true;
      instance.lang = lang;

      let finalResult = '';
      let interimResult = '';

      function start(options: SpeechRecognitionOptions) {
        if (state.recording) {
          return;
        }
        onRecordingChange(true);

        instance.onresult = (event: any) => {
          finalResult = '';
          interimResult = '';
          if (typeof event.results === 'undefined') {
            instance.stop();
            return;
          }

          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            if (event.results[i].isFinal) {
              finalResult += event.results[i][0].transcript;
            } else {
              interimResult += event.results[i][0].transcript;
            }
          }

          if (finalResult === '') {
            options.onUpdate(interimResult);
          }
          timeout.start(1000, () => instance.stop());
        };

        instance.onsoundend = () => {
          instance.stop();
        };

        instance.onend = () => {
          options.onDone(finalResult);
          onRecordingChange(false);
        };

        instance.onerror = (error: { error: string; message: string }) => {
          options.onError(error.message);
          instance.stop();
          onRecordingChange(false);
        };

        instance.start();
      }

      function abort() {
        instance.abort();
      }

      return { start, abort };
    }).current;

    const handleClick = () => {
      if (!state.recording) {
        recognition.start({ onDone: onStopRecording, onUpdate: onValueUpdate, onError });
        return;
      }

      recognition.abort();
    };

    const element = useGridComponentRenderer(
      rootProps.slots.baseIconButton,
      render,
      {
        ...rootProps.slotProps?.baseIconButton,
        className: resolvedClassName,
        ...other,
        ref,
        onClick: handleClick,
      },
      state,
    );

    return <React.Fragment>{element}</React.Fragment>;
  },
);

PromptFieldRecord.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A ref for imperative actions.
   * It currently only supports `focusVisible()` action.
   */
  action: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        focusVisible: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * If `true`, the ripples are centered.
   * They won't start at the cursor interaction position.
   * @default false
   */
  centerRipple: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#custom-colors).
   */
  color: PropTypes.oneOf(['default', 'inherit', 'primary']),
  component: PropTypes.elementType,
  /**
   * If `true`, the component is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the  keyboard focus ripple is disabled.
   * @default false
   */
  disableFocusRipple: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: PropTypes.bool,
  /**
   * If `true`, the touch ripple effect is disabled.
   * @default false
   */
  disableTouchRipple: PropTypes.bool,
  /**
   * If given, uses a negative margin to counteract the padding on one
   * side (this is often helpful for aligning the left or right
   * side of the icon with content above or below, without ruining the border
   * size and shape).
   */
  edge: PropTypes.oneOf(['end', 'start', false]),
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default false
   */
  focusRipple: PropTypes.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: PropTypes.string,
  label: PropTypes.string,
  /**
   * The component used to render a link when the `href` prop is provided.
   * @default 'a'
   */
  LinkComponent: PropTypes.elementType,
  /**
   * If `true`, the loading indicator is visible and the button is disabled.
   * If `true | false`, the loading wrapper is always rendered before the children to prevent [Google Translation Crash](https://github.com/mui/material-ui/issues/27853).
   * @default null
   */
  loading: PropTypes.bool,
  /**
   * Element placed before the children if the button is in loading state.
   * The node should contain an element with `role="progressbar"` with an accessible name.
   * By default, it renders a `CircularProgress` that is labeled by the button itself.
   * @default <CircularProgress color="inherit" size={16} />
   */
  loadingIndicator: PropTypes.node,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: PropTypes.func,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The size of the component.
   * `small` is equivalent to the dense button styling.
   */
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  tabIndex: PropTypes.number,
  /**
   * Props applied to the `TouchRipple` element.
   */
  TouchRippleProps: PropTypes.object,
  /**
   * A ref that points to the `TouchRipple` element.
   */
  touchRippleRef: PropTypes.any,
} as any;

export { PromptFieldRecord };
