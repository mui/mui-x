import * as React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, expectInputPlaceholder, expectInputValue } from 'test/utils/pickers';
import enUS from 'date-fns/locale/en-US';
import fr from 'date-fns/locale/fr';
import de from 'date-fns/locale/de';
import ru from 'date-fns/locale/ru';
import {
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
} from '@mui/x-date-pickers/tests/describeGregorianAdapter';

describe('<AdapterDateFns />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });

  describe('Adapter localization', () => {
    describe('English', () => {
      const adapter = new AdapterDateFns({ locale: enUS });
      const date = adapter.date(TEST_DATE_ISO_STRING)!;

      it('getWeekdays: should start on Sunday', () => {
        const result = adapter.getWeekdays();
        expect(result).to.deep.equal(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
      });

      it('getWeekArray: should start on Sunday', () => {
        const result = adapter.getWeekArray(date);
        expect(adapter.formatByString(result[0][0], 'EEEEEE')).to.equal('Su');
      });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterDateFns({ locale: ru });

      it('getWeekDays: should start on Monday', () => {
        const result = adapter.getWeekdays();
        expect(result).to.deep.equal(['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']);
      });

      it('getWeekArray: should start on Monday', () => {
        const date = adapter.date(TEST_DATE_ISO_STRING)!;
        const result = adapter.getWeekArray(date);
        expect(adapter.formatByString(result[0][0], 'EEEEEE')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterDateFns({ locale: enUS });
      const adapterRu = new AdapterDateFns({ locale: ru });

      const expectDate = (
        format: keyof AdapterFormats,
        expectedWithEn: string,
        expectedWithRu: string,
      ) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z')!;

        expect(adapter.format(date, format)).to.equal(expectedWithEn);
        expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
      };

      expectDate('fullDate', 'Feb 1, 2020', '1 фев. 2020 г.');
      expectDate(
        'fullDateWithWeekday',
        'Saturday, February 1st, 2020',
        'суббота, 1 февраля 2020 г.',
      );
      expectDate('fullDateTime', 'Feb 1, 2020 11:44 PM', '1 фев. 2020 г. 23:44');
      expectDate('fullDateTime12h', 'Feb 1, 2020 11:44 PM', '1 фев. 2020 г. 11:44 ПП');
      expectDate('fullDateTime24h', 'Feb 1, 2020 23:44', '1 фев. 2020 г. 23:44');
      expectDate('keyboardDate', '02/01/2020', '01.02.2020');
      expectDate('keyboardDateTime', '02/01/2020 11:44 PM', '01.02.2020 23:44');
      expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 ПП');
      expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
    });
  });

  describe('Picker localization', () => {
    const testDate = new Date(2018, 4, 15, 9, 35);
    const localizedTexts = {
      undefined: {
        placeholder: 'MM/DD/YYYY hh:mm aa',
        value: '05/15/2018 09:35 AM',
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

          expectInputPlaceholder(
            screen.getByRole('textbox'),
            localizedTexts[localeKey].placeholder,
          );
        });

        it('should have well formatted value', () => {
          render(<DateTimePicker value={adapter.date(testDate)} />);

          expectInputValue(screen.getByRole('textbox'), localizedTexts[localeKey].value);
        });
      });
    });
  });
});
