import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import fr from 'date-fns/locale/fr';
import de from 'date-fns/locale/de';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  undefined: {
    placeholder: 'mm/dd/yyyy hh:mm (a|p)m',
    value: '05/15/2018 09:35 am',
  },
  fr: {
    placeholder: 'dd/mm/y hh:mm',
    value: '15/05/2018 09:35',
  },
  de: {
    placeholder: 'dd.mm.y hh:mm',
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
    const adapter = new AdapterDateFns({ locale: fr });

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.getWeekNumber!(dateToTest)).to.equal(45);
  });

  it('should return correct day of month with ordinal', () => {
    const adapter = new AdapterDateFns({});

    const dateToTest = adapter.date(new Date(2022, 10, 10));

    expect(adapter.format(dateToTest, 'dayOfMonthWithOrdinal')).to.equal('10th');
  });
});
