"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
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
        var handleContextChange = (0, sinon_1.spy)();
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiChartsLocalizationProvider: {
                    defaultProps: {
                        localeText: { noData: 'Pas de data' },
                    },
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <ChartsLocalizationProvider_1.ChartsLocalizationProvider>
          <ContextListener onContextChange={handleContextChange}/>
        </ChartsLocalizationProvider_1.ChartsLocalizationProvider>
      </styles_1.ThemeProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.noData).to.equal('Pas de data');
        expect(localeText.loading).to.equal('Loading data…');
    });
    it('should prioritize localeText key passed on LocalizationProvider compared to key passed from the theme', function () {
        var handleContextChange = (0, sinon_1.spy)();
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiChartsLocalizationProvider: {
                    defaultProps: {
                        localeText: { noData: 'Not priotized' },
                    },
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <ChartsLocalizationProvider_1.ChartsLocalizationProvider localeText={{ noData: 'Prioritized' }}>
          <ContextListener onContextChange={handleContextChange}/>
        </ChartsLocalizationProvider_1.ChartsLocalizationProvider>
      </styles_1.ThemeProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.noData).to.equal('Prioritized');
    });
    it('should prioritize deepest LocalizationProvider when using nested ones', function () {
        var handleContextChange = (0, sinon_1.spy)();
        render(<ChartsLocalizationProvider_1.ChartsLocalizationProvider localeText={{ noData: 'Not Prioritized' }}>
        <ChartsLocalizationProvider_1.ChartsLocalizationProvider localeText={{ noData: 'Prioritized' }}>
          <ContextListener onContextChange={handleContextChange}/>
        </ChartsLocalizationProvider_1.ChartsLocalizationProvider>
      </ChartsLocalizationProvider_1.ChartsLocalizationProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.noData).to.equal('Prioritized');
    });
    it("should not lose locales from higher LocalizationProvider when deepest one don't have the translation key", function () {
        var handleContextChange = (0, sinon_1.spy)();
        render(<ChartsLocalizationProvider_1.ChartsLocalizationProvider localeText={{ noData: 'Prioritized' }}>
        <ChartsLocalizationProvider_1.ChartsLocalizationProvider localeText={{ loading: 'Other Locale' }}>
          <ContextListener onContextChange={handleContextChange}/>
        </ChartsLocalizationProvider_1.ChartsLocalizationProvider>
      </ChartsLocalizationProvider_1.ChartsLocalizationProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.noData).to.equal('Prioritized');
        expect(localeText.loading).to.equal('Other Locale');
    });
});
