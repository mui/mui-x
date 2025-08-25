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
var dayjs_1 = require("dayjs");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var AdapterDayjs_1 = require("@mui/x-date-pickers/AdapterDayjs");
var pickers_1 = require("test/utils/pickers");
require("dayjs/locale/fr");
require("dayjs/locale/de");
// We import the plugins here just to have the typing
require("dayjs/plugin/utc");
require("dayjs/plugin/timezone");
describe('<AdapterDayjs />', function () {
    var commonParams = {
        formatDateTime: 'YYYY-MM-DD HH:mm:ss',
        setDefaultTimezone: dayjs_1.default.tz.setDefault,
        getLocaleFromDate: function (value) { return value.locale(); },
        frenchLocale: 'fr',
    };
    (0, pickers_1.describeGregorianAdapter)(AdapterDayjs_1.AdapterDayjs, commonParams);
    // Makes sure that all the tests that do not use timezones works fine when dayjs do not support UTC / timezone.
    (0, pickers_1.describeGregorianAdapter)(AdapterDayjs_1.AdapterDayjs, __assign(__assign({}, commonParams), { prepareAdapter: function (adapter) {
            // @ts-ignore
            adapter.hasUTCPlugin = function () { return false; };
            // @ts-ignore
            adapter.hasTimezonePlugin = function () { return false; };
            // Makes sure that we don't run timezone related tests, that would not work.
            adapter.isTimezoneCompatible = false;
        } }));
    describe('Adapter timezone', function () {
        it('setTimezone: should throw warning if no plugin is available', function () {
            var modifiedAdapter = new AdapterDayjs_1.AdapterDayjs();
            // @ts-ignore
            modifiedAdapter.hasTimezonePlugin = function () { return false; };
            var date = modifiedAdapter.date(pickers_1.TEST_DATE_ISO_STRING);
            expect(function () { return modifiedAdapter.setTimezone(date, 'Europe/London'); }).to.throw();
        });
    });
    describe('Adapter localization', function () {
        describe('English', function () {
            var adapter = new AdapterDayjs_1.AdapterDayjs({ locale: 'en' });
            var date = adapter.date(pickers_1.TEST_DATE_ISO_STRING);
            it('getWeekArray: should start on Sunday', function () {
                var result = adapter.getWeekArray(date);
                expect(result[0][0].format('dd')).to.equal('Su');
            });
            it('is12HourCycleInCurrentLocale: should have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
            });
        });
        describe('Russian', function () {
            var adapter = new AdapterDayjs_1.AdapterDayjs({ locale: 'ru' });
            it('getWeekArray: should start on Monday', function () {
                var date = adapter.date(pickers_1.TEST_DATE_ISO_STRING);
                var result = adapter.getWeekArray(date);
                expect(result[0][0].format('dd')).to.equal('пн');
            });
            it('is12HourCycleInCurrentLocale: should not have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
            });
            it('getCurrentLocaleCode: should return locale code', function () {
                expect(adapter.getCurrentLocaleCode()).to.equal('ru');
            });
        });
        it('Formatting', function () {
            var adapter = new AdapterDayjs_1.AdapterDayjs({ locale: 'en' });
            var adapterRu = new AdapterDayjs_1.AdapterDayjs({ locale: 'ru' });
            var expectDate = function (format, expectedWithEn, expectedWithRu) {
                var date = adapter.date('2020-02-01T23:44:00.000Z');
                expect(adapter.format(date, format)).to.equal(expectedWithEn);
                expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
            };
            expectDate('fullDate', 'Feb 1, 2020', '1 февр. 2020 г.');
            expectDate('keyboardDate', '02/01/2020', '01.02.2020');
            expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 вечера');
            expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
        });
        it('should warn when trying to use a non-loaded locale', function () {
            var adapter = new AdapterDayjs_1.AdapterDayjs({ locale: 'pl' });
            expect(function () { return adapter.is12HourCycleInCurrentLocale(); }).toWarnDev('Your locale has not been found.');
        });
    });
    describe('Picker localization', function () {
        var testDate = '2018-05-15T09:35:00';
        var localizedTexts = {
            undefined: {
                placeholder: 'MM/DD/YYYY hh:mm aa',
                value: '05/15/2018 09:35 AM',
            },
            fr: {
                placeholder: 'DD/MM/YYYY hh:mm',
                value: '15/05/2018 09:35',
            },
            de: {
                placeholder: 'DD.MM.YYYY hh:mm',
                value: '15.05.2018 09:35',
            },
        };
        Object.keys(localizedTexts).forEach(function (localeKey) {
            var localeName = localeKey === 'undefined' ? 'default' : "\"".concat(localeKey, "\"");
            var localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };
            describe("test with the ".concat(localeName, " locale"), function () {
                var _a = (0, pickers_1.createPickerRenderer)({
                    adapterName: 'dayjs',
                    locale: localeObject,
                }), render = _a.render, adapter = _a.adapter;
                var renderWithProps = (0, pickers_1.buildFieldInteractions)({
                    render: render,
                    Component: DateTimeField_1.DateTimeField,
                }).renderWithProps;
                it('should have correct placeholder', function () {
                    var view = renderWithProps({ enableAccessibleFieldDOMStructure: true });
                    (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), localizedTexts[localeKey].placeholder);
                });
                it('should have well formatted value', function () {
                    var view = renderWithProps({
                        enableAccessibleFieldDOMStructure: true,
                        value: adapter.date(testDate),
                    });
                    (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), localizedTexts[localeKey].value);
                });
            });
        });
    });
});
