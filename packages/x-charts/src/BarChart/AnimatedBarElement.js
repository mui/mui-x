"use strict";
'use client';
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
exports.AnimatedBarElement = AnimatedBarElement;
var React = require("react");
var useAnimateBar_1 = require("../hooks/animation/useAnimateBar");
function AnimatedBarElement(props) {
    var ownerState = props.ownerState, skipAnimation = props.skipAnimation, id = props.id, dataIndex = props.dataIndex, xOrigin = props.xOrigin, yOrigin = props.yOrigin, other = __rest(props, ["ownerState", "skipAnimation", "id", "dataIndex", "xOrigin", "yOrigin"]);
    var animatedProps = (0, useAnimateBar_1.useAnimateBar)(props);
    return (<rect {...other} filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined} opacity={ownerState.isFaded ? 0.3 : 1} data-highlighted={ownerState.isHighlighted || undefined} data-faded={ownerState.isFaded || undefined} {...animatedProps}/>);
}
