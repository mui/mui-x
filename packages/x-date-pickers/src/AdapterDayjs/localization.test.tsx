import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  undefined: {
    placeholder: 'mm/dd/yyyy hh:mm (a|p)m',
    value: '05/15/2018 09:35 AM',
  },
  fr: {
    placeholder: 'dd/mm/yyyy hh:mm',
    value: '15/05/2018 09:35',
  },
  de: {
    placeholder: 'dd.mm.yyyy hh:mm',
    value: '15.05.2018 09:35',
  },
};
describe('<AdapterDayjs />', () => {
  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
    const localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };

    describe(`test with the ${localeName} locale`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'dayjs',
        locale: localeObject,
      });

      it('should have correct placeholder', () => {
        render(
          <DateTimePicker
            renderInput={(params) => <TextField {...params} />}
            value={null}
            onChange={() => {}}
            disableMaskedInput
          />,
        );

        expect(screen.getByRole('textbox')).to.have.attr(
          'placeholder',
          localizedTexts[localeKey].placeholder,
        );
      });

      it('should have well formatted value', () => {
        render(
          <DateTimePicker
            renderInput={(params) => <TextField {...params} />}
            value={adapter.date(testDate)}
            onChange={() => {}}
            disableMaskedInput
          />,
        );

        expect(screen.getByRole('textbox')).to.have.value(localizedTexts[localeKey].value);
      });
    });
  });

  it('should return the correct week number', () => {
    const adapter = new AdapterDayjs({ locale: 'fr' });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(45);
  });
});
