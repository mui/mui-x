"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment_hijri_1 = require("moment-hijri");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var AdapterMomentHijri_1 = require("@mui/x-date-pickers/AdapterMomentHijri");
var pickers_1 = require("test/utils/pickers");
require("moment/locale/ar-sa");
var vitest_1 = require("vitest");
var skipIf_1 = require("test/utils/skipIf");
describe('<AdapterMomentHijri />', function () {
    (0, vitest_1.beforeAll)(function () {
        if (!skipIf_1.isJSDOM) {
            // Vitest browser mode does not correctly load the locale
            // This is the minimal amount of locale data needed to run the tests
            moment_hijri_1.default.updateLocale('ar-sa', {
                weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
                weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
                meridiem: function (hour) { return (hour < 12 ? 'ص' : 'م'); },
                postformat: function (input) {
                    return input.replace(/\d/g, function (match) { return '٠١٢٣٤٥٦٧٨٩'[match]; }).replace(/,/g, '،');
                },
            });
        }
    });
    (0, pickers_1.describeHijriAdapter)(AdapterMomentHijri_1.AdapterMomentHijri, {
        before: function () {
            moment_hijri_1.default.locale('ar-sa');
        },
        after: function () {
            moment_hijri_1.default.locale('en');
        },
    });
    describe('Adapter localization', function () {
        it('Formatting', function () {
            var adapter = new AdapterMomentHijri_1.AdapterMomentHijri();
            var expectDate = function (format, expectedWithArSA) {
                var date = adapter.date('2020-01-01T23:44:00.000Z');
                expect(adapter.format(date, format)).to.equal(expectedWithArSA);
            };
            expectDate('keyboardDate', '١٤٤١/٠٥/٠٦');
            expectDate('fullDate', '١٤٤١، جمادى الأولى ١');
            expectDate('normalDate', 'الأربعاء، ٦ جمادى ١');
            expectDate('shortDate', '٦ جمادى ١');
            expectDate('year', '١٤٤١');
            expectDate('month', 'جمادى الأولى');
            expectDate('weekday', 'الأربعاء');
            expectDate('weekdayShort', 'أربعاء');
            expectDate('dayOfMonth', '٦');
            expectDate('fullTime12h', '١١:٤٤ م');
            expectDate('fullTime24h', '٢٣:٤٤');
            expectDate('hours12h', '١١');
            expectDate('hours24h', '٢٣');
            expectDate('minutes', '٤٤');
            expectDate('seconds', '٠٠');
        });
    });
    describe('Picker localization', function () {
        var testDate = '2018-05-15T09:35:00';
        var localizedTexts = {
            ar: {
                placeholder: 'YYYY/MM/DD hh:mm',
                value: '١٤٣٩/٠٨/٢٩ ٠٩:٣٥',
            },
        };
        Object.keys(localizedTexts).forEach(function (localeKey) {
            var localeObject = { code: localeKey };
            describe("test with the locale \"".concat(localeKey, "\""), function () {
                var _a = (0, pickers_1.createPickerRenderer)({
                    adapterName: 'moment-hijri',
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
