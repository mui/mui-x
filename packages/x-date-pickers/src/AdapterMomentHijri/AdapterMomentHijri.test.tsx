import moment, { Moment } from 'moment-hijri';
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
import 'moment/locale/ar-sa';
import { beforeAll } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';

describe('<AdapterMomentHijri />', () => {
  beforeAll(() => {
    if (!isJSDOM) {
      // Vitest browser mode does not correctly load the locale
      // This is the minimal amount of locale data needed to run the tests
      moment.updateLocale('ar-sa', {
        weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
        weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
        meridiem: (hour) => (hour < 12 ? 'ص' : 'م'),
        postformat: (input) =>
          input.replace(/\d/g, (match) => '٠١٢٣٤٥٦٧٨٩'[match]).replace(/,/g, '،'),
      });
    }
  });

  describeHijriAdapter(AdapterMomentHijri, {
    before: () => {
      moment.locale('ar-sa');
    },
    after: () => {
      moment.locale('en');
    },
  });

  describe('Adapter localization', () => {
    it('Formatting', () => {
      const adapter = new AdapterMomentHijri();

      const expectDate = (format: keyof AdapterFormats, expectedWithArSA: string) => {
        const date = adapter.date('2020-01-01T23:44:00.000Z') as Moment;

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
        const { render, adapter } = createPickerRenderer({
          adapterName: 'moment-hijri',
          locale: localeObject,
        });

        const { renderWithProps } = buildFieldInteractions({
          render,
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
