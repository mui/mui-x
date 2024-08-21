import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { expect } from 'chai';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
  buildFieldInteractions,
} from 'test/utils/pickers';
import { enUS, fr, de, ru } from 'date-fns/locale';

describe('<AdapterDateFns />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });

  describe('Adapter localization', () => {
    describe('Default locale', () => {
      const adapter = new AdapterDateFns();

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('en-US');
      });
    });

    describe('English', () => {
      const adapter = new AdapterDateFns({ locale: enUS });
      const date = adapter.date(TEST_DATE_ISO_STRING)!;

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
      expectDate('keyboardDate', '02/01/2020', '01.02.2020');
      expectDate('keyboardDateTime', '02/01/2020 11:44 PM', '01.02.2020 23:44');
      expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 ПП');
      expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
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
      const localeObject = localeKey === 'undefined' ? undefined : { fr, de }[localeKey];

      describe(`test with the ${localeName} locale`, () => {
        const { render, clock, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'date-fns',
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
