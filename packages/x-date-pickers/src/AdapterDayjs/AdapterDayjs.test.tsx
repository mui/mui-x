import dayjs, { Dayjs } from 'dayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { expect } from 'chai';
import {
  expectFieldValueV7,
  createPickerRenderer,
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
  buildFieldInteractions,
} from 'test/utils/pickers';
import 'dayjs/locale/fr';
import 'dayjs/locale/de';
// We import the plugins here just to have the typing
import 'dayjs/plugin/utc';
import 'dayjs/plugin/timezone';

describe('<AdapterDayjs />', () => {
  const commonParams = {
    formatDateTime: 'YYYY-MM-DD HH:mm:ss',
    setDefaultTimezone: dayjs.tz.setDefault,
    getLocaleFromDate: (value: Dayjs) => value.locale(),
    frenchLocale: 'fr',
  };

  describeGregorianAdapter(AdapterDayjs, commonParams);

  // Makes sure that all the tests that do not use timezones works fine when dayjs do not support UTC / timezone.
  describeGregorianAdapter(AdapterDayjs, {
    ...commonParams,
    prepareAdapter: (adapter) => {
      // @ts-ignore
      adapter.hasUTCPlugin = () => false;
      // @ts-ignore
      adapter.hasTimezonePlugin = () => false;
      // Makes sure that we don't run timezone related tests, that would not work.
      adapter.isTimezoneCompatible = false;
    },
  });

  describe('Adapter timezone', () => {
    it('setTimezone: should throw warning if no plugin is available', () => {
      const modifiedAdapter = new AdapterDayjs();
      // @ts-ignore
      modifiedAdapter.hasTimezonePlugin = () => false;

      const date = modifiedAdapter.date(TEST_DATE_ISO_STRING)!;
      expect(() => modifiedAdapter.setTimezone(date, 'Europe/London')).to.throw();
    });
  });

  describe('Adapter localization', () => {
    describe('English', () => {
      const adapter = new AdapterDayjs({ locale: 'en' });
      const date = adapter.date(TEST_DATE_ISO_STRING)!;

      it('getWeekArray: should start on Sunday', () => {
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('Su');
      });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterDayjs({ locale: 'ru' });

      it('getWeekArray: should start on Monday', () => {
        const date = adapter.date(TEST_DATE_ISO_STRING)!;
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterDayjs({ locale: 'en' });
      const adapterRu = new AdapterDayjs({ locale: 'ru' });

      const expectDate = (
        format: keyof AdapterFormats,
        expectedWithEn: string,
        expectedWithRu: string,
      ) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z')!;

        expect(adapter.format(date, format)).to.equal(expectedWithEn);
        expect(adapterRu.format(date, format)).to.equal(expectedWithRu);
      };

      expectDate('fullDate', 'Feb 1, 2020', '1 февр. 2020 г.');
      expectDate('keyboardDate', '02/01/2020', '01.02.2020');
      expectDate('keyboardDateTime', '02/01/2020 11:44 PM', '01.02.2020 23:44');
      expectDate('keyboardDateTime12h', '02/01/2020 11:44 PM', '01.02.2020 11:44 вечера');
      expectDate('keyboardDateTime24h', '02/01/2020 23:44', '01.02.2020 23:44');
    });

    it('should warn when trying to use a non-loaded locale', () => {
      const adapter = new AdapterDayjs({ locale: 'pl' });
      expect(() => adapter.is12HourCycleInCurrentLocale()).toWarnDev(
        'Your locale has not been found.',
      );
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
          adapterName: 'dayjs',
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
