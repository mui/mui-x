import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import 'moment/locale/fa';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  fa: {
    placeholder: 'yyyy/mm/dd hh:mm',
    value: '۱۳۹۷/۰۲/۲۵ ۰۹:۳۵',
  },
};

describe('<AdapterMomentJalaali />', () => {
  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeObject = { code: localeKey };

    describe(`test with the locale "${localeKey}"`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'moment-jalaali',
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
    const adapter = new AdapterMomentJalaali({ locale: 'fa' });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(34);
  });

  it('should return correct day of month with ordinal', () => {
    const adapter = new AdapterMomentJalaali({ locale: 'fa' });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.format(dateToTest, 'dayOfMonthWithOrdinal')).to.equal('۱۰م');
  });
});
