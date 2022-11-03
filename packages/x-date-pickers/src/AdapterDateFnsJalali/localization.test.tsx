import * as React from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer } from 'test/utils/pickers-utils';
import enUS from 'date-fns/locale/en-US';
import faIR from 'date-fns-jalali/locale/fa-IR';
import faJalaliIR from 'date-fns-jalali/locale/fa-jalali-IR';

const testDate = new Date(2018, 4, 15, 9, 35);
const localizedTexts = {
  enUS: {
    placeholder: 'mm/dd/yyyy hh:mm (a|p)m',
    value: '02/25/1397 09:35 AM',
  },
  faIR: {
    placeholder: 'yyyy/mm/dd hh:mm (a|p)m',
    value: '1397/02/25 09:35 ق.ظ.',
  },
  faJalaliIR: {
    // Not sure about what's the difference between this and fa-IR
    placeholder: 'yyyy/mm/dd hh:mm (a|p)m',
    value: '1397/02/25 09:35 ق.ظ.',
  },
};

describe('<AdapterDateFnsJalali />', () => {
  Object.keys(localizedTexts).forEach((localeKey) => {
    const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
    const localeObject =
      localeKey === 'undefined'
        ? undefined
        : {
            faIR,
            faJalaliIR,
            enUS,
          }[localeKey];

    describe(`test with the ${localeName} locale`, () => {
      const { render, adapter } = createPickerRenderer({
        clock: 'fake',
        adapterName: 'date-fns-jalali',
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
});
