"use strict";
'use client';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewId = void 0;
var React = require("react");
var useSelector_1 = require("../../hooks/useSelector");
var useTreeViewId_selectors_1 = require("./useTreeViewId.selectors");
var useTreeViewId_utils_1 = require("./useTreeViewId.utils");
var useTreeViewId = function (_a) {
    var params = _a.params, store = _a.store;
    React.useEffect(function () {
        store.update(function (prevState) {
            var _a;
            if (params.id === prevState.id.providedTreeId && prevState.id.treeId !== undefined) {
                return prevState;
            }
            return __assign(__assign({}, prevState), { id: __assign(__assign({}, prevState.id), { treeId: (_a = params.id) !== null && _a !== void 0 ? _a : (0, useTreeViewId_utils_1.createTreeViewDefaultId)() }) });
        });
    }, [store, params.id]);
    var treeId = (0, useSelector_1.useSelector)(store, useTreeViewId_selectors_1.selectorTreeViewId);
    return {
        getRootProps: function () { return ({
            id: treeId,
        }); },
    };
};
exports.useTreeViewId = useTreeViewId;
exports.useTreeViewId.params = {
    id: true,
};
exports.useTreeViewId.getInitialState = function (_a) {
    var id = _a.id;
    return ({ id: { treeId: undefined, providedTreeId: id } });
};
