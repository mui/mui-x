"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
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
            return render(<ChartContainer_1.ChartContainer {...defaultProps}>
          <ChartsXAxis_1.ChartsXAxis axisId="invalid-axis-id"/>
        </ChartContainer_1.ChartContainer>);
        }).toWarnDev(expectedError);
    });
    it('should render with valid axisId', function () {
        render(<ChartContainer_1.ChartContainer {...defaultProps}>
        <ChartsXAxis_1.ChartsXAxis axisId="test-x-axis"/>
      </ChartContainer_1.ChartContainer>);
        expect(internal_test_utils_1.screen.getByText('Downloads')).toBeTruthy();
    });
});
