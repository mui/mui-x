import * as React from 'react';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { screen } from '@mui/monorepo/test/utils';
import { createPickerRenderer, expectInputValue, adapterToUse } from 'test/utils/pickers-utils';

describe('<DateField /> - Format', () => {
  const { render } = createPickerRenderer();

  it('should support escaped characters in start separator', () => {
    const { start: startChar, end: endChar } = adapterToUse.escapedCharacters;
    // For Day.js: "[Escaped] YYYY"
    const { setProps } = render(
      <DateField format={`${startChar}Escaped${endChar} ${adapterToUse.formats.year}`} />,
    );
    const input = screen.getByRole('textbox');
    expectInputValue(input, 'Escaped YYYY');

    setProps({ value: adapterToUse.date(new Date(2019, 0, 1)) });
    expectInputValue(input, 'Escaped 2019');
  });

  it('should support escaped characters between sections' + ' separator', () => {
    const { start: startChar, end: endChar } = adapterToUse.escapedCharacters;
    // For Day.js: "MMMM [Escaped] YYYY"
    const { setProps } = render(
      <DateField
        format={`${adapterToUse.formats.month} ${startChar}Escaped${endChar} ${adapterToUse.formats.year}`}
      />,
    );
    const input = screen.getByRole('textbox');
    expectInputValue(input, 'MMMM Escaped YYYY');

    setProps({ value: adapterToUse.date(new Date(2019, 0, 1)) });
    expectInputValue(input, 'January Escaped 2019');
  });

  it('should support nested escaped characters', function test() {
    const { start: startChar, end: endChar } = adapterToUse.escapedCharacters;
    // If your start character and end character are equal
    // Then you can't have nested escaped characters
    if (startChar === endChar) {
      this.skip();
    }

    // For Day.js: "MMMM [Escaped[] YYYY"
    const { setProps } = render(
      <DateField
        format={`${adapterToUse.formats.month} ${startChar}Escaped ${startChar}${endChar} ${adapterToUse.formats.year}`}
      />,
    );
    const input = screen.getByRole('textbox');
    expectInputValue(input, 'MMMM Escaped [ YYYY');

    setProps({ value: adapterToUse.date(new Date(2019, 0, 1)) });
    expectInputValue(input, 'January Escaped [ 2019');
  });
});
