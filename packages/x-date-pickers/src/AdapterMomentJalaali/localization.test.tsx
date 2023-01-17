import * as React from 'react';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, expectInputValue } from 'test/utils/pickers-utils';
import 'moment/locale/fa';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  fa: {
    placeholder: 'YYYY/MM/DD hh:mm',
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
        render(<NextDateTimePicker />);

        expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].placeholder, true);
      });

      it('should have well formatted value', () => {
        render(<NextDateTimePicker value={adapter.date(testDate)} />);

        expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].value, true);
      });
    });
  });

  it('should return the correct week number', () => {
    const adapter = new AdapterMomentJalaali();

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(34);
  });
});
