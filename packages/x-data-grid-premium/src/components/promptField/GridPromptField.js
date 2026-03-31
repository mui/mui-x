import { jsx as _jsx } from "react/jsx-runtime";
import { PromptField } from './PromptField';
import { PromptFieldControl } from './PromptFieldControl';
import { PromptFieldRecord } from './PromptFieldRecord';
import { PromptFieldSend } from './PromptFieldSend';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { IS_SPEECH_RECOGNITION_SUPPORTED } from '../../utils/speechRecognition';
function GridPromptField(props) {
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    let placeholder = apiRef.current.getLocaleText('promptFieldPlaceholder');
    if (IS_SPEECH_RECOGNITION_SUPPORTED) {
        placeholder = apiRef.current.getLocaleText('promptFieldPlaceholderWithRecording');
    }
    return (_jsx(PromptField, { ...props, children: _jsx(PromptFieldControl, { onKeyDown: (event) => {
                if (event.key === 'Enter') {
                    // Prevents the `multiline` TextField from adding a new line
                    event.preventDefault();
                }
            }, render: ({ ref, ...controlProps }, state) => (_jsx(rootProps.slots.baseTextField, { ...controlProps, fullWidth: true, inputRef: ref, "aria-label": apiRef.current.getLocaleText('promptFieldLabel'), placeholder: state.recording
                    ? apiRef.current.getLocaleText('promptFieldPlaceholderListening')
                    : placeholder, size: "small", multiline: true, autoFocus: true, slotProps: {
                    input: {
                        startAdornment: IS_SPEECH_RECOGNITION_SUPPORTED ? (_jsx(rootProps.slots.baseTooltip, { title: state.recording
                                ? apiRef.current.getLocaleText('promptFieldStopRecording')
                                : apiRef.current.getLocaleText('promptFieldRecord'), children: _jsx(PromptFieldRecord, { size: "small", edge: "start", color: state.recording ? 'primary' : 'default', children: _jsx(rootProps.slots.promptSpeechRecognitionIcon, { fontSize: "small" }) }) })) : (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('promptFieldSpeechRecognitionNotSupported'), children: _jsx(rootProps.slots.promptSpeechRecognitionOffIcon, { fontSize: "small" }) })),
                        endAdornment: (_jsx(rootProps.slots.baseTooltip, { title: apiRef.current.getLocaleText('promptFieldSend'), children: _jsx("span", { children: _jsx(PromptFieldSend, { size: "small", edge: "end", color: "primary", children: _jsx(rootProps.slots.promptSendIcon, { fontSize: "small" }) }) }) })),
                        ...controlProps.slotProps?.input,
                    },
                    ...controlProps.slotProps,
                } })) }) }));
}
export { GridPromptField };
