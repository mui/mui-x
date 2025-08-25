"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridInfiniteLoadingIntersection = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var system_1 = require("@mui/system");
var InfiniteLoadingTriggerElement = (0, system_1.styled)('div')({
    position: 'sticky',
    left: 0,
    width: 0,
    height: 0,
});
/**
 * @requires useGridDimensions (method) - can be after
 */
var useGridInfiniteLoadingIntersection = function (apiRef, props) {
    var isReady = (0, x_data_grid_1.useGridSelector)(apiRef, x_data_grid_1.gridDimensionsSelector).isReady;
    var observer = React.useRef(null);
    var updateTargetTimeout = (0, internals_1.useTimeout)();
    var triggerElement = React.useRef(null);
    var isEnabledClientSide = props.rowsLoadingMode === 'client' && !!props.onRowsScrollEnd;
    var isEnabledServerSide = props.dataSource && props.lazyLoading;
    var isEnabled = isEnabledClientSide || isEnabledServerSide;
    var handleIntersectionChange = (0, useEventCallback_1.default)(function (_a) {
        var _b;
        var entry = _a[0];
        var currentRatio = entry.intersectionRatio;
        var isIntersecting = entry.isIntersecting;
        if (isIntersecting && currentRatio === 1) {
            (_b = observer.current) === null || _b === void 0 ? void 0 : _b.disconnect();
            // do not observe this node anymore
            triggerElement.current = null;
            apiRef.current.publishEvent('rowsScrollEndIntersection');
        }
    });
    React.useEffect(function () {
        var _a;
        var virtualScroller = apiRef.current.virtualScrollerRef.current;
        if (!isEnabled || !isReady || !virtualScroller) {
            return;
        }
        (_a = observer.current) === null || _a === void 0 ? void 0 : _a.disconnect();
        var horizontalScrollbarHeight = (0, internals_1.gridHorizontalScrollbarHeightSelector)(apiRef);
        var marginBottom = props.scrollEndThreshold - horizontalScrollbarHeight;
        observer.current = new IntersectionObserver(handleIntersectionChange, {
            threshold: 1,
            root: virtualScroller,
            rootMargin: "0px 0px ".concat(marginBottom, "px 0px"),
        });
        if (triggerElement.current) {
            observer.current.observe(triggerElement.current);
        }
    }, [apiRef, isReady, handleIntersectionChange, isEnabled, props.scrollEndThreshold]);
    var updateTarget = function (node) {
        var _a, _b;
        if (triggerElement.current !== node) {
            (_a = observer.current) === null || _a === void 0 ? void 0 : _a.disconnect();
            triggerElement.current = node;
            if (triggerElement.current) {
                (_b = observer.current) === null || _b === void 0 ? void 0 : _b.observe(triggerElement.current);
            }
        }
    };
    var triggerRef = React.useCallback(function (node) {
        // Prevent the infite loading working in combination with lazy loading
        if (!isEnabled) {
            return;
        }
        // If the user scrolls through the grid too fast it might happen that the observer is connected to the trigger element
        // that will be intersecting the root inside the same render cycle (but not intersecting at the time of the connection).
        // This will cause the observer to not call the callback with `isIntersecting` set to `true`.
        // https://www.w3.org/TR/intersection-observer/#event-loop
        // Delaying the connection to the next cycle helps since the observer will always call the callback the first time it is connected.
        // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe
        // Related to
        // https://github.com/mui/mui-x/issues/14116
        updateTargetTimeout.start(0, function () { return updateTarget(node); });
    }, [isEnabled, updateTargetTimeout]);
    var getInfiniteLoadingTriggerElement = React.useCallback(function (_a) {
        var lastRowId = _a.lastRowId;
        if (!isEnabled) {
            return null;
        }
        return (<InfiniteLoadingTriggerElement ref={triggerRef} 
        // Force rerender on last row change to start observing the new trigger
        key={"trigger-".concat(lastRowId)} role="presentation"/>);
    }, [isEnabled, triggerRef]);
    var infiniteLoaderPrivateApi = {
        getInfiniteLoadingTriggerElement: getInfiniteLoadingTriggerElement,
    };
    (0, x_data_grid_1.useGridApiMethod)(apiRef, infiniteLoaderPrivateApi, 'private');
};
exports.useGridInfiniteLoadingIntersection = useGridInfiniteLoadingIntersection;
