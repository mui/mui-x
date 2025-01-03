import { expect } from 'chai';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import {
  createPickerRenderer,
  expectFieldValueV7,
  describeJalaliAdapter,
  buildFieldInteractions,
} from 'test/utils/pickers';
import { enUS, faIR } from 'date-fns-jalali-v4/locale';
import { AdapterFormats } from '@mui/x-date-pickers/models';

import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalaliV3';

vi.mock('date-fns-jalali/addSeconds', () => import('date-fns-jalali-v4/addSeconds'));
vi.mock('date-fns-jalali/addMinutes', () => import('date-fns-jalali-v4/addMinutes'));
vi.mock('date-fns-jalali/addHours', () => import('date-fns-jalali-v4/addHours'));
vi.mock('date-fns-jalali/addDays', () => import('date-fns-jalali-v4/addDays'));
vi.mock('date-fns-jalali/addWeeks', () => import('date-fns-jalali-v4/addWeeks'));
vi.mock('date-fns-jalali/addMonths', () => import('date-fns-jalali-v4/addMonths'));
vi.mock('date-fns-jalali/addYears', () => import('date-fns-jalali-v4/addYears'));
vi.mock('date-fns-jalali/endOfDay', () => import('date-fns-jalali-v4/endOfDay'));
vi.mock('date-fns-jalali/endOfWeek', () => import('date-fns-jalali-v4/endOfWeek'));
vi.mock('date-fns-jalali/endOfYear', () => import('date-fns-jalali-v4/endOfYear'));
vi.mock('date-fns-jalali/format', () => import('date-fns-jalali-v4/format'));
vi.mock('date-fns-jalali/getHours', () => import('date-fns-jalali-v4/getHours'));
vi.mock('date-fns-jalali/getSeconds', () => import('date-fns-jalali-v4/getSeconds'));
vi.mock('date-fns-jalali/getMilliseconds', () => import('date-fns-jalali-v4/getMilliseconds'));
vi.mock('date-fns-jalali/getWeek', () => import('date-fns-jalali-v4/getWeek'));
vi.mock('date-fns-jalali/getYear', () => import('date-fns-jalali-v4/getYear'));
vi.mock('date-fns-jalali/getMonth', () => import('date-fns-jalali-v4/getMonth'));
vi.mock('date-fns-jalali/getDate', () => import('date-fns-jalali-v4/getDate'));
vi.mock('date-fns-jalali/getDaysInMonth', () => import('date-fns-jalali-v4/getDaysInMonth'));
vi.mock('date-fns-jalali/getMinutes', () => import('date-fns-jalali-v4/getMinutes'));
vi.mock('date-fns-jalali/isAfter', () => import('date-fns-jalali-v4/isAfter'));
vi.mock('date-fns-jalali/isBefore', () => import('date-fns-jalali-v4/isBefore'));
vi.mock('date-fns-jalali/isEqual', () => import('date-fns-jalali-v4/isEqual'));
vi.mock('date-fns-jalali/isSameDay', () => import('date-fns-jalali-v4/isSameDay'));
vi.mock('date-fns-jalali/isSameYear', () => import('date-fns-jalali-v4/isSameYear'));
vi.mock('date-fns-jalali/isSameMonth', () => import('date-fns-jalali-v4/isSameMonth'));
vi.mock('date-fns-jalali/isSameHour', () => import('date-fns-jalali-v4/isSameHour'));
vi.mock('date-fns-jalali/isValid', () => import('date-fns-jalali-v4/isValid'));
vi.mock('date-fns-jalali/parse', () => import('date-fns-jalali-v4/parse'));
vi.mock('date-fns-jalali/setDate', () => import('date-fns-jalali-v4/setDate'));
vi.mock('date-fns-jalali/setHours', () => import('date-fns-jalali-v4/setHours'));
vi.mock('date-fns-jalali/setMinutes', () => import('date-fns-jalali-v4/setMinutes'));
vi.mock('date-fns-jalali/setMonth', () => import('date-fns-jalali-v4/setMonth'));
vi.mock('date-fns-jalali/setSeconds', () => import('date-fns-jalali-v4/setSeconds'));
vi.mock('date-fns-jalali/setMilliseconds', () => import('date-fns-jalali-v4/setMilliseconds'));
vi.mock('date-fns-jalali/setYear', () => import('date-fns-jalali-v4/setYear'));
vi.mock('date-fns-jalali/startOfDay', () => import('date-fns-jalali-v4/startOfDay'));
vi.mock('date-fns-jalali/startOfMonth', () => import('date-fns-jalali-v4/startOfMonth'));
vi.mock('date-fns-jalali/endOfMonth', () => import('date-fns-jalali-v4/endOfMonth'));
vi.mock('date-fns-jalali/startOfWeek', () => import('date-fns-jalali-v4/startOfWeek'));
vi.mock('date-fns-jalali/startOfYear', () => import('date-fns-jalali-v4/startOfYear'));
vi.mock('date-fns-jalali/isWithinInterval', () => import('date-fns-jalali-v4/isWithinInterval'));
vi.mock('date-fns-jalali/locale/fa-IR', () => import('date-fns-jalali-v4/locale/fa-IR'));

describe('<AdapterDateFnsJalaliV3 />', () => {
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
