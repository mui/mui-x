import {
  expectFieldPlaceholderV6,
  expectFieldValueV6,
  expectFieldValueV7,
  getTextbox,
  describeAdapters,
} from 'test/utils/pickers';
import { DateField } from '@mui/x-date-pickers/DateField';
import { testSkipIf } from 'test/utils/skipIf';

describeAdapters('<DateField /> - Format', DateField, ({ adapter, renderWithProps }) => {
  const { start: startChar, end: endChar } = adapter.escapedCharacters;
  it('should support escaped characters in start separator', () => {
    // Test with accessible DOM structure
    let view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "[Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
    });
    expectFieldValueV7(view.getSectionsContainer(), 'Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(view.getSectionsContainer(), 'Escaped 2019');

    view.unmount();

    // Test with non-accessible DOM structure
    view = renderWithProps({
      // For Day.js: "[Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });
    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'Escaped 2019');
  });

  it('should support escaped characters between sections separator', () => {
    // Test with accessible DOM structure
    let view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "MMMM [Escaped] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'MMMM Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(view.getSectionsContainer(), 'January Escaped 2019');

    view.unmount();

    // Test with non-accessible DOM structure
    view = renderWithProps({
      // For Day.js: "MMMM [Escaped] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MMMM Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'January Escaped 2019');
  });

  // If your start character and end character are equal
  // Then you can't have nested escaped characters
  testSkipIf(startChar === endChar)('should support nested escaped characters', () => {
    // Test with accessible DOM structure
    let view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "MMMM [Escaped[] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped ${startChar}${endChar} ${adapter.formats.year}`,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'MMMM Escaped [ YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(view.getSectionsContainer(), 'January Escaped [ 2019');

    view.unmount();

    // Test with non-accessible DOM structure
    view = renderWithProps({
      // For Day.js: "MMMM [Escaped[] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped ${startChar}${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MMMM Escaped [ YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'January Escaped [ 2019');
  });

  it('should support several escaped parts', () => {
    // Test with accessible DOM structure
    let view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'Escaped MMMM Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(view.getSectionsContainer(), 'Escaped January Escaped 2019');

    view.unmount();

    // Test with non-accessible DOM structure
    view = renderWithProps({
      // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'Escaped MMMM Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, 'Escaped January Escaped 2019');
  });

  it('should support format with only escaped parts', () => {
    // Test with accessible DOM structure
    const view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      // For Day.js: "[Escaped] [Escaped]"
      format: `${startChar}Escaped${endChar} ${startChar}Escaped${endChar}`,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'Escaped Escaped');

    view.unmount();

    // Test with non-accessible DOM structure
    renderWithProps({
      // For Day.js: "[Escaped] [Escaped]"
      format: `${startChar}Escaped${endChar} ${startChar}Escaped${endChar}`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'Escaped Escaped');
  });

  it('should support format without separators', () => {
    const view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      format: `${adapter.formats.dayOfMonth}${adapter.formats.monthShort}`,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'DDMMMM');
  });

  it('should add spaces around `/` when `formatDensity = "spacious"`', () => {
    // Test with accessible DOM structure
    let view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      formatDensity: `spacious`,
    });

    expectFieldValueV7(view.getSectionsContainer(), 'MM / DD / YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(view.getSectionsContainer(), '01 / 01 / 2019');

    view.unmount();

    // Test with non-accessible DOM structure
    view = renderWithProps({
      formatDensity: `spacious`,
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MM / DD / YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, '01 / 01 / 2019');
  });

  it('should add spaces around `.` when `formatDensity = "spacious"`', () => {
    // Test with accessible DOM structure
    let view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.'),
    });

    expectFieldValueV7(view.getSectionsContainer(), 'MM . DD . YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(view.getSectionsContainer(), '01 . 01 . 2019');

    view.unmount();

    // Test with non-accessible DOM structure
    view = renderWithProps({
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.'),
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MM . DD . YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, '01 . 01 . 2019');
  });

  it('should add spaces around `-` when `formatDensity = "spacious"`', () => {
    // Test with accessible DOM structure
    let view = renderWithProps({
      enableAccessibleFieldDOMStructure: true,
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-'),
    });

    expectFieldValueV7(view.getSectionsContainer(), 'MM - DD - YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV7(view.getSectionsContainer(), '01 - 01 - 2019');

    view.unmount();

    // Test with non-accessible DOM structure
    view = renderWithProps({
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-'),
      enableAccessibleFieldDOMStructure: false,
    });

    const input = getTextbox();
    expectFieldPlaceholderV6(input, 'MM - DD - YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValueV6(input, '01 - 01 - 2019');
  });
});
