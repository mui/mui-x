"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridInitializeState = void 0;
var React = require("react");
var useGridInitializeState = function (initializer, privateApiRef, props, key) {
    var previousKey = React.useRef(key);
    var isInitialized = React.useRef(false);
    if (key !== previousKey.current) {
        isInitialized.current = false;
        previousKey.current = key;
    }
    if (!isInitialized.current) {
        privateApiRef.current.state = initializer(privateApiRef.current.state, props, privateApiRef);
        isInitialized.current = true;
    }
};
exports.useGridInitializeState = useGridInitializeState;
