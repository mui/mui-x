"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUtilityClasses = exports.sankeyClasses = void 0;
exports.getSankeyUtilityClass = getSankeyUtilityClass;
var composeClasses_1 = require("@mui/utils/composeClasses");
var generateUtilityClass_1 = require("@mui/utils/generateUtilityClass");
var generateUtilityClasses_1 = require("@mui/utils/generateUtilityClasses");
function getSankeyUtilityClass(slot) {
    return (0, generateUtilityClass_1.default)('MuiSankeyChart', slot);
}
exports.sankeyClasses = (0, generateUtilityClasses_1.default)('MuiSankeyChart', [
    'root',
    'nodes',
    'nodeLabels',
    'links',
    'linkLabels',
    'node',
    'link',
    'nodeLabel',
    'linkLabel',
]);
var useUtilityClasses = function (options) {
    var classes = (options !== null && options !== void 0 ? options : {}).classes;
    var slots = {
        root: ['root'],
        nodes: ['nodes'],
        nodeLabels: ['nodeLabels'],
        links: ['links'],
        linkLabels: ['linkLabels'],
        node: ['node'],
        link: ['link'],
        nodeLabel: ['nodeLabel'],
        linkLabel: ['linkLabel'],
    };
    return (0, composeClasses_1.default)(slots, getSankeyUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
