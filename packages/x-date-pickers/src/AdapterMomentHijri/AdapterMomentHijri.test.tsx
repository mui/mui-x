import * as React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { createPickerRenderer, expectInputPlaceholder, expectInputValue } from 'test/utils/pickers';
import { describeHijriAdapter } from '@mui/x-date-pickers/tests/describeHijriAdapter';
import 'moment/locale/ar';

describe('<AdapterMomentHijri />', () => {
  describeHijriAdapter(AdapterMomentHijri, {
    before: () => {
      moment.locale('ar-SA');
    },
    after: () => {
      moment.locale('en');
    },
  });

  describe('Adapter localization', () => {
    it('Formatting', () => {
      const adapter = new AdapterMomentHijri();

      const expectDate = (format: keyof AdapterFormats, expectedWithArSA: string) => {
        const date = adapter.date('2020-01-01T23:44:00.000Z')!;

        expect(adapter.format(date, format)).to.equal(expectedWithArSA);
      };

      expectDate('keyboardDate', '١٤٤١/٠٥/٠٦');
      expectDate('fullDate', '١٤٤١، جمادى الأولى ١');
      expectDate('fullDateWithWeekday', '١٤٤١، جمادى الأولى ١، الأربعاء');
      expectDate('normalDate', 'الأربعاء، ٦ جمادى ١');
      expectDate('shortDate', '٦ جمادى ١');
      expectDate('year', '١٤٤١');
      expectDate('month', 'جمادى الأولى');
      expectDate('monthAndDate', '٦ جمادى الأولى');
      expectDate('weekday', 'الأربعاء');
      expectDate('weekdayShort', 'أربعاء');
      expectDate('dayOfMonth', '٦');
      expectDate('fullTime12h', '١١:٤٤ م');
      expectDate('fullTime24h', '٢٣:٤٤');
      expectDate('hours12h', '١١');
      expectDate('hours24h', '٢٣');
      expectDate('minutes', '٤٤');
      expectDate('seconds', '٠٠');
      expectDate('fullDateTime12h', '٦ جمادى الأولى ١١:٤٤ م');
      expectDate('fullDateTime24h', '٦ جمادى الأولى ٢٣:٤٤');
    });
  });

  describe('Picker localization', () => {
    const testDate = new Date(2018, 4, 15, 9, 35);
    const localizedTexts = {
      ar: {
        placeholder: 'YYYY/MM/DD hh:mm',
        value: '١٤٣٩/٠٨/٢٩ ٠٩:٣٥',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeObject = { code: localeKey };

      describe(`test with the locale "${localeKey}"`, () => {
        const { render, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'moment-hijri',
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
