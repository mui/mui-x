"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractValidationProps = exports.DATE_TIME_VALIDATION_PROP_NAMES = exports.TIME_VALIDATION_PROP_NAMES = exports.DATE_VALIDATION_PROP_NAMES = void 0;
exports.DATE_VALIDATION_PROP_NAMES = [
    'disablePast',
    'disableFuture',
    'minDate',
    'maxDate',
    'shouldDisableDate',
    'shouldDisableMonth',
    'shouldDisableYear',
];
exports.TIME_VALIDATION_PROP_NAMES = [
    'disablePast',
    'disableFuture',
    'minTime',
    'maxTime',
    'shouldDisableTime',
    'minutesStep',
    'ampm',
    'disableIgnoringDatePartForTimeValidation',
];
exports.DATE_TIME_VALIDATION_PROP_NAMES = [
    'minDateTime',
    'maxDateTime',
];
var VALIDATION_PROP_NAMES = __spreadArray(__spreadArray(__spreadArray([], exports.DATE_VALIDATION_PROP_NAMES, true), exports.TIME_VALIDATION_PROP_NAMES, true), exports.DATE_TIME_VALIDATION_PROP_NAMES, true);
/**
 * Extract the validation props for the props received by a component.
 * Limit the risk of forgetting some of them and reduce the bundle size.
 */
var extractValidationProps = function (props) {
    return VALIDATION_PROP_NAMES.reduce(function (extractedProps, propName) {
        if (props.hasOwnProperty(propName)) {
            extractedProps[propName] = props[propName];
        }
        return extractedProps;
    }, {});
};
exports.extractValidationProps = extractValidationProps;
