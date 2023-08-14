import * as React from 'react';
import { expect } from 'chai';
import { DateTime, Settings } from 'luxon';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import {
  cleanText,
  createPickerRenderer,
  expectInputPlaceholder,
  expectInputValue,
} from 'test/utils/pickers';
import {
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
} from '@mui/x-date-pickers/tests/describeGregorianAdapter';

describe('<AdapterLuxon />', () => {
  describeGregorianAdapter(AdapterLuxon, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: (timezone) => {
      Settings.defaultZone = timezone ?? 'system';
    },
    getLocaleFromDate: (value: DateTime) => value.locale!,
    frenchLocale: 'fr',
  });

  describe('Adapter localization', () => {
    describe('English', () => {
      const adapter = new AdapterLuxon({ locale: 'en-US' });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterLuxon({ locale: 'ru' });

      it('getWeekDays: should start on Monday', () => {
        const result = adapter.getWeekdays();
        expect(result).to.deep.equal(['П', 'В', 'С', 'Ч', 'П', 'С', 'В']);
      });

      it('getWeekArray: should start on Monday', () => {
        const date = adapter.date(TEST_DATE_ISO_STRING)!;
        const result = adapter.getWeekArray(date);
        expect(result[0][0].toFormat('ccc')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterLuxon({ locale: 'en-US' });
      const adapterRu = new AdapterLuxon({ locale: 'ru' });

      const expectDate = (
        format: keyof AdapterFormats,
        expectedWithEn: string,
        expectedWithRu: string,
      ) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z')!;

        expect(cleanText(adapter.format(date, format))).to.equal(expectedWithEn);
        expect(cleanText(adapterRu.format(date, format))).to.equal(expectedWithRu);
      };

      expectDate('fullDate', 'Feb 1, 2020', '1 февр. 2020 г.');
      expectDate('fullDateWithWeekday', 'Saturday, February 1, 2020', 'суббота, 1 февраля 2020 г.');
      expectDate('fullDateTime', 'Feb 1, 2020, 11:44 PM', '1 февр. 2020 г., 23:44');
      expectDate('fullDateTime12h', 'Feb 1, 2020, 11:44 PM', '1 февр. 2020 г., 11:44 PM');
      expectDate('fullDateTime24h', 'Feb 1, 2020, 23:44', '1 февр. 2020 г., 23:44');
      expectDate('keyboardDate', '2/1/2020', '01.02.2020');
      expectDate('keyboardDateTime', '2/1/2020 11:44 PM', '01.02.2020 23:44');
      expectDate('keyboardDateTime12h', '2/1/2020 11:44 PM', '01.02.2020 11:44 PM');
      expectDate('keyboardDateTime24h', '2/1/2020 23:44', '01.02.2020 23:44');
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
      const localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };

      describe(`test with the ${localeName} locale`, () => {
        const { render, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'luxon',
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
