import * as React from 'react';
import jMoment from 'moment-jalaali';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import {
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
} from 'test/utils/pickers-utils';
import 'moment/locale/fa';
import moment from 'moment';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  fa: {
    placeholder: 'YYYY/MM/DD hh:mm',
    value: '1397/02/25 09:35',
  },
};

describe('<AdapterMomentJalaali />', () => {
  before(() => {
    jMoment.loadPersian();
  });

  after(() => {
    moment.locale('en');
  });

  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeObject = { code: localeKey };

    describe(`test with the locale "${localeKey}"`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'moment-jalaali',
        locale: localeObject,
      });

      it('should have correct placeholder', () => {
        render(<DateTimePicker />);

        expectInputPlaceholder(screen.getByRole('textbox'), localizedTexts[localeKey].placeholder);
      });

      it('should have well formatted value', () => {
        render(<DateTimePicker value={adapter.date(testDate)} />);

        expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].value);
      });
    });
  });

  it('should return the correct week number', () => {
    const adapter = new AdapterMomentJalaali();

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(34);
  });
});
