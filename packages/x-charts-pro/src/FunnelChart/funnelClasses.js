"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.funnelClasses = void 0;
exports.getFunnelUtilityClass = getFunnelUtilityClass;
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getFunnelUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiFunnelChart', slot);
}
exports.funnelClasses = (0, generateUtilityClasses_1.default)('MuiFunnelChart', [
    'root',
    'section',
    'sectionFilled',
    'sectionOutlined',
    'sectionLabel',
    'sectionLabelFilled',
    'sectionLabelOutlined',
]);
var useUtilityClasses = function (options) {
    var _a = options !== null && options !== void 0 ? options : {}, _b = _a.variant, variant = _b === void 0 ? 'filled' : _b, classes = _a.classes;
    var slots = {
        root: ['root'],
        section: [
            'section',
            variant === 'filled' && 'sectionFilled',
            variant === 'outlined' && 'sectionOutlined',
        ],
        sectionLabel: [
            'sectionLabel',
            variant === 'filled' && 'sectionLabelFilled',
            variant === 'outlined' && 'sectionLabelOutlined',
        ],
    };
    return (0, composeClasses_1.default)(slots, getFunnelUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
