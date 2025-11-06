"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridColumnMenuSlots = void 0;
var React = require("react");
var useGridRootProps_1 = require("../../utils/useGridRootProps");
var useGridPrivateApiContext_1 = require("../../utils/useGridPrivateApiContext");
var useGridColumnMenuSlots = function (props) {
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var rootProps = (0, useGridRootProps_1.useGridRootProps)();
    var defaultSlots = props.defaultSlots, defaultSlotProps = props.defaultSlotProps, _a = props.slots, slots = _a === void 0 ? {} : _a, _b = props.slotProps, slotProps = _b === void 0 ? {} : _b, hideMenu = props.hideMenu, colDef = props.colDef, _c = props.addDividers, addDividers = _c === void 0 ? true : _c;
    var processedComponents = React.useMemo(function () { return (__assign(__assign({}, defaultSlots), slots)); }, [defaultSlots, slots]);
    var processedSlotProps = React.useMemo(function () {
        if (!slotProps || Object.keys(slotProps).length === 0) {
            return defaultSlotProps;
        }
        var mergedProps = __assign({}, slotProps);
        Object.entries(defaultSlotProps).forEach(function (_a) {
            var key = _a[0], currentSlotProps = _a[1];
            mergedProps[key] = __assign(__assign({}, currentSlotProps), (slotProps[key] || {}));
        });
        return mergedProps;
    }, [defaultSlotProps, slotProps]);
    var defaultItems = apiRef.current.unstable_applyPipeProcessors('columnMenu', [], props.colDef);
    var userItems = React.useMemo(function () {
        var defaultComponentKeys = Object.keys(defaultSlots);
        return Object.keys(slots).filter(function (key) { return !defaultComponentKeys.includes(key); });
    }, [slots, defaultSlots]);
    return React.useMemo(function () {
        var uniqueItems = Array.from(new Set(__spreadArray(__spreadArray([], defaultItems, true), userItems, true)));
        var cleansedItems = uniqueItems.filter(function (key) { return processedComponents[key] != null; });
        var sorted = cleansedItems.sort(function (a, b) {
            var leftItemProps = processedSlotProps[a];
            var rightItemProps = processedSlotProps[b];
            var leftDisplayOrder = Number.isFinite(leftItemProps === null || leftItemProps === void 0 ? void 0 : leftItemProps.displayOrder)
                ? leftItemProps.displayOrder
                : 100;
            var rightDisplayOrder = Number.isFinite(rightItemProps === null || rightItemProps === void 0 ? void 0 : rightItemProps.displayOrder)
                ? rightItemProps.displayOrder
                : 100;
            return leftDisplayOrder - rightDisplayOrder;
        });
        return sorted.reduce(function (acc, key, index) {
            var itemProps = { colDef: colDef, onClick: hideMenu };
            var processedComponentProps = processedSlotProps[key];
            if (processedComponentProps) {
                var displayOrder = processedComponentProps.displayOrder, customProps = __rest(processedComponentProps, ["displayOrder"]);
                itemProps = __assign(__assign({}, itemProps), customProps);
            }
            return addDividers && index !== sorted.length - 1
                ? __spreadArray(__spreadArray([], acc, true), [[processedComponents[key], itemProps], [rootProps.slots.baseDivider, {}]], false) : __spreadArray(__spreadArray([], acc, true), [[processedComponents[key], itemProps]], false);
        }, []);
    }, [
        addDividers,
        colDef,
        defaultItems,
        hideMenu,
        processedComponents,
        processedSlotProps,
        userItems,
        rootProps.slots.baseDivider,
    ]);
};
exports.useGridColumnMenuSlots = useGridColumnMenuSlots;
