import * as React from 'react';
import { expect } from 'chai';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { createPickerRenderer, expectInputPlaceholder, expectInputValue } from 'test/utils/pickers';
import enUS from 'date-fns/locale/en-US';
import faIR from 'date-fns-jalali/locale/fa-IR';
import faJalaliIR from 'date-fns-jalali/locale/fa-jalali-IR';
import { describeJalaliAdapter } from '@mui/x-date-pickers/tests/describeJalaliAdapter';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { AdapterFormats } from '@mui/x-date-pickers';

describe('<AdapterDateFnsJalali />', () => {
  describeJalaliAdapter(AdapterDateFnsJalali, {});

  describe('Adapter localization', () => {
    it('Formatting', () => {
      const adapter = new AdapterMomentJalaali();

      const expectDate = (format: keyof AdapterFormats, expectedWithFaIR: string) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z')!;

        expect(adapter.format(date, format)).to.equal(expectedWithFaIR);
      };

      expectDate('fullDate', '۱۳۹۸، Bahman ۱م');
      expectDate('fullDateWithWeekday', 'شنبه ۱م Bahman ۱۳۹۸');
      expectDate('fullDateTime', '۱۳۹۸، Bahman ۱م، ۱۱:۴۴ بعد از ظهر');
      expectDate('fullDateTime12h', '۱۲ Bahman ۱۱:۴۴ بعد از ظهر');
      expectDate('fullDateTime24h', '۱۲ Bahman ۲۳:۴۴');
      expectDate('keyboardDate', '۱۳۹۸/۱۱/۱۲');
      expectDate('keyboardDateTime', '۱۳۹۸/۱۱/۱۲ ۲۳:۴۴');
      expectDate('keyboardDateTime12h', '۱۳۹۸/۱۱/۱۲ ۱۱:۴۴ بعد از ظهر');
      expectDate('keyboardDateTime24h', '۱۳۹۸/۱۱/۱۲ ۲۳:۴۴');
    });
  });

  describe('Picker localization', () => {
    const testDate = new Date(2018, 4, 15, 9, 35);
    const localizedTexts = {
      enUS: {
        placeholder: 'MM/DD/YYYY hh:mm aa',
        value: '02/25/1397 09:35 AM',
      },
      faIR: {
        placeholder: 'YYYY/MM/DD hh:mm aa',
        value: '1397/02/25 09:35 ق.ظ.',
      },
      faJalaliIR: {
        // Not sure about what's the difference between this and fa-IR
        placeholder: 'YYYY/MM/DD hh:mm aa',
        value: '1397/02/25 09:35 ق.ظ.',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeObject = {
        faIR,
        faJalaliIR,
        enUS,
      }[localeKey];

      describe(`test with the "${localeKey}" locale`, () => {
        const { render, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'date-fns-jalali',
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
