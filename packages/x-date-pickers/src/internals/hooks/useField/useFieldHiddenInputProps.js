"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldHiddenInputProps = useFieldHiddenInputProps;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
/**
 * Generate the props to pass to the hidden input element of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
 * @param {UseFieldHiddenInputPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldHiddenInputPropsReturnValue} The props to forward to the hidden input element of the field.
 */
function useFieldHiddenInputProps(parameters) {
    var fieldValueManager = parameters.manager.internal_fieldValueManager, _a = parameters.stateResponse, 
    // States and derived states
    areAllSectionsEmpty = _a.areAllSectionsEmpty, state = _a.state, 
    // Methods to update the states
    updateValueFromValueStr = _a.updateValueFromValueStr;
    var handleChange = (0, useEventCallback_1.default)(function (event) {
        updateValueFromValueStr(event.target.value);
    });
    var valueStr = React.useMemo(function () {
        return areAllSectionsEmpty
            ? ''
            : fieldValueManager.getV7HiddenInputValueFromSections(state.sections);
    }, [areAllSectionsEmpty, state.sections, fieldValueManager]);
    return {
        value: valueStr,
        onChange: handleChange,
    };
}
