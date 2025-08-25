"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var luxon_1 = require("luxon");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var AdapterLuxon_1 = require("@mui/x-date-pickers/AdapterLuxon");
var pickers_1 = require("test/utils/pickers");
describe('<AdapterLuxon />', function () {
    (0, pickers_1.describeGregorianAdapter)(AdapterLuxon_1.AdapterLuxon, {
        formatDateTime: 'yyyy-MM-dd HH:mm:ss',
        setDefaultTimezone: function (timezone) {
            luxon_1.Settings.defaultZone = timezone !== null && timezone !== void 0 ? timezone : 'system';
        },
        getLocaleFromDate: function (value) { return value.locale; },
        frenchLocale: 'fr',
    });
    describe('Adapter localization', function () {
        describe('English', function () {
            var adapter = new AdapterLuxon_1.AdapterLuxon({ locale: 'en-US' });
            it('is12HourCycleInCurrentLocale: should have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
            });
        });
        describe('Russian', function () {
            var adapter = new AdapterLuxon_1.AdapterLuxon({ locale: 'ru' });
            it('getWeekArray: should start on Monday', function () {
                var date = adapter.date(pickers_1.TEST_DATE_ISO_STRING);
                var result = adapter.getWeekArray(date);
                expect(result[0][0].toFormat('ccc')).to.equal('пн');
            });
            it('is12HourCycleInCurrentLocale: should not have meridiem', function () {
                expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
            });
            it('getCurrentLocaleCode: should return locale code', function () {
                expect(adapter.getCurrentLocaleCode()).to.equal('ru');
            });
        });
        it('Formatting', function () {
            var adapter = new AdapterLuxon_1.AdapterLuxon({ locale: 'en-US' });
            var adapterRu = new AdapterLuxon_1.AdapterLuxon({ locale: 'ru' });
            var expectDate = function (format, expectedWithEn, expectedWithRu) {
                var date = adapter.date('2020-02-01T23:44:00.000Z');
                expect((0, pickers_1.cleanText)(adapter.format(date, format))).to.equal(expectedWithEn);
                expect((0, pickers_1.cleanText)(adapterRu.format(date, format))).to.equal(expectedWithRu);
            };
            expectDate('fullDate', 'Feb 1, 2020', '1 февр. 2020 г.');
            expectDate('keyboardDate', '2/1/2020', '01.02.2020');
            expectDate('keyboardDateTime12h', '2/1/2020 11:44 PM', '01.02.2020 11:44 PM');
            expectDate('keyboardDateTime24h', '2/1/2020 23:44', '01.02.2020 23:44');
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
                    adapterName: 'luxon',
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
    describe('Picker token "DD" expansion', function () {
        var testDate = '2018-05-15T09:35:00';
        var localizedTexts = {
            undefined: {
                placeholder: 'MMMM DD, YYYY',
                value: 'May 15, 2018',
            },
            fr: {
                placeholder: 'DD MMMM YYYY',
                value: '15 mai 2018',
            },
            de: {
                placeholder: 'DD. MMMM YYYY',
                value: '15. Mai 2018',
            },
            'pt-BR': {
                placeholder: 'DD de MMMM de YYYY',
                value: '15 de mai. de 2018',
            },
        };
        Object.keys(localizedTexts).forEach(function (localeKey) {
            var localeName = localeKey === 'undefined' ? 'default' : "\"".concat(localeKey, "\"");
            var localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };
            describe("test with the ".concat(localeName, " locale"), function () {
                var _a = (0, pickers_1.createPickerRenderer)({
                    adapterName: 'luxon',
                    locale: localeObject,
                }), render = _a.render, adapter = _a.adapter;
                var renderWithProps = (0, pickers_1.buildFieldInteractions)({
                    render: render,
                    Component: DateTimeField_1.DateTimeField,
                }).renderWithProps;
                it('should have correct placeholder', function () {
                    var view = renderWithProps({
                        enableAccessibleFieldDOMStructure: true,
                        format: 'DD',
                    });
                    (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), localizedTexts[localeKey].placeholder);
                });
                it('should have well formatted value', function () {
                    var view = renderWithProps({
                        enableAccessibleFieldDOMStructure: true,
                        value: adapter.date(testDate),
                        format: 'DD',
                    });
                    (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), localizedTexts[localeKey].value);
                });
            });
        });
    });
});
