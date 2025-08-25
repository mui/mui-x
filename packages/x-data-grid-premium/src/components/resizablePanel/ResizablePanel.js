"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizablePanel = ResizablePanel;
var React = require("react");
var clsx_1 = require("clsx");
var system_1 = require("@mui/system");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var composeClasses_1 = require("@mui/utils/composeClasses");
var ResizablePanelContext_1 = require("./ResizablePanelContext");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
var useUtilityClasses = function (ownerState) {
    var classes = ownerState.classes;
    var slots = {
        root: ['resizablePanel'],
    };
    return (0, composeClasses_1.default)(slots, x_data_grid_pro_1.getDataGridUtilityClass, classes);
};
var ResizablePanelRoot = (0, system_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'ResizablePanel',
})({
    position: 'relative',
});
function ResizablePanel(props) {
    var className = props.className, children = props.children, _a = props.direction, direction = _a === void 0 ? 'horizontal' : _a, other = __rest(props, ["className", "children", "direction"]);
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var classes = useUtilityClasses(rootProps);
    var ref = React.useRef(null);
    var contextValue = React.useMemo(function () { return ({ rootRef: ref, direction: direction }); }, [direction]);
    return (<ResizablePanelContext_1.ResizablePanelContext.Provider value={contextValue}>
      <ResizablePanelRoot className={(0, clsx_1.default)(classes.root, className)} ownerState={rootProps} {...other} ref={ref}>
        {children}
      </ResizablePanelRoot>
    </ResizablePanelContext_1.ResizablePanelContext.Provider>);
}
