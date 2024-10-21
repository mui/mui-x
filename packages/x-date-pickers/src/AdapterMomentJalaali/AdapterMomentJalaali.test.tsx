import { expect } from 'chai';
import moment from 'moment';
import jMoment from 'moment-jalaali';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeJalaliAdapter,
  buildFieldInteractions,
} from 'test/utils/pickers';
import { AdapterFormats } from '@mui/x-date-pickers/models';
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

    const testDate = '2018-05-15T09:35:00';
    const localizedTexts = {
      fa: {
        placeholder: 'YYYY/MM/DD hh:mm',
        value: '1397/02/25 09:35',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeObject = { code: localeKey };

      describe(`test with the locale "${localeKey}"`, () => {
        const { render, clock, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'moment-jalaali',
          locale: localeObject,
        });

        const { renderWithProps } = buildFieldInteractions({
          render,
          clock,
          Component: DateTimeField,
        });

        it('should have correct placeholder', () => {
          const view = renderWithProps({ enableAccessibleFieldDOMStructure: true });

          expectFieldValueV7(view.getSectionsContainer(), localizedTexts[localeKey].placeholder);
        });

        it('should have well formatted value', () => {
          const view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            value: adapter.date(testDate),
          });

          expectFieldValueV7(view.getSectionsContainer(), localizedTexts[localeKey].value);
        });
      });
    });
  });
});
