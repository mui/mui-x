"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMultiInputRangeFieldSelectedSections = void 0;
var React = require("react");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
/**
 * @ignore - internal hook.
 */
var useMultiInputRangeFieldSelectedSections = function (parameters) {
    var _a;
    var unstableEndFieldRef = React.useRef(null);
    var handleUnstableEndFieldRef = (0, useForkRef_1.default)(parameters.unstableEndFieldRef, unstableEndFieldRef);
    var _b = React.useState((_a = parameters.selectedSections) !== null && _a !== void 0 ? _a : null), startSelectedSection = _b[0], setStartSelectedSection = _b[1];
    var _c = React.useState(null), endSelectedSection = _c[0], setEndSelectedSection = _c[1];
    var getActiveField = function () {
        if (unstableEndFieldRef.current && unstableEndFieldRef.current.isFieldFocused()) {
            return 'end';
        }
        return 'start';
    };
    var handleStartSelectedSectionChange = (0, useEventCallback_1.default)(function (newSelectedSections) {
        var _a;
        setStartSelectedSection(newSelectedSections);
        if (getActiveField() === 'start') {
            (_a = parameters.onSelectedSectionsChange) === null || _a === void 0 ? void 0 : _a.call(parameters, newSelectedSections);
        }
    });
    var handleEndSelectedSectionChange = (0, useEventCallback_1.default)(function (newSelectedSections) {
        var _a;
        setEndSelectedSection(newSelectedSections);
        if (getActiveField() === 'end') {
            (_a = parameters.onSelectedSectionsChange) === null || _a === void 0 ? void 0 : _a.call(parameters, newSelectedSections);
        }
    });
    var activeField = getActiveField();
    return {
        start: {
            unstableFieldRef: parameters.unstableStartFieldRef,
            selectedSections: activeField === 'start' && parameters.selectedSections !== undefined
                ? parameters.selectedSections
                : startSelectedSection,
            onSelectedSectionsChange: handleStartSelectedSectionChange,
        },
        end: {
            unstableFieldRef: handleUnstableEndFieldRef,
            selectedSections: activeField === 'end' && parameters.selectedSections !== undefined
                ? parameters.selectedSections
                : endSelectedSection,
            onSelectedSectionsChange: handleEndSelectedSectionChange,
        },
    };
};
exports.useMultiInputRangeFieldSelectedSections = useMultiInputRangeFieldSelectedSections;
