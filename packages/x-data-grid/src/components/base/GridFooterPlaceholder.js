"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridFooterPlaceholder = GridFooterPlaceholder;
var React = require("react");
var useGridRootProps_1 = require("../../hooks/utils/useGridRootProps");
function GridFooterPlaceholder() {
    var _a;
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    if (rootProps.hideFooter) {
        return null;
    }
    return (<rootProps.slots.footer {...(_a = rootProps.slotProps) === null || _a === void 0 ? void 0 : _a.footer /* FIXME: typing error */}/>);
}
