import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import {
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
} from 'test/utils/pickers-utils';
import fr from 'date-fns/locale/fr';
import de from 'date-fns/locale/de';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  undefined: {
    placeholder: 'MM/DD/YYYY hh:mm aa',
    value: '05/15/2018 09:35 am',
  },
  fr: {
    placeholder: 'DD/MM/YYYY hh:mm',
    value: '15/05/2018 09:35',
  },
  de: {
    placeholder: 'DD.MM.YYYY hh:mm',
    value: '15.05.2018 09:35',
  },
};
describe('<AdapterDateFns />', () => {
  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
    const localeObject = localeKey === 'undefined' ? undefined : { fr, de }[localeKey];

    describe(`test with the ${localeName} locale`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'date-fns',
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
    const adapter = new AdapterDateFns({ locale: fr });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(45);
  });
});
