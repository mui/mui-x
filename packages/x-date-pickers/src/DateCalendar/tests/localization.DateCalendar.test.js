"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var LocalizationProvider_1 = require("@mui/x-date-pickers/LocalizationProvider");
var pickers_1 = require("test/utils/pickers");
var locale_1 = require("date-fns/locale");
require("dayjs/locale/he");
require("dayjs/locale/fr");
require("moment/locale/he");
require("moment/locale/fr");
var moment_1 = require("moment");
var ADAPTERS_TO_USE = ['date-fns', 'dayjs', 'luxon', 'moment'];
describe('<DateCalendar /> - localization', function () {
    ADAPTERS_TO_USE.forEach(function (adapterName) {
        describe("with '".concat(adapterName, "'"), function () {
            describe('with wrapper', function () {
                var render = (0, pickers_1.createPickerRenderer)({
                    locale: adapterName === 'date-fns' ? locale_1.he : { code: 'he' },
                    adapterName: adapterName,
                }).render;
                it('should display correct week day labels in Hebrew locale ', function () {
                    render(<DateCalendar_1.DateCalendar reduceAnimations/>);
                    expect(internal_test_utils_1.screen.getByText('א')).toBeVisible();
                });
            });
            describe('without wrapper', function () {
                var renderWithoutWrapper = (0, internal_test_utils_1.createRenderer)().render;
                it('should correctly switch between locale with week starting in Monday and week starting in Sunday', function () {
                    if (adapterName === 'moment') {
                        moment_1.default.locale('en');
                    }
                    var setProps = renderWithoutWrapper(<LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.availableAdapters[adapterName]} adapterLocale={adapterName === 'date-fns' ? locale_1.enUS : 'en-US'}>
              <DateCalendar_1.DateCalendar reduceAnimations/>
            </LocalizationProvider_1.LocalizationProvider>).setProps;
                    expect(document.querySelector(".".concat(DateCalendar_1.dayCalendarClasses.weekDayLabel)).ariaLabel).to.equal('Sunday');
                    setProps({
                        adapterLocale: adapterName === 'date-fns' ? locale_1.fr : 'fr',
                    });
                    expect(document.querySelector(".".concat(DateCalendar_1.dayCalendarClasses.weekDayLabel)).ariaLabel).to.equal('lundi');
                });
            });
        });
    });
});
