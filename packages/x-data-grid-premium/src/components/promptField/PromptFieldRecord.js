import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import PropTypes from 'prop-types';
import { Timeout } from '@mui/utils/useTimeout';
import useLazyRef from '@mui/utils/useLazyRef';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useComponentRenderer } from '@mui/x-internals/useComponentRenderer';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { usePromptFieldContext } from './PromptFieldContext';
import { BrowserSpeechRecognition } from '../../utils/speechRecognition';
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
const PromptFieldRecord = forwardRef(function PromptFieldRecord(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, lang, onRecordingChange, onValueChange, onSubmit, onError } = usePromptFieldContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const recognition = useLazyRef(() => {
        if (!BrowserSpeechRecognition) {
            return {
                start: () => { },
                abort: () => { },
            };
        }
        const timeout = new Timeout();
        const instance = new BrowserSpeechRecognition();
        instance.continuous = true;
        instance.interimResults = true;
        instance.lang = lang;
        let finalResult = '';
        let interimResult = '';
        function start(options) {
            if (state.recording) {
                return;
            }
            onRecordingChange(true);
            instance.onresult = (event) => {
                finalResult = '';
                interimResult = '';
                if (typeof event.results === 'undefined') {
                    instance.stop();
                    return;
                }
                for (let i = event.resultIndex; i < event.results.length; i += 1) {
                    if (event.results[i].isFinal) {
                        finalResult += event.results[i][0].transcript;
                    }
                    else {
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
            instance.onerror = (error) => {
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
    const handleClick = (event) => {
        if (!state.recording) {
            recognition.start({
                onDone: onSubmit,
                onUpdate: onValueChange,
                onError: onError ?? (() => { }),
            });
            return;
        }
        recognition.abort();
        onClick?.(event);
    };
    const element = useComponentRenderer(rootProps.slots.baseIconButton, render, {
        ...rootProps.slotProps?.baseIconButton,
        className: resolvedClassName,
        disabled: state.disabled,
        ...other,
        ref,
        onClick: handleClick,
    }, state);
    return _jsx(React.Fragment, { children: element });
});
PromptFieldRecord.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    color: PropTypes.oneOf(['default', 'inherit', 'primary']),
    disabled: PropTypes.bool,
    edge: PropTypes.oneOf(['end', 'start', false]),
    id: PropTypes.string,
    label: PropTypes.string,
    /**
     * A function to customize rendering of the component.
     */
    render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    role: PropTypes.string,
    size: PropTypes.oneOf(['large', 'medium', 'small']),
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    title: PropTypes.string,
    touchRippleRef: PropTypes.any,
};
export { PromptFieldRecord };
