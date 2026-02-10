"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
var useSeries_1 = require("./useSeries");
var ChartProvider_1 = require("../context/ChartProvider");
var defaultSeriesConfig_1 = require("../internals/plugins/utils/defaultSeriesConfig");
function UseSeries() {
    var _a;
    var bar = (0, useSeries_1.useSeries)().bar;
    return (0, jsx_runtime_1.jsx)("div", { children: (_a = bar === null || bar === void 0 ? void 0 : bar.series['test-id']) === null || _a === void 0 ? void 0 : _a.id });
}
describe('useSeries', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    // can't catch render errors in the browser for unknown reason
    // tried try-catch + error boundary + window onError preventDefault
    it.skipIf(!skipIf_1.isJSDOM)('should throw an error when parent context not present', function () {
        var errorRef = React.createRef();
        var errorMessage1 = 'MUI X Charts: Could not find the Chart context.';
        var errorMessage2 = 'It looks like you rendered your component outside of a ChartDataProvider.';
        var errorMessage3 = 'The above error occurred in the <UseSeries> component:';
        var expectedError = internal_test_utils_1.reactMajor < 19 ? [errorMessage3] : [errorMessage1, errorMessage2].join('\n');
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(internal_test_utils_1.ErrorBoundary, { ref: errorRef, children: (0, jsx_runtime_1.jsx)(UseSeries, {}) }));
        }).toErrorDev(expectedError);
        expect(errorRef.current.errors).to.have.length(1);
        expect(errorRef.current.errors[0].toString()).to.include(errorMessage1);
    });
    it('should not throw an error when parent context is present', function () {
        render((0, jsx_runtime_1.jsx)(ChartProvider_1.ChartProvider, { pluginParams: {
                series: [{ type: 'bar', id: 'test-id', data: [1, 2] }],
                width: 200,
                height: 200,
                seriesConfig: defaultSeriesConfig_1.defaultSeriesConfig,
            }, children: (0, jsx_runtime_1.jsx)(UseSeries, {}) }));
        expect(internal_test_utils_1.screen.getByText('test-id')).toBeVisible();
    });
});
