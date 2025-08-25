"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var YearCalendar_1 = require("@mui/x-date-pickers/YearCalendar");
var pickers_1 = require("test/utils/pickers");
var styles_1 = require("@mui/material/styles");
/* eslint-disable material-ui/disallow-active-element-as-key-event-target */
describe('<YearCalendar /> - Keyboard', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var RTL_THEME = (0, styles_1.createTheme)({
        direction: 'rtl',
    });
    function changeYear(keyPressed, expectedValue, yearsOrder, direction) {
        var _a;
        if (yearsOrder === void 0) { yearsOrder = 'asc'; }
        if (direction === void 0) { direction = 'ltr'; }
        var yearCalendar = (<YearCalendar_1.YearCalendar value={pickers_1.adapterToUse.date('2000-01-01')} minDate={pickers_1.adapterToUse.date('1999-01-01')} maxDate={pickers_1.adapterToUse.date('2001-01-01')} yearsOrder={yearsOrder}/>);
        var elementsToRender = direction === 'rtl' ? (<styles_1.ThemeProvider theme={RTL_THEME}>{yearCalendar}</styles_1.ThemeProvider>) : (yearCalendar);
        render(elementsToRender);
        var startYear = internal_test_utils_1.screen.getByRole('radio', { checked: true });
        internal_test_utils_1.fireEvent.focus(startYear);
        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: keyPressed });
        expect((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.textContent).to.equal(expectedValue);
    }
    it('should increase the year when pressing right and yearsOrder is asc (default)', function () {
        changeYear('ArrowRight', '2001');
    });
    it('should decrease the year when pressing left and yearsOrder is asc (default)', function () {
        changeYear('ArrowLeft', '1999');
    });
    it('should decrease the year when pressing right and yearsOrder is desc', function () {
        changeYear('ArrowRight', '1999', 'desc');
    });
    it('should increase the year when pressing left and yearsOrder is desc', function () {
        changeYear('ArrowLeft', '2001', 'desc');
    });
    it('should decrease the year when pressing right and yearsOrder is asc (default) and theme is RTL', function () {
        changeYear('ArrowRight', '1999', 'asc', 'rtl');
    });
    it('should increase the year when pressing left and yearsOrder is asc (default) and theme is RTL', function () {
        changeYear('ArrowLeft', '2001', 'asc', 'rtl');
    });
    it('should increase the year when pressing right and yearsOrder is desc and theme is RTL', function () {
        changeYear('ArrowRight', '2001', 'desc', 'rtl');
    });
    it('should decrease the year when pressing left and yearsOrder is desc and theme is RTL', function () {
        changeYear('ArrowLeft', '1999', 'desc', 'rtl');
    });
});
