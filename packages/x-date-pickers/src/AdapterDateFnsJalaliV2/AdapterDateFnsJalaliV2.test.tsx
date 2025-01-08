import { expect } from 'chai';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV2';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeJalaliAdapter,
  buildFieldInteractions,
} from 'test/utils/pickers';
import { enUS, faIR } from 'date-fns-jalali-v2/locale';
import { AdapterFormats } from '@mui/x-date-pickers/models';

vi.mock('date-fns-jalali/addSeconds', () => import('date-fns-jalali-v2/addSeconds'));
vi.mock('date-fns-jalali/addMinutes', () => import('date-fns-jalali-v2/addMinutes'));
vi.mock('date-fns-jalali/addHours', () => import('date-fns-jalali-v2/addHours'));
vi.mock('date-fns-jalali/addDays', () => import('date-fns-jalali-v2/addDays'));
vi.mock('date-fns-jalali/addWeeks', () => import('date-fns-jalali-v2/addWeeks'));
vi.mock('date-fns-jalali/addMonths', () => import('date-fns-jalali-v2/addMonths'));
vi.mock('date-fns-jalali/addYears', () => import('date-fns-jalali-v2/addYears'));
vi.mock('date-fns-jalali/endOfDay', () => import('date-fns-jalali-v2/endOfDay'));
vi.mock('date-fns-jalali/endOfWeek', () => import('date-fns-jalali-v2/endOfWeek'));
vi.mock('date-fns-jalali/endOfYear', () => import('date-fns-jalali-v2/endOfYear'));
vi.mock('date-fns-jalali/format', () => import('date-fns-jalali-v2/format'));
vi.mock('date-fns-jalali/getHours', () => import('date-fns-jalali-v2/getHours'));
vi.mock('date-fns-jalali/getSeconds', () => import('date-fns-jalali-v2/getSeconds'));
vi.mock('date-fns-jalali/getMilliseconds', () => import('date-fns-jalali-v2/getMilliseconds'));
vi.mock('date-fns-jalali/getWeek', () => import('date-fns-jalali-v2/getWeek'));
vi.mock('date-fns-jalali/getYear', () => import('date-fns-jalali-v2/getYear'));
vi.mock('date-fns-jalali/getMonth', () => import('date-fns-jalali-v2/getMonth'));
vi.mock('date-fns-jalali/getDate', () => import('date-fns-jalali-v2/getDate'));
vi.mock('date-fns-jalali/getDaysInMonth', () => import('date-fns-jalali-v2/getDaysInMonth'));
vi.mock('date-fns-jalali/getMinutes', () => import('date-fns-jalali-v2/getMinutes'));
vi.mock('date-fns-jalali/isAfter', () => import('date-fns-jalali-v2/isAfter'));
vi.mock('date-fns-jalali/isBefore', () => import('date-fns-jalali-v2/isBefore'));
vi.mock('date-fns-jalali/isEqual', () => import('date-fns-jalali-v2/isEqual'));
vi.mock('date-fns-jalali/isSameDay', () => import('date-fns-jalali-v2/isSameDay'));
vi.mock('date-fns-jalali/isSameYear', () => import('date-fns-jalali-v2/isSameYear'));
vi.mock('date-fns-jalali/isSameMonth', () => import('date-fns-jalali-v2/isSameMonth'));
vi.mock('date-fns-jalali/isSameHour', () => import('date-fns-jalali-v2/isSameHour'));
vi.mock('date-fns-jalali/isValid', () => import('date-fns-jalali-v2/isValid'));
vi.mock('date-fns-jalali/parse', () => import('date-fns-jalali-v2/parse'));
vi.mock('date-fns-jalali/setDate', () => import('date-fns-jalali-v2/setDate'));
vi.mock('date-fns-jalali/setHours', () => import('date-fns-jalali-v2/setHours'));
vi.mock('date-fns-jalali/setMinutes', () => import('date-fns-jalali-v2/setMinutes'));
vi.mock('date-fns-jalali/setMonth', () => import('date-fns-jalali-v2/setMonth'));
vi.mock('date-fns-jalali/setSeconds', () => import('date-fns-jalali-v2/setSeconds'));
vi.mock('date-fns-jalali/setMilliseconds', () => import('date-fns-jalali-v2/setMilliseconds'));
vi.mock('date-fns-jalali/setYear', () => import('date-fns-jalali-v2/setYear'));
vi.mock('date-fns-jalali/startOfDay', () => import('date-fns-jalali-v2/startOfDay'));
vi.mock('date-fns-jalali/startOfMonth', () => import('date-fns-jalali-v2/startOfMonth'));
vi.mock('date-fns-jalali/endOfMonth', () => import('date-fns-jalali-v2/endOfMonth'));
vi.mock('date-fns-jalali/startOfWeek', () => import('date-fns-jalali-v2/startOfWeek'));
vi.mock('date-fns-jalali/startOfYear', () => import('date-fns-jalali-v2/startOfYear'));
vi.mock('date-fns-jalali/isWithinInterval', () => import('date-fns-jalali-v2/isWithinInterval'));
vi.mock('date-fns-jalali/locale/fa-IR', () => import('date-fns-jalali-v2/locale/fa-IR'));

describe('<AdapterDateFnsJalaliV2 />', () => {
  describeJalaliAdapter(AdapterDateFnsJalali, {});

  describe('Adapter localization', () => {
    it('Formatting', () => {
      const adapter = new AdapterDateFnsJalali();

      const expectDate = (format: keyof AdapterFormats, expectedWithFaIR: string) => {
        const date = adapter.date('2020-02-01T23:44:00.000Z') as Date;

        expect(adapter.format(date, format)).to.equal(expectedWithFaIR);
      };

      expectDate('fullDate', '12-ام بهمن 1398');
      expectDate('keyboardDate', '1398/11/12');
      expectDate('keyboardDateTime', '1398/11/12 11:44 ب.ظ.');
      expectDate('keyboardDateTime12h', '1398/11/12 11:44 ب.ظ.');
      expectDate('keyboardDateTime24h', '1398/11/12 23:44');
    });
  });

  describe('Picker localization', () => {
    const testDate = '2018-05-15T09:35:00';
    const localizedTexts = {
      enUS: {
        placeholder: 'MM/DD/YYYY hh:mm aa',
        value: '02/25/1397 09:35 AM',
      },
      faIR: {
        placeholder: 'YYYY/MM/DD hh:mm aa',
        value: '1397/02/25 09:35 ق.ظ.',
      },
    };

    Object.keys(localizedTexts).forEach((localeKey) => {
      const localeObject = {
        faIR,
        enUS,
      }[localeKey];

      describe(`test with the "${localeKey}" locale`, () => {
        const { render, adapter, clock } = createPickerRenderer({
          clock: 'fake',
          adapterName: 'date-fns-jalali',
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
