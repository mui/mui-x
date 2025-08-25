"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-date-pickers/internals");
var LocalizationProvider_1 = require("@mui/x-date-pickers/LocalizationProvider");
var pickers_1 = require("test/utils/pickers");
function ContextListener(_a) {
    var onContextChange = _a.onContextChange;
    var context = (0, internals_1.useLocalizationContext)();
    React.useEffect(function () {
        onContextChange(context);
    }, [onContextChange, context]);
    return null;
}
describe('<LocalizationProvider />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should respect localeText from the theme', function () {
        var handleContextChange = (0, sinon_1.spy)();
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiLocalizationProvider: {
                    defaultProps: {
                        localeText: { start: 'Debut' },
                    },
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.AdapterClassToUse}>
          <ContextListener onContextChange={handleContextChange}/>
        </LocalizationProvider_1.LocalizationProvider>
      </styles_1.ThemeProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.start).to.equal('Debut');
        expect(localeText.end).to.equal('End');
    });
    it('should prioritize localeText key passed on LocalizationProvider compared to key passed from the theme', function () {
        var handleContextChange = (0, sinon_1.spy)();
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiLocalizationProvider: {
                    defaultProps: {
                        localeText: { start: 'Debut' },
                    },
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.AdapterClassToUse} localeText={{ start: 'Start' }}>
          <ContextListener onContextChange={handleContextChange}/>
        </LocalizationProvider_1.LocalizationProvider>
      </styles_1.ThemeProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.start).to.equal('Start');
    });
    it('should prioritize deepest LocalizationProvider when using nested ones', function () {
        var handleContextChange = (0, sinon_1.spy)();
        render(<LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.AdapterClassToUse} localeText={{ start: 'Empezar' }}>
        <LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.AdapterClassToUse} localeText={{ start: 'Début' }}>
          <ContextListener onContextChange={handleContextChange}/>
        </LocalizationProvider_1.LocalizationProvider>
      </LocalizationProvider_1.LocalizationProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.start).to.equal('Début');
    });
    it("should not loose locales from higher LocalizationProvider when deepest one don't have the translation key", function () {
        var handleContextChange = (0, sinon_1.spy)();
        render(<LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.AdapterClassToUse} localeText={{ start: 'Empezar' }}>
        <LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.AdapterClassToUse} localeText={{ end: 'Fin' }}>
          <ContextListener onContextChange={handleContextChange}/>
        </LocalizationProvider_1.LocalizationProvider>
      </LocalizationProvider_1.LocalizationProvider>);
        var localeText = handleContextChange.lastCall.args[0].localeText;
        expect(localeText.start).to.equal('Empezar');
    });
});
