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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ChartsXAxis_1 = require("@mui/x-charts/ChartsXAxis");
var ChartContainer_1 = require("@mui/x-charts/ChartContainer");
var skipIf_1 = require("test/utils/skipIf");
describe('<ChartsXAxis />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    var defaultProps = {
        width: 400,
        height: 300,
        series: [{ type: 'line', data: [1, 2, 3, 4, 5] }],
        xAxis: [{ scaleType: 'linear', id: 'test-x-axis', label: 'Downloads', data: [1, 2, 3, 4, 5] }],
    };
    it.skipIf(!skipIf_1.isJSDOM)('should not crash when axisId is invalid', function () {
        var expectedError = 'MUI X Charts: No axis found. The axisId "invalid-axis-id" is probably invalid.';
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(ChartContainer_1.ChartContainer, __assign({}, defaultProps, { children: (0, jsx_runtime_1.jsx)(ChartsXAxis_1.ChartsXAxis, { axisId: "invalid-axis-id" }) })));
        }).toWarnDev(expectedError);
    });
    it('should render with valid axisId', function () {
        render((0, jsx_runtime_1.jsx)(ChartContainer_1.ChartContainer, __assign({}, defaultProps, { children: (0, jsx_runtime_1.jsx)(ChartsXAxis_1.ChartsXAxis, { axisId: "test-x-axis" }) })));
        expect(internal_test_utils_1.screen.getByText('Downloads')).toBeTruthy();
    });
});
