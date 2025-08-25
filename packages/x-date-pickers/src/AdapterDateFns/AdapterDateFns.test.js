"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var AdapterDateFns_1 = require("@mui/x-date-pickers/AdapterDateFns");
var pickers_1 = require("test/utils/pickers");
var locale_1 = require("date-fns/locale");
describe('<AdapterDateFns />', function () {
    (0, pickers_1.describeGregorianAdapter)(AdapterDateFns_1.AdapterDateFns, {
        formatDateTime: 'yyyy-MM-dd HH:mm:ss',
        setDefaultTimezone: function () { },
        frenchLocale: locale_1.fr,
    });
    describe('Adapter localization', function () {
        describe('Default locale', function () {
            var adapter = new AdapterDateFns_1.AdapterDateFns();
            it('getCurrentLocaleCode: should return locale code', function () {
                expect(adapter.getCurrentLocaleCode()).to.equal('en-US');
            });
        });
        describe('English', function () {
            var adapter = new AdapterDateFns_1.AdapterDateFns({ locale: locale_1.enUS });
            var date = adapter.date(pickers_1.TEST_DATE_ISO_STRING);
            it('getWeekArray: should start on Sunday', function () {
                var result = adapter.getWeekArray(date);
                expect(adapter.formatByString(result[0][0], 'EEEEEE')).to.equal('Su');
            });
            it('is12HourCycleInCurrentLocale: should have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
            });
        });
        describe('Russian', function () {
            var adapter = new AdapterDateFns_1.AdapterDateFns({ locale: locale_1.ru });
            it('getWeekArray: should start on Monday', function () {
                var date = adapter.date(pickers_1.TEST_DATE_ISO_STRING);
                var result = adapter.getWeekArray(date);
                expect(adapter.formatByString(result[0][0], 'EEEEEE')).to.equal('пн');
            });
            it('is12HourCycleInCurrentLocale: should not have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
            });
            it('getCurrentLocaleCode: should return locale code', function () {
                expect(adapter.getCurrentLocaleCode()).to.equal('ru');
            });
        });
        it('Formatting', function () {
            var adapter = new AdapterDateFns_1.AdapterDateFns({ locale: locale_1.enUS });
            var adapterRu = new AdapterDateFns_1.AdapterDateFns({ locale: locale_1.ru });
            var expectDate = function (format, expectedWithEn, expectedWithRu) {
                var date = adapter.date('2020-02-01T23:44:00.000Z');
                expect(adapter.format(date, format)).to.equal(expectedWithEn);
                expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
            };
            expectDate('fullDate', 'Feb 1, 2020', '1 фев. 2020 г.');
            expectDate('keyboardDate', '02/01/2020', '01.02.2020');
            expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 ПП');
            expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
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
            var localeObject = localeKey === 'undefined' ? undefined : { fr: locale_1.fr, de: locale_1.de }[localeKey];
            describe("test with the ".concat(localeName, " locale"), function () {
                var _a = (0, pickers_1.createPickerRenderer)({
                    adapterName: 'date-fns',
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
