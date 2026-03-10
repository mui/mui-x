"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var vitest_1 = require("vitest");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var styles_1 = require("@mui/material/styles");
var hooks_1 = require("@mui/x-charts/hooks");
var ChartsLocalizationProvider_1 = require("@mui/x-charts/ChartsLocalizationProvider");
function ContextListener(_a) {
    var onContextChange = _a.onContextChange;
    var context = (0, hooks_1.useChartsLocalization)();
    React.useEffect(function () {
        onContextChange(context);
    }, [onContextChange, context]);
    return null;
}
describe('<ChartsLocalizationProvider />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should respect localeText from the theme', function () {
        var _a;
        var handleContextChange = vitest_1.vi.fn();
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiChartsLocalizationProvider: {
                    defaultProps: {
                        localeText: { noData: 'Pas de data' },
                    },
                },
            },
        });
        render((0, jsx_runtime_1.jsx)(styles_1.ThemeProvider, { theme: theme, children: (0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { children: (0, jsx_runtime_1.jsx)(ContextListener, { onContextChange: handleContextChange }) }) }));
        var localeText = (_a = handleContextChange.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0].localeText;
        expect(localeText.noData).to.equal('Pas de data');
        expect(localeText.loading).to.equal('Loading data…');
    });
    it('should prioritize localeText key passed on LocalizationProvider compared to key passed from the theme', function () {
        var _a;
        var handleContextChange = vitest_1.vi.fn();
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiChartsLocalizationProvider: {
                    defaultProps: {
                        localeText: { noData: 'Not priotized' },
                    },
                },
            },
        });
        render((0, jsx_runtime_1.jsx)(styles_1.ThemeProvider, { theme: theme, children: (0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { localeText: { noData: 'Prioritized' }, children: (0, jsx_runtime_1.jsx)(ContextListener, { onContextChange: handleContextChange }) }) }));
        var localeText = (_a = handleContextChange.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0].localeText;
        expect(localeText.noData).to.equal('Prioritized');
    });
    it('should prioritize deepest LocalizationProvider when using nested ones', function () {
        var _a;
        var handleContextChange = vitest_1.vi.fn();
        render((0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { localeText: { noData: 'Not Prioritized' }, children: (0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { localeText: { noData: 'Prioritized' }, children: (0, jsx_runtime_1.jsx)(ContextListener, { onContextChange: handleContextChange }) }) }));
        var localeText = (_a = handleContextChange.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0].localeText;
        expect(localeText.noData).to.equal('Prioritized');
    });
    it("should not lose locales from higher LocalizationProvider when deepest one don't have the translation key", function () {
        var _a;
        var handleContextChange = vitest_1.vi.fn();
        render((0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { localeText: { noData: 'Prioritized' }, children: (0, jsx_runtime_1.jsx)(ChartsLocalizationProvider_1.ChartsLocalizationProvider, { localeText: { loading: 'Other Locale' }, children: (0, jsx_runtime_1.jsx)(ContextListener, { onContextChange: handleContextChange }) }) }));
        var localeText = (_a = handleContextChange.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0].localeText;
        expect(localeText.noData).to.equal('Prioritized');
        expect(localeText.loading).to.equal('Other Locale');
    });
});
