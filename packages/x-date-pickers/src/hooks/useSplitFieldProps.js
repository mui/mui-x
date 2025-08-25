"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSplitFieldProps = void 0;
var React = require("react");
var extractValidationProps_1 = require("../validation/extractValidationProps");
var SHARED_FIELD_INTERNAL_PROP_NAMES = [
    'value',
    'defaultValue',
    'referenceDate',
    'format',
    'formatDensity',
    'onChange',
    'timezone',
    'onError',
    'shouldRespectLeadingZeros',
    'selectedSections',
    'onSelectedSectionsChange',
    'unstableFieldRef',
    'unstableStartFieldRef',
    'unstableEndFieldRef',
    'enableAccessibleFieldDOMStructure',
    'disabled',
    'readOnly',
    'dateSeparator',
    'autoFocus',
    'focused',
];
/**
 * Split the props received by the field component into:
 * - `internalProps` which are used by the various hooks called by the field component.
 * - `forwardedProps` which are passed to the underlying component.
 * Note that some forwarded props might be used by the hooks as well.
 * For instance, hooks like `useDateField` need props like `onKeyDown` to merge the default event handler and the one provided by the application.
 * @template TProps, TValueType
 * @param {TProps} props The props received by the field component.
 * @param {TValueType} valueType The type of the field value ('date', 'time', or 'date-time').
 */
var useSplitFieldProps = function (props, valueType) {
    return React.useMemo(function () {
        var forwardedProps = __assign({}, props);
        var internalProps = {};
        var extractProp = function (propName) {
            if (forwardedProps.hasOwnProperty(propName)) {
                // @ts-ignore
                internalProps[propName] = forwardedProps[propName];
                delete forwardedProps[propName];
            }
        };
        SHARED_FIELD_INTERNAL_PROP_NAMES.forEach(extractProp);
        if (valueType === 'date') {
            extractValidationProps_1.DATE_VALIDATION_PROP_NAMES.forEach(extractProp);
        }
        else if (valueType === 'time') {
            extractValidationProps_1.TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
        }
        else if (valueType === 'date-time') {
            extractValidationProps_1.DATE_VALIDATION_PROP_NAMES.forEach(extractProp);
            extractValidationProps_1.TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
            extractValidationProps_1.DATE_TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
        }
        return { forwardedProps: forwardedProps, internalProps: internalProps };
    }, [props, valueType]);
};
exports.useSplitFieldProps = useSplitFieldProps;
