"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAssertModelConsistency = void 0;
var React = require("react");
var warning_1 = require("../warning");
/**
 * Make sure a controlled prop is used correctly.
 * Logs errors if the prop either:
 *
 * - switch between controlled and uncontrolled
 * - modify it's default value
 * @param parameters
 */
function useAssertModelConsistencyOutsideOfProduction(parameters) {
    var componentName = parameters.componentName, propName = parameters.propName, controlled = parameters.controlled, defaultValue = parameters.defaultValue, _a = parameters.warningPrefix, warningPrefix = _a === void 0 ? 'MUI X' : _a;
    var _b = React.useState({
        initialDefaultValue: defaultValue,
        isControlled: controlled !== undefined,
    })[0], initialDefaultValue = _b.initialDefaultValue, isControlled = _b.isControlled;
    if (isControlled !== (controlled !== undefined)) {
        (0, warning_1.warnOnce)([
            "".concat(warningPrefix, ": A component is changing the ").concat(isControlled ? '' : 'un', "controlled ").concat(propName, " state of ").concat(componentName, " to be ").concat(isControlled ? 'un' : '', "controlled."),
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            "Decide between using a controlled or uncontrolled ".concat(propName, " ") +
                'element for the lifetime of the component.',
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
        ], 'error');
    }
    if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
        (0, warning_1.warnOnce)([
            "".concat(warningPrefix, ": A component is changing the default ").concat(propName, " state of an uncontrolled ").concat(componentName, " after being initialized. ") +
                "To suppress this warning opt to use a controlled ".concat(componentName, "."),
        ], 'error');
    }
}
exports.useAssertModelConsistency = process.env.NODE_ENV === 'production' ? function () { } : useAssertModelConsistencyOutsideOfProduction;
