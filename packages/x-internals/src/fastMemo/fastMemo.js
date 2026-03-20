"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastMemo = fastMemo;
var React = require("react");
var fastObjectShallowCompare_1 = require("../fastObjectShallowCompare");
function fastMemo(component) {
    return React.memo(component, fastObjectShallowCompare_1.fastObjectShallowCompare);
}
