import { describeGregorianAdapter } from 'test/utils/pickers/describeGregorianAdapter';
import { fr } from 'date-fns-v4/locale';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

// TODO: remove when we migrate to vitest
declare global {
  const vi: {
    mock: any;
  };
}

vi.mock('date-fns/addSeconds', () => import('date-fns-v4/addSeconds'));
vi.mock('date-fns/addMinutes', () => import('date-fns-v4/addMinutes'));
vi.mock('date-fns/addHours', () => import('date-fns-v4/addHours'));
vi.mock('date-fns/addDays', () => import('date-fns-v4/addDays'));
vi.mock('date-fns/addWeeks', () => import('date-fns-v4/addWeeks'));
vi.mock('date-fns/addMonths', () => import('date-fns-v4/addMonths'));
vi.mock('date-fns/addYears', () => import('date-fns-v4/addYears'));
vi.mock('date-fns/endOfDay', () => import('date-fns-v4/endOfDay'));
vi.mock('date-fns/endOfWeek', () => import('date-fns-v4/endOfWeek'));
vi.mock('date-fns/endOfYear', () => import('date-fns-v4/endOfYear'));
vi.mock('date-fns/format', () => import('date-fns-v4/format'));
vi.mock('date-fns/getHours', () => import('date-fns-v4/getHours'));
vi.mock('date-fns/getSeconds', () => import('date-fns-v4/getSeconds'));
vi.mock('date-fns/getMilliseconds', () => import('date-fns-v4/getMilliseconds'));
vi.mock('date-fns/getWeek', () => import('date-fns-v4/getWeek'));
vi.mock('date-fns/getYear', () => import('date-fns-v4/getYear'));
vi.mock('date-fns/getMonth', () => import('date-fns-v4/getMonth'));
vi.mock('date-fns/getDate', () => import('date-fns-v4/getDate'));
vi.mock('date-fns/getDaysInMonth', () => import('date-fns-v4/getDaysInMonth'));
vi.mock('date-fns/getMinutes', () => import('date-fns-v4/getMinutes'));
vi.mock('date-fns/isAfter', () => import('date-fns-v4/isAfter'));
vi.mock('date-fns/isBefore', () => import('date-fns-v4/isBefore'));
vi.mock('date-fns/isEqual', () => import('date-fns-v4/isEqual'));
vi.mock('date-fns/isSameDay', () => import('date-fns-v4/isSameDay'));
vi.mock('date-fns/isSameYear', () => import('date-fns-v4/isSameYear'));
vi.mock('date-fns/isSameMonth', () => import('date-fns-v4/isSameMonth'));
vi.mock('date-fns/isSameHour', () => import('date-fns-v4/isSameHour'));
vi.mock('date-fns/isValid', () => import('date-fns-v4/isValid'));
vi.mock('date-fns/parse', () => import('date-fns-v4/parse'));
vi.mock('date-fns/setDate', () => import('date-fns-v4/setDate'));
vi.mock('date-fns/setHours', () => import('date-fns-v4/setHours'));
vi.mock('date-fns/setMinutes', () => import('date-fns-v4/setMinutes'));
vi.mock('date-fns/setMonth', () => import('date-fns-v4/setMonth'));
vi.mock('date-fns/setSeconds', () => import('date-fns-v4/setSeconds'));
vi.mock('date-fns/setMilliseconds', () => import('date-fns-v4/setMilliseconds'));
vi.mock('date-fns/setYear', () => import('date-fns-v4/setYear'));
vi.mock('date-fns/startOfDay', () => import('date-fns-v4/startOfDay'));
vi.mock('date-fns/startOfMonth', () => import('date-fns-v4/startOfMonth'));
vi.mock('date-fns/endOfMonth', () => import('date-fns-v4/endOfMonth'));
vi.mock('date-fns/startOfWeek', () => import('date-fns-v4/startOfWeek'));
vi.mock('date-fns/startOfYear', () => import('date-fns-v4/startOfYear'));
vi.mock('date-fns/isWithinInterval', () => import('date-fns-v4/isWithinInterval'));
vi.mock('date-fns/locale/en-US', () => import('date-fns-v4/locale/en-US'));

describe('<AdapterDateFnsV3 />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });
});
