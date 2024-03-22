import {
  expectFieldPlaceholderV6,
  expectFieldValueV6,
  expectFieldValueV7,
  getTextbox,
  describeAdapters,
} from 'test/utils/pickers';
import { DateField } from '@mui/x-date-pickers/DateField';

describeAdapters('<DateField /> - Format', DateField, ({ adapter, renderWithProps }) => {
  it('should support escaped characters in start separator', () => {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;

    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "[Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
    });
    expectFieldValueV7(v7Response.getSectionsContainer(), 'Escaped YYYY');

    v7Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(v7Response.getSectionsContainer(), 'Escaped 2019');

    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      // For Day.js: "[Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });
    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'Escaped YYYY');

    v6Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'Escaped 2019');
  });

  it('should support escaped characters between sections separator', () => {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;

    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "MMMM [Escaped] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'MMMM Escaped YYYY');

    v7Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(v7Response.getSectionsContainer(), 'January Escaped 2019');

    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      // For Day.js: "MMMM [Escaped] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MMMM Escaped YYYY');

    v6Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'January Escaped 2019');
  });

  it('should support nested escaped characters', function test() {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;
    // If your start character and end character are equal
    // Then you can't have nested escaped characters
    if (startChar === endChar) {
      this.skip();
    }

    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "MMMM [Escaped[] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped ${startChar}${endChar} ${adapter.formats.year}`,
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'MMMM Escaped [ YYYY');

    v7Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(v7Response.getSectionsContainer(), 'January Escaped [ 2019');

    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      // For Day.js: "MMMM [Escaped[] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped ${startChar}${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MMMM Escaped [ YYYY');

    v6Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'January Escaped [ 2019');
  });

  it('should support several escaped parts', () => {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;

    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'Escaped MMMM Escaped YYYY');

    v7Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(v7Response.getSectionsContainer(), 'Escaped January Escaped 2019');

    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'Escaped MMMM Escaped YYYY');

    v6Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'Escaped January Escaped 2019');
  });

  it('should support format with only escaped parts', function test() {
    const { start: startChar, end: endChar } = adapter.escapedCharacters;

    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "[Escaped] [Escaped]"
      format: `${startChar}Escaped${endChar} ${startChar}Escaped${endChar}`,
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'Escaped Escaped');

    v7Response.unmount();

    // Test with v6 input
    renderWithProps({
      // For Day.js: "[Escaped] [Escaped]"
      format: `${startChar}Escaped${endChar} ${startChar}Escaped${endChar}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'Escaped Escaped');
  });

  it('should support format without separators', () => {
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      format: `${adapter.formats.dayOfMonth}${adapter.formats.monthShort}`,
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'DDMMMM');
  });

  it('should add spaces around `/` when `formatDensity = "spacious"`', () => {
    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      formatDensity: `spacious`,
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'MM / DD / YYYY');

    v7Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(v7Response.getSectionsContainer(), '01 / 01 / 2019');

    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      formatDensity: `spacious`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MM / DD / YYYY');

    v6Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, '01 / 01 / 2019');
  });

  it('should add spaces around `.` when `formatDensity = "spacious"`', () => {
    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.'),
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'MM . DD . YYYY');

    v7Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(v7Response.getSectionsContainer(), '01 . 01 . 2019');

    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.'),
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MM . DD . YYYY');

    v6Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, '01 . 01 . 2019');
  });

  it('should add spaces around `-` when `formatDensity = "spacious"`', () => {
    // Test with v7 input
    const v7Response = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-'),
    });

    expectFieldValueV7(v7Response.getSectionsContainer(), 'MM - DD - YYYY');

    v7Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(v7Response.getSectionsContainer(), '01 - 01 - 2019');

    v7Response.unmount();

    // Test with v6 input
    const v6Response = renderWithProps({
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-'),
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MM - DD - YYYY');

    v6Response.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, '01 - 01 - 2019');
  });
});
