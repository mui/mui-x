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
exports.useGridLazyLoaderPreProcessors = exports.GRID_SKELETON_ROW_ROOT_ID = void 0;
var React = require("react");
var internals_1 = require("@mui/x-data-grid/internals");
var x_data_grid_1 = require("@mui/x-data-grid");
exports.GRID_SKELETON_ROW_ROOT_ID = 'auto-generated-skeleton-row-root';
var getSkeletonRowId = function (index) { return "".concat(exports.GRID_SKELETON_ROW_ROOT_ID, "-").concat(index); };
var useGridLazyLoaderPreProcessors = function (privateApiRef, props) {
    var addSkeletonRows = React.useCallback(function (groupingParams) {
        var rootGroup = groupingParams.tree[x_data_grid_1.GRID_ROOT_GROUP_ID];
        if (props.rowsLoadingMode !== 'server' ||
            !props.rowCount ||
            rootGroup.children.length >= props.rowCount) {
            return groupingParams;
        }
        var tree = __assign({}, groupingParams.tree);
        var rootGroupChildren = __spreadArray([], rootGroup.children, true);
        for (var i = 0; i < props.rowCount - rootGroup.children.length; i += 1) {
            var skeletonId = getSkeletonRowId(i);
            rootGroupChildren.push(skeletonId);
            var skeletonRowNode = {
                type: 'skeletonRow',
                id: skeletonId,
                parent: x_data_grid_1.GRID_ROOT_GROUP_ID,
                depth: 0,
            };
            tree[skeletonId] = skeletonRowNode;
        }
        tree[x_data_grid_1.GRID_ROOT_GROUP_ID] = __assign(__assign({}, rootGroup), { children: rootGroupChildren });
        return __assign(__assign({}, groupingParams), { tree: tree });
    }, [props.rowCount, props.rowsLoadingMode]);
    (0, internals_1.useGridRegisterPipeProcessor)(privateApiRef, 'hydrateRows', addSkeletonRows);
};
exports.useGridLazyLoaderPreProcessors = useGridLazyLoaderPreProcessors;
