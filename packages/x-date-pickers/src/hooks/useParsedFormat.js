"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useParsedFormat = void 0;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var usePickerAdapter_1 = require("./usePickerAdapter");
var buildSectionsFromFormat_1 = require("../internals/hooks/useField/buildSectionsFromFormat");
var useField_utils_1 = require("../internals/hooks/useField/useField.utils");
var usePickerTranslations_1 = require("./usePickerTranslations");
var useNullablePickerContext_1 = require("../internals/hooks/useNullablePickerContext");
/**
 * Returns the parsed format to be rendered in the field when there is no value or in other parts of the Picker.
 * This format is localized (for example `AAAA` for the year with the French locale) and cannot be parsed by your date library.
 * @param {object} The parameters needed to build the placeholder.
 * @param {string} params.format Format to parse.
 * @returns
 */
var useParsedFormat = function (parameters) {
    var _a;
    if (parameters === void 0) { parameters = {}; }
    var pickerContext = (0, useNullablePickerContext_1.useNullablePickerContext)();
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var translations = (0, usePickerTranslations_1.usePickerTranslations)();
    var localizedDigits = React.useMemo(function () { return (0, useField_utils_1.getLocalizedDigits)(adapter); }, [adapter]);
    var _b = parameters.format, format = _b === void 0 ? (_a = pickerContext === null || pickerContext === void 0 ? void 0 : pickerContext.fieldFormat) !== null && _a !== void 0 ? _a : adapter.formats.fullDate : _b;
    return React.useMemo(function () {
        var sections = (0, buildSectionsFromFormat_1.buildSectionsFromFormat)({
            adapter: adapter,
            format: format,
            formatDensity: 'dense',
            isRtl: isRtl,
            shouldRespectLeadingZeros: true,
            localeText: translations,
            localizedDigits: localizedDigits,
            date: null,
            // TODO v9: Make sure we still don't reverse in `buildSectionsFromFormat` when using `useParsedFormat`.
            enableAccessibleFieldDOMStructure: false,
        });
        return sections
            .map(function (section) { return "".concat(section.startSeparator).concat(section.placeholder).concat(section.endSeparator); })
            .join('');
    }, [adapter, isRtl, translations, localizedDigits, format]);
};
exports.useParsedFormat = useParsedFormat;
