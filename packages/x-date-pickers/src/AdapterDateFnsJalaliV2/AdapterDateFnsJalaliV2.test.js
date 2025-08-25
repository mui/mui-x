"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateTimeField_1 = require("@mui/x-date-pickers/DateTimeField");
var AdapterDateFnsJalaliV2_1 = require("@mui/x-date-pickers/AdapterDateFnsJalaliV2");
var pickers_1 = require("test/utils/pickers");
var locale_1 = require("date-fns-jalali/locale");
describe('<AdapterDateFnsJalaliV2 />', function () {
    (0, pickers_1.describeJalaliAdapter)(AdapterDateFnsJalaliV2_1.AdapterDateFnsJalali, {});
    describe('Adapter localization', function () {
        it('Formatting', function () {
            var adapter = new AdapterDateFnsJalaliV2_1.AdapterDateFnsJalali();
            var expectDate = function (format, expectedWithFaIR) {
                var date = adapter.date('2020-02-01T23:44:00.000Z');
                expect(adapter.format(date, format)).to.equal(expectedWithFaIR);
            };
            expectDate('fullDate', '12-ام بهمن 1398');
            expectDate('keyboardDate', '1398/11/12');
            expectDate('keyboardDateTime12h', '1398/11/12 11:44 ب.ظ.');
            expectDate('keyboardDateTime24h', '1398/11/12 23:44');
        });
    });
    describe('Picker localization', function () {
        var testDate = '2018-05-15T09:35:00';
        var localizedTexts = {
            enUS: {
                placeholder: 'MM/DD/YYYY hh:mm aa',
                value: '02/25/1397 09:35 AM',
            },
            faIR: {
                placeholder: 'YYYY/MM/DD hh:mm aa',
                value: '1397/02/25 09:35 ق.ظ.',
            },
        };
        Object.keys(localizedTexts).forEach(function (localeKey) {
            var localeObject = {
                faIR: locale_1.faIR,
                enUS: locale_1.enUS,
            }[localeKey];
            describe("test with the \"".concat(localeKey, "\" locale"), function () {
                var _a = (0, pickers_1.createPickerRenderer)({
                    adapterName: 'date-fns-jalali',
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
