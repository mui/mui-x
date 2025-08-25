"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameNestedProps_1 = require("../../../util/renameNestedProps");
var propsToRename = {
    localeText: {
        datePickerDefaultToolbarTitle: 'datePickerToolbarTitle',
        timePickerDefaultToolbarTitle: 'timePickerToolbarTitle',
        dateTimePickerDefaultToolbarTitle: 'dateTimePickerToolbarTitle',
        dateRangePickerDefaultToolbarTitle: 'dateRangePickerToolbarTitle',
    },
};
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    (0, renameNestedProps_1.default)({
        root: root,
        componentNames: ['LocalizationProvider'],
        nestedProps: propsToRename,
        j: j,
    });
    return root.toSource(printOptions);
}
