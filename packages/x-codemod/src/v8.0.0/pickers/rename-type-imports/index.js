"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameImports_1 = require("../../../util/renameImports");
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    root = (0, renameImports_1.renameImports)({
        j: j,
        root: root,
        packageNames: ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
        imports: [
            {
                oldEndpoint: 'hooks',
                importsMapping: {
                    usePickersTranslations: 'usePickerTranslations',
                    usePickersContext: 'usePickerContext',
                },
            },
            {
                oldEndpoint: 'models',
                importsMapping: {
                    FieldValueType: 'PickerValueType',
                },
            },
            {
                oldEndpoint: 'PickersShortcuts',
                newEndpoint: 'models',
                importsMapping: {
                    PickerShortcutChangeImportance: 'PickerChangeImportance',
                },
            },
        ],
    });
    root = (0, renameImports_1.renameImports)({
        j: j,
        root: root,
        packageNames: ['@mui/x-date-pickers-pro'],
        imports: [
            {
                oldEndpoint: 'models',
                importsMapping: {
                    RangeFieldSection: 'FieldRangeSection',
                },
            },
        ],
    });
    return root.toSource(printOptions);
}
