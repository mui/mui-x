"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridApiMethod = useGridApiMethod;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
function useGridApiMethod(privateApiRef, apiMethods, visibility) {
    var isFirstRender = React.useRef(true);
    (0, useEnhancedEffect_1.default)(function () {
        isFirstRender.current = false;
        privateApiRef.current.register(visibility, apiMethods);
    }, [privateApiRef, visibility, apiMethods]);
    if (isFirstRender.current) {
        privateApiRef.current.register(visibility, apiMethods);
    }
}
