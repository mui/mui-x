import moment from 'moment';
import { expect } from 'chai';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeHijriAdapter,
  buildFieldInteractions,
} from 'test/utils/pickers';
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
      expectDate('normalDate', 'الأربعاء، ٦ جمادى ١');
      expectDate('shortDate', '٦ جمادى ١');
      expectDate('year', '١٤٤١');
      expectDate('month', 'جمادى الأولى');
      expectDate('weekday', 'الأربعاء');
      expectDate('weekdayShort', 'أربعاء');
      expectDate('dayOfMonth', '٦');
      expectDate('fullTime12h', '١١:٤٤ م');
      expectDate('fullTime24h', '٢٣:٤٤');
      expectDate('hours12h', '١١');
      expectDate('hours24h', '٢٣');
      expectDate('minutes', '٤٤');
      expectDate('seconds', '٠٠');
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';
    const localizedTexts = {
      ar: {
        placeholder: 'YYYY/MM/DD hh:mm',
        value: '١٤٣٩/٠٨/٢٩ ٠٩:٣٥',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeObject = { code: localeKey };

      describe(`test with the locale "${localeKey}"`, () => {
        const { render, clock, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'moment-hijri',
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
