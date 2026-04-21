import { expectFieldValue, describeAdapters } from 'test/utils/pickers';
import { DateField } from '@mui/x-date-pickers/DateField';

describeAdapters('<DateField /> - Format', DateField, ({ adapter, renderWithProps }) => {
  const { start: startChar, end: endChar } = adapter.escapedCharacters;
  it('should support escaped characters in start separator', () => {
    const view = renderWithProps({
      // For Day.js: "[Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.year}`,
      value: null,
    });
    expectFieldValue(view.getSectionsContainer(), 'Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValue(view.getSectionsContainer(), 'Escaped 2019');
  });

  it('should support escaped characters between sections separator', () => {
    const view = renderWithProps({
      // For Day.js: "MMMM [Escaped] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
      value: null,
    });

    expectFieldValue(view.getSectionsContainer(), 'MMMM Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValue(view.getSectionsContainer(), 'January Escaped 2019');
  });

  // If your start character and end character are equal
  // Then you can't have nested escaped characters
  it.skipIf(startChar === endChar)('should support nested escaped characters', () => {
    const view = renderWithProps({
      // For Day.js: "MMMM [Escaped[] YYYY"
      format: `${adapter.formats.month} ${startChar}Escaped ${startChar}${endChar} ${adapter.formats.year}`,
      value: null,
    });

    expectFieldValue(view.getSectionsContainer(), 'MMMM Escaped [ YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValue(view.getSectionsContainer(), 'January Escaped [ 2019');
  });

  it('should support several escaped parts', () => {
    const view = renderWithProps({
      // For Day.js: "[Escaped] MMMM [Escaped] YYYY"
      format: `${startChar}Escaped${endChar} ${adapter.formats.month} ${startChar}Escaped${endChar} ${adapter.formats.year}`,
      value: null,
    });

    expectFieldValue(view.getSectionsContainer(), 'Escaped MMMM Escaped YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValue(view.getSectionsContainer(), 'Escaped January Escaped 2019');
  });

  it('should support format with only escaped parts', () => {
    const view = renderWithProps({
      // For Day.js: "[Escaped] [Escaped]"
      format: `${startChar}Escaped${endChar} ${startChar}Escaped${endChar}`,
      value: null,
    });

    expectFieldValue(view.getSectionsContainer(), 'Escaped Escaped');
  });

  it('should support format without separators', () => {
    const view = renderWithProps({
      format: `${adapter.formats.dayOfMonth}${adapter.formats.monthShort}`,
    });

    expectFieldValue(view.getSectionsContainer(), 'DDMMMM');
  });

  it('should add spaces around `/` when `formatDensity = "spacious"`', () => {
    const view = renderWithProps({
      formatDensity: `spacious`,
      value: null,
    });

    expectFieldValue(view.getSectionsContainer(), 'MM / DD / YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValue(view.getSectionsContainer(), '01 / 01 / 2019');
  });

  it('should add spaces around `.` when `formatDensity = "spacious"`', () => {
    const view = renderWithProps({
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '.'),
      value: null,
    });

    expectFieldValue(view.getSectionsContainer(), 'MM . DD . YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValue(view.getSectionsContainer(), '01 . 01 . 2019');
  });

  it('should add spaces around `-` when `formatDensity = "spacious"`', () => {
    const view = renderWithProps({
      formatDensity: `spacious`,
      format: adapter.expandFormat(adapter.formats.keyboardDate).replace(/\//g, '-'),
      value: null,
    });

    expectFieldValue(view.getSectionsContainer(), 'MM - DD - YYYY');

    view.setProps({ value: adapter.date('2019-01-01') });
    expectFieldValue(view.getSectionsContainer(), '01 - 01 - 2019');
  });
});
