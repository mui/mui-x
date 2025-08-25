"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardRef = void 0;
var React = require("react");
var reactMajor_1 = require("../reactMajor");
// Compatibility shim that ensures stable props object for forwardRef components
// Fixes https://github.com/facebook/react/issues/31613
// We ensure that the ref is always present in the props object (even if that's not the case for older versions of React) to avoid the footgun of spreading props over the ref in the newer versions of React.
// Footgun: <Component ref={ref} {...props} /> will break past React 19, but the types will now warn us that we should use <Component {...props} ref={ref} /> instead.
var forwardRef = function (render) {
    var _a;
    if (reactMajor_1.default >= 19) {
        var Component = function (props) { var _a; return render(props, (_a = props.ref) !== null && _a !== void 0 ? _a : null); };
        Component.displayName = (_a = render.displayName) !== null && _a !== void 0 ? _a : render.name;
        return Component;
    }
    return React.forwardRef(render);
};
exports.forwardRef = forwardRef;
