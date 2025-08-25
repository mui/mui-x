"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = require("moment");
var moment_jalaali_1 = require("moment-jalaali");
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var AdapterMomentJalaali_1 = require("@mui/x-date-pickers/AdapterMomentJalaali");
var pickers_1 = require("test/utils/pickers");
require("moment/locale/fa");
describe('<AdapterMomentJalaali />', function () {
    (0, pickers_1.describeJalaliAdapter)(AdapterMomentJalaali_1.AdapterMomentJalaali, {
        before: function () {
            moment_jalaali_1.default.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
        },
        after: function () {
            moment_1.default.locale('en');
        },
    });
    describe('Adapter localization', function () {
        beforeAll(function () {
            moment_jalaali_1.default.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
        });
        afterAll(function () {
            moment_1.default.locale('en');
        });
        it('Formatting', function () {
            var adapter = new AdapterMomentJalaali_1.AdapterMomentJalaali();
            var expectDate = function (format, expectedWithFaIR) {
                var date = adapter.date('2020-02-01T23:44:00.000Z');
                expect(adapter.format(date, format)).to.equal(expectedWithFaIR);
            };
            expectDate('fullDate', '۱۳۹۸، بهمن ۱م');
            expectDate('keyboardDate', '۱۳۹۸/۱۱/۱۲');
            expectDate('keyboardDateTime12h', '۱۳۹۸/۱۱/۱۲ ۱۱:۴۴ ب.ظ');
            expectDate('keyboardDateTime24h', '۱۳۹۸/۱۱/۱۲ ۲۳:۴۴');
        });
    });
    describe('Picker localization', function () {
        beforeAll(function () {
            moment_jalaali_1.default.loadPersian();
        });
        afterAll(function () {
            moment_1.default.locale('en');
        });
        var testDate = '2018-05-15T09:35:00';
        var localizedTexts = {
            fa: {
                placeholder: 'YYYY/MM/DD hh:mm',
                value: '1397/02/25 09:35',
            },
        };
        Object.keys(localizedTexts).forEach(function (localeKey) {
            var localeObject = { code: localeKey };
            describe("test with the locale \"".concat(localeKey, "\""), function () {
                var _a = (0, pickers_1.createPickerRenderer)({
                    adapterName: 'moment-jalaali',
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
