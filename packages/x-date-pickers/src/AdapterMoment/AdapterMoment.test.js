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
var moment_1 = require("moment");
var moment_timezone_1 = require("moment-timezone");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var AdapterMoment_1 = require("@mui/x-date-pickers/AdapterMoment");
var sinon_1 = require("sinon");
var pickers_1 = require("test/utils/pickers");
require("moment/locale/de");
require("moment/locale/fr");
require("moment/locale/ko");
require("moment/locale/ru");
describe('<AdapterMoment />', function () {
    var commonParams = {
        formatDateTime: 'YYYY-MM-DD HH:mm:ss',
        dateLibInstanceWithTimezoneSupport: moment_timezone_1.default,
        setDefaultTimezone: moment_timezone_1.default.tz.setDefault,
        getLocaleFromDate: function (value) { return value.locale(); },
        frenchLocale: 'fr',
    };
    moment_1.default.locale('en');
    (0, pickers_1.describeGregorianAdapter)(AdapterMoment_1.AdapterMoment, commonParams);
    moment_1.default.locale('en');
    // Makes sure that all the tests that do not use timezones works fine when dayjs do not support UTC / timezone.
    (0, pickers_1.describeGregorianAdapter)(AdapterMoment_1.AdapterMoment, __assign(__assign({}, commonParams), { prepareAdapter: function (adapter) {
            // @ts-ignore
            adapter.hasTimezonePlugin = function () { return false; };
            // Makes sure that we don't run timezone related tests, that would not work.
            adapter.isTimezoneCompatible = false;
        } }));
    describe('Adapter localization', function () {
        describe('English', function () {
            var adapter = new AdapterMoment_1.AdapterMoment({ locale: 'en' });
            var date = adapter.date(pickers_1.TEST_DATE_ISO_STRING);
            it('getWeekArray: week should start on Monday', function () {
                var result = adapter.getWeekArray(date);
                expect(result[0][0].format('dd')).to.equal('Su');
            });
            it('is12HourCycleInCurrentLocale: should have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
            });
            it('parse: should have the right locale', function () {
                expect(adapter.parse('01/01/2020', 'MM/DD/YYYY').locale()).to.equal('en');
            });
        });
        describe('Russian', function () {
            var adapter = new AdapterMoment_1.AdapterMoment({ locale: 'ru' });
            var date = adapter.date(pickers_1.TEST_DATE_ISO_STRING);
            beforeEach(function () {
                moment_1.default.locale('ru');
            });
            afterEach(function () {
                moment_1.default.locale('en');
            });
            it('getWeekArray: week should start on Monday', function () {
                var result = adapter.getWeekArray(date);
                expect(result[0][0].format('dd')).to.equal('пн');
            });
            it('is12HourCycleInCurrentLocale: should not have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
            });
            it('getCurrentLocaleCode: should return locale code', function () {
                expect(adapter.getCurrentLocaleCode()).to.equal('ru');
            });
            it('parse: should have the right locale', function () {
                expect(adapter.parse('01/01/2020', 'MM/DD/YYYY').locale()).to.equal('ru');
            });
        });
        describe('Korean', function () {
            var adapter = new AdapterMoment_1.AdapterMoment({ locale: 'ko' });
            beforeEach(function () {
                moment_1.default.locale('ko');
            });
            afterEach(function () {
                moment_1.default.locale('en');
            });
            it('parse: should have the right locale', function () {
                expect(adapter.parse('01/01/2020', 'MM/DD/YYYY').locale()).to.equal('ko');
            });
        });
        it('Formatting', function () {
            var adapter = new AdapterMoment_1.AdapterMoment({ locale: 'en' });
            var adapterRu = new AdapterMoment_1.AdapterMoment({ locale: 'ru' });
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
    });
    describe('Picker localization', function () {
        var testDate = '2018-05-15T09:35:00';
        var localizedTexts = {
            en: {
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
            var localeObject = { code: localeKey };
            describe("test with the locale \"".concat(localeKey, "\""), function () {
                var _a = (0, pickers_1.createPickerRenderer)({
                    adapterName: 'moment',
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
    it('should use moment custom instance if provided', function () {
        var spiedInstance = (0, sinon_1.spy)(moment_1.default);
        var adapter = new AdapterMoment_1.AdapterMoment({ instance: spiedInstance });
        adapter.date();
        expect(spiedInstance.callCount).to.equal(1);
    });
});
