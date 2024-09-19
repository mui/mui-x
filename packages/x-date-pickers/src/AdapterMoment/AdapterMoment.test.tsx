import moment, { Moment } from 'moment';
import momentTZ from 'moment-timezone';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterFormats } from '@mui/x-date-pickers/models';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeGregorianAdapter,
  TEST_DATE_ISO_STRING,
  buildFieldInteractions,
} from 'test/utils/pickers';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/ko';

describe('<AdapterMoment />', () => {
  const commonParams = {
    formatDateTime: 'YYYY-MM-DD HH:mm:ss',
    dateLibInstanceWithTimezoneSupport: momentTZ,
    setDefaultTimezone: momentTZ.tz.setDefault,
    getLocaleFromDate: (value: Moment) => value.locale(),
    frenchLocale: 'fr',
  };

  describeGregorianAdapter(AdapterMoment, commonParams);

  // Makes sure that all the tests that do not use timezones works fine when dayjs do not support UTC / timezone.
  describeGregorianAdapter(AdapterMoment, {
    ...commonParams,
    prepareAdapter: (adapter) => {
      // @ts-ignore
      adapter.hasTimezonePlugin = () => false;
      // Makes sure that we don't run timezone related tests, that would not work.
      adapter.isTimezoneCompatible = false;
    },
  });

  describe('Adapter localization', () => {
    describe('English', () => {
      const adapter = new AdapterMoment({ locale: 'en' });
      const date = adapter.date(TEST_DATE_ISO_STRING)!;

      it('getWeekArray: week should start on Monday', () => {
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('Su');
      });

      it('is12HourCycleInCurrentLocale: should have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(true);
      });

      it('parse: should have the right locale', () => {
        expect(adapter.parse('01/01/2020', 'MM/DD/YYYY')!.locale()).to.equal('en');
      });
    });

    describe('Russian', () => {
      const adapter = new AdapterMoment({ locale: 'ru' });
      const date = adapter.date(TEST_DATE_ISO_STRING)!;

      beforeEach(() => {
        moment.locale('ru');
      });

      afterEach(() => {
        moment.locale('en');
      });

      it('getWeekArray: week should start on Monday', () => {
        const result = adapter.getWeekArray(date);
        expect(result[0][0].format('dd')).to.equal('пн');
      });

      it('is12HourCycleInCurrentLocale: should not have meridiem', () => {
        expect(adapter.is12HourCycleInCurrentLocale()).to.equal(false);
      });

      it('getCurrentLocaleCode: should return locale code', () => {
        expect(adapter.getCurrentLocaleCode()).to.equal('ru');
      });

      it('parse: should have the right locale', () => {
        expect(adapter.parse('01/01/2020', 'MM/DD/YYYY')!.locale()).to.equal('ru');
      });
    });

    describe('Korean', () => {
      const adapter = new AdapterMoment({ locale: 'ko' });

      beforeEach(() => {
        moment.locale('ko');
      });

      afterEach(() => {
        moment.locale('en');
      });

      it('parse: should have the right locale', () => {
        expect(adapter.parse('01/01/2020', 'MM/DD/YYYY')!.locale()).to.equal('ko');
      });
    });

    it('Formatting', () => {
      const adapter = new AdapterMoment({ locale: 'en' });
      const adapterRu = new AdapterMoment({ locale: 'ru' });

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
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';

    const localizedTexts = {
      en: {
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
      const localeObject = { code: localeKey };

      describe(`test with the locale "${localeKey}"`, () => {
        const { render, clock, adapter } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'moment',
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

  it('should use moment custom instance if provided', () => {
    const spiedInstance = spy(moment);

    const adapter = new AdapterMoment({ instance: spiedInstance as unknown as typeof moment });
    adapter.date()!;
    expect(spiedInstance.callCount).to.equal(1);
  });
});
