"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DateField_1 = require("@mui/x-date-pickers/DateField");
(0, pickers_1.describeAdapters)('<DateField /> - Format', DateField_1.DateField, function (_a) {
    var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
    var _b = adapter.escapedCharacters, startChar = _b.start, endChar = _b.end;
    it('should support escaped characters in start separator', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            // For Day.js: "[Escaped] YYYY"
            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'Escaped YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'Escaped 2019');
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            // For Day.js: "[Escaped] YYYY"
            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'Escaped YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV6)(input, 'Escaped 2019');
    });
    it('should support escaped characters between sections separator', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            // For Day.js: "MMMM [Escaped] YYYY"
            format: "".concat(adapter.formats.month, " ").concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM Escaped YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January Escaped 2019');
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            // For Day.js: "MMMM [Escaped] YYYY"
            format: "".concat(adapter.formats.month, " ").concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'MMMM Escaped YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV6)(input, 'January Escaped 2019');
    });
    // If your start character and end character are equal
    // Then you can't have nested escaped characters
    it.skipIf(startChar === endChar)('should support nested escaped characters', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            // For Day.js: "MMMM [Escaped[] YYYY"
            format: "".concat(adapter.formats.month, " ").concat(startChar, "Escaped ").concat(startChar).concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM Escaped [ YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'January Escaped [ 2019');
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            // For Day.js: "MMMM [Escaped[] YYYY"
            format: "".concat(adapter.formats.month, " ").concat(startChar, "Escaped ").concat(startChar).concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'MMMM Escaped [ YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV6)(input, 'January Escaped [ 2019');
    });
    it('should support several escaped parts', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.month, " ").concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'Escaped MMMM Escaped YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'Escaped January Escaped 2019');
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.month, " ").concat(startChar, "Escaped").concat(endChar, " ").concat(adapter.formats.year),
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'Escaped MMMM Escaped YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV6)(input, 'Escaped January Escaped 2019');
    });
    it('should support format with only escaped parts', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            // For Day.js: "[Escaped] [Escaped]"
            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(startChar, "Escaped").concat(endChar),
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'Escaped Escaped');
        view.unmount();
        // Test with non-accessible DOM structure
        renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            // For Day.js: "[Escaped] [Escaped]"
            format: "".concat(startChar, "Escaped").concat(endChar, " ").concat(startChar, "Escaped").concat(endChar),
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'Escaped Escaped');
    });
    it('should support format without separators', function () {
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            format: "".concat(adapter.formats.dayOfMonth).concat(adapter.formats.monthShort),
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'DDMMMM');
    });
    it('should add spaces around `/` when `formatDensity = "spacious"`', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            formatDensity: "spacious",
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM / DD / YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01 / 01 / 2019');
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            formatDensity: "spacious",
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'MM / DD / YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV6)(input, '01 / 01 / 2019');
    });
    it('should add spaces around `.` when `formatDensity = "spacious"`', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            formatDensity: "spacious",
            format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.'),
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM . DD . YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01 . 01 . 2019');
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            formatDensity: "spacious",
            format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.'),
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'MM . DD . YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV6)(input, '01 . 01 . 2019');
    });
    it('should add spaces around `-` when `formatDensity = "spacious"`', function () {
        // Test with accessible DOM structure
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            formatDensity: "spacious",
            format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-'),
            value: null,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM - DD - YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01 - 01 - 2019');
        view.unmount();
        // Test with non-accessible DOM structure
        view = renderWithProps({
            enableAccessibleFieldDOMStructure: false,
            formatDensity: "spacious",
            format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-'),
            value: null,
        });
        var input = (0, pickers_1.getTextbox)();
        (0, pickers_1.expectFieldPlaceholderV6)(input, 'MM - DD - YYYY');
        view.setProps({ value: adapter.date('2019-01-01') });
        (0, pickers_1.expectFieldValueV6)(input, '01 - 01 - 2019');
    });
});
