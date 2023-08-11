import * as React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import jMoment from 'moment-jalaali';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { screen } from '@mui/monorepo/test/utils/createRenderer';
import { createPickerRenderer, expectInputPlaceholder, expectInputValue } from 'test/utils/pickers';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { describeJalaliAdapter } from '@mui/x-date-pickers/tests/describeJalaliAdapter';
import 'moment/locale/fa';

describe('<AdapterMomentJalaali />', () => {
  describeJalaliAdapter(AdapterMomentJalaali, {
    before: () => {
      jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
    },
    after: () => {
      moment.locale('en');
    },
  });

  describe('Adapter localization', () => {
    before(() => {
      jMoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });
    });

    after(() => {
      moment.locale('en');
    });

    it('Formatting', () => {
      const adapter = new AdapterMomentJalaali();

      const expectDate = (format: keyof AdapterFormats, expectedWithFaIR: string) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z')!;

        expect(adapter.format(date, format)).to.equal(expectedWithFaIR);
      };

      expectDate('fullDate', '۱۳۹۸، بهمن ۱م');
      expectDate('fullDateWithWeekday', 'شنبه ۱م بهمن ۱۳۹۸');
      expectDate('fullDateTime', '۱۳۹۸، بهمن ۱م، ۱۱:۴۴ ب.ظ');
      expectDate('fullDateTime12h', '۱۲ بهمن ۱۱:۴۴ ب.ظ');
      expectDate('fullDateTime24h', '۱۲ بهمن ۲۳:۴۴');
      expectDate('keyboardDate', '۱۳۹۸/۱۱/۱۲');
      expectDate('keyboardDateTime', '۱۳۹۸/۱۱/۱۲ ۲۳:۴۴');
      expectDate('keyboardDateTime12h', '۱۳۹۸/۱۱/۱۲ ۱۱:۴۴ ب.ظ');
      expectDate('keyboardDateTime24h', '۱۳۹۸/۱۱/۱۲ ۲۳:۴۴');
    });
  });

  describe('Picker localization', () => {
    before(() => {
      jMoment.loadPersian();
    });

    after(() => {
      moment.locale('en');
    });

    const testDate = new Date(2018, 4, 15, 9, 35);
    const localizedTexts = {
      fa: {
        placeholder: 'YYYY/MM/DD hh:mm',
        value: '1397/02/25 09:35',
      },
    };

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
