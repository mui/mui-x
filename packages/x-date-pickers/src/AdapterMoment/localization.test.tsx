import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import 'moment/locale/de';
import 'moment/locale/fr';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  en: {
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
describe('<AdapterMoment />', () => {
  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeObject = { code: localeKey };

    describe(`test with the locale "${localeKey}"`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'moment',
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
    const adapter = new AdapterMoment({ locale: 'fr' });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(45);
  });

  it('should return correct day of month with ordinal', () => {
    const adapter = new AdapterMoment({ locale: 'de' });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.format(dateToTest, 'dayOfMonthWithOrdinal')).to.equal('10.');
  });
});
