"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartItemClick = void 0;
var getSVGPoint_1 = require("../../../../internals/getSVGPoint");
var useChartItemClick = function (_a) {
    var params = _a.params, store = _a.store, instance = _a.instance;
    var onItemClick = params.onItemClick;
    if (!onItemClick) {
        return { instance: {} };
    }
    var getItemPosition = function (event) {
        var _a, _b;
        var svgPoint = (0, getSVGPoint_1.getSVGPoint)(event === null || event === void 0 ? void 0 : event.currentTarget, event);
        if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
            return undefined;
        }
        var item = undefined;
        for (var _i = 0, _c = Object.keys(store.state.seriesConfig.config); _i < _c.length; _i++) {
            var seriesType = _c[_i];
            // @ts-ignore The type inference for store.state does not support generic yet
            item = (_b = (_a = store.state.seriesConfig.config[seriesType]).getItemAtPosition) === null || _b === void 0 ? void 0 : _b.call(_a, store.state, {
                x: svgPoint.x,
                y: svgPoint.y,
            });
            if (item) {
                return item;
            }
        }
        return item;
    };
    return {
        instance: {
            handleClick: function (event) {
                var item = getItemPosition(event);
                if (item !== undefined) {
                    onItemClick(event, item);
                }
            },
        },
    };
};
exports.useChartItemClick = useChartItemClick;
exports.useChartItemClick.params = {
    onItemClick: true,
};
