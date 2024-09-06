import { expect } from 'chai';
import { DateTime, Settings } from 'luxon';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import {
  cleanText,
  createPickerRenderer,
  expectFieldValueV7,
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
  buildFieldInteractions,
} from 'test/utils/pickers';

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
      expectDate('keyboardDate', '2/1/2020', '01.02.2020');
      expectDate('keyboardDateTime', '2/1/2020 11:44 PM', '01.02.2020 23:44');
      expectDate('keyboardDateTime12h', '2/1/2020 11:44 PM', '01.02.2020 11:44 PM');
      expectDate('keyboardDateTime24h', '2/1/2020 23:44', '01.02.2020 23:44');
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';
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
        const { render, clock, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'luxon',
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

  describe('Picker token "DD" expansion', () => {
    const testDate = '2018-05-15T09:35:00';
    const localizedTexts = {
      undefined: {
        placeholder: 'MMMM DD, YYYY',
        value: 'May 15, 2018',
      },
      fr: {
        placeholder: 'DD MMMM YYYY',
        value: '15 mai 2018',
      },
      de: {
        placeholder: 'DD. MMMM YYYY',
        value: '15. Mai 2018',
      },
      'pt-BR': {
        placeholder: 'DD de MMMM de YYYY',
        value: '15 de mai. de 2018',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeName = localeKey === 'undefined' ? 'default' : `"${localeKey}"`;
      const localeObject = localeKey === 'undefined' ? undefined : { code: localeKey };

      describe(`test with the ${localeName} locale`, () => {
        const { render, adapter, clock } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'luxon',
          locale: localeObject,
        });

        const { renderWithProps } = buildFieldInteractions({
          render,
          clock,
          Component: DateTimeField,
        });

        it('should have correct placeholder', () => {
          const view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            format: 'DD',
          });

          expectFieldValueV7(view.getSectionsContainer(), localizedTexts[localeKey].placeholder);
        });

        it('should have well formatted value', () => {
          const view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            value: adapter.date(testDate),
            format: 'DD',
          });

          expectFieldValueV7(view.getSectionsContainer(), localizedTexts[localeKey].value);
        });
      });
    });
  });
});
