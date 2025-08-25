"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRefs = void 0;
var React = require("react");
var useGridRefs = function (apiRef) {
    var rootElementRef = React.useRef(null);
    var mainElementRef = React.useRef(null);
    var virtualScrollerRef = React.useRef(null);
    var virtualScrollbarVerticalRef = React.useRef(null);
    var virtualScrollbarHorizontalRef = React.useRef(null);
    var columnHeadersContainerRef = React.useRef(null);
    apiRef.current.register('public', {
        rootElementRef: rootElementRef,
    });
    apiRef.current.register('private', {
        mainElementRef: mainElementRef,
        virtualScrollerRef: virtualScrollerRef,
        virtualScrollbarVerticalRef: virtualScrollbarVerticalRef,
        virtualScrollbarHorizontalRef: virtualScrollbarHorizontalRef,
        columnHeadersContainerRef: columnHeadersContainerRef,
    });
};
exports.useGridRefs = useGridRefs;
