"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFirstRender = useFirstRender;
var React = require("react");
function useFirstRender(callback) {
    var isFirstRender = React.useRef(true);
    if (isFirstRender.current) {
        isFirstRender.current = false;
        callback();
    }
}
