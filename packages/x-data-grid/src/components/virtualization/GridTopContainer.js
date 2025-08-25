"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridTopContainer = GridTopContainer;
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var composeClasses_1 = require("@mui/utils/composeClasses");
var gridClasses_1 = require("../../constants/gridClasses");
var useUtilityClasses = function () {
    var slots = {
        root: ['topContainer'],
    };
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, {});
};
var Element = (0, system_1.styled)('div')({
    position: 'sticky',
    zIndex: 40,
    top: 0,
});
function GridTopContainer(props) {
    var classes = useUtilityClasses();
    return (<Element {...props} className={(0, clsx_1.default)(classes.root, gridClasses_1.gridClasses['container--top'])} role="presentation"/>);
}
