"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldSectionContainerProps = useFieldSectionContainerProps;
var React = require("react");
/**
 * Generate the props to pass to the container element of each section of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
 * @param {UseFieldRootPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldRootPropsReturnValue} The props to forward to the container element of each section of the field.
 */
function useFieldSectionContainerProps(parameters) {
    var 
    // Methods to update the states
    setSelectedSections = parameters.stateResponse.setSelectedSections, _a = parameters.internalPropsWithDefaults.disabled, disabled = _a === void 0 ? false : _a;
    var createHandleClick = React.useCallback(function (sectionIndex) { return function (event) {
        // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
        // We avoid this by checking if the call to this function is actually intended, or a side effect.
        if (disabled || event.isDefaultPrevented()) {
            return;
        }
        setSelectedSections(sectionIndex);
    }; }, [disabled, setSelectedSections]);
    return React.useCallback(function (sectionIndex) { return ({
        'data-sectionindex': sectionIndex,
        onClick: createHandleClick(sectionIndex),
    }); }, [createHandleClick]);
}
