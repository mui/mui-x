"use strict";
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
exports.removeLastSeparator = exports.splitDateRangeSections = void 0;
exports.getRangeFieldType = getRangeFieldType;
var splitDateRangeSections = function (sections) {
    var startDateSections = [];
    var endDateSections = [];
    sections.forEach(function (section) {
        if (section.dateName === 'start') {
            startDateSections.push(section);
        }
        else {
            endDateSections.push(section);
        }
    });
    return { startDate: startDateSections, endDate: endDateSections };
};
exports.splitDateRangeSections = splitDateRangeSections;
var removeLastSeparator = function (dateSections) {
    return dateSections.map(function (section, sectionIndex) {
        if (sectionIndex === dateSections.length - 1) {
            return __assign(__assign({}, section), { separator: null });
        }
        return section;
    });
};
exports.removeLastSeparator = removeLastSeparator;
function getRangeFieldType(field) {
    var _a;
    var fieldType = (_a = field.fieldType) !== null && _a !== void 0 ? _a : 'multi-input';
    return fieldType;
}
