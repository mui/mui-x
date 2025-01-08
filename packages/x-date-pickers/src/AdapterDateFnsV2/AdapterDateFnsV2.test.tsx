import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import { describeGregorianAdapter } from 'test/utils/pickers/describeGregorianAdapter';
import { fr } from 'date-fns-v2/locale';

// TODO: remove when we migrate to vitest
declare global {
  const vi: {
    mock: any;
  };
}

vi.mock('date-fns/addSeconds', () => import('date-fns-v2/addSeconds'));
vi.mock('date-fns/addMinutes', () => import('date-fns-v2/addMinutes'));
vi.mock('date-fns/addHours', () => import('date-fns-v2/addHours'));
vi.mock('date-fns/addDays', () => import('date-fns-v2/addDays'));
vi.mock('date-fns/addWeeks', () => import('date-fns-v2/addWeeks'));
vi.mock('date-fns/addMonths', () => import('date-fns-v2/addMonths'));
vi.mock('date-fns/addYears', () => import('date-fns-v2/addYears'));
vi.mock('date-fns/endOfDay', () => import('date-fns-v2/endOfDay'));
vi.mock('date-fns/endOfWeek', () => import('date-fns-v2/endOfWeek'));
vi.mock('date-fns/endOfYear', () => import('date-fns-v2/endOfYear'));
vi.mock('date-fns/format', () => import('date-fns-v2/format'));
vi.mock('date-fns/getHours', () => import('date-fns-v2/getHours'));
vi.mock('date-fns/getSeconds', () => import('date-fns-v2/getSeconds'));
vi.mock('date-fns/getMilliseconds', () => import('date-fns-v2/getMilliseconds'));
vi.mock('date-fns/getWeek', () => import('date-fns-v2/getWeek'));
vi.mock('date-fns/getYear', () => import('date-fns-v2/getYear'));
vi.mock('date-fns/getMonth', () => import('date-fns-v2/getMonth'));
vi.mock('date-fns/getDate', () => import('date-fns-v2/getDate'));
vi.mock('date-fns/getDaysInMonth', () => import('date-fns-v2/getDaysInMonth'));
vi.mock('date-fns/getMinutes', () => import('date-fns-v2/getMinutes'));
vi.mock('date-fns/isAfter', () => import('date-fns-v2/isAfter'));
vi.mock('date-fns/isBefore', () => import('date-fns-v2/isBefore'));
vi.mock('date-fns/isEqual', () => import('date-fns-v2/isEqual'));
vi.mock('date-fns/isSameDay', () => import('date-fns-v2/isSameDay'));
vi.mock('date-fns/isSameYear', () => import('date-fns-v2/isSameYear'));
vi.mock('date-fns/isSameMonth', () => import('date-fns-v2/isSameMonth'));
vi.mock('date-fns/isSameHour', () => import('date-fns-v2/isSameHour'));
vi.mock('date-fns/isValid', () => import('date-fns-v2/isValid'));
vi.mock('date-fns/parse', () => import('date-fns-v2/parse'));
vi.mock('date-fns/setDate', () => import('date-fns-v2/setDate'));
vi.mock('date-fns/setHours', () => import('date-fns-v2/setHours'));
vi.mock('date-fns/setMinutes', () => import('date-fns-v2/setMinutes'));
vi.mock('date-fns/setMonth', () => import('date-fns-v2/setMonth'));
vi.mock('date-fns/setSeconds', () => import('date-fns-v2/setSeconds'));
vi.mock('date-fns/setMilliseconds', () => import('date-fns-v2/setMilliseconds'));
vi.mock('date-fns/setYear', () => import('date-fns-v2/setYear'));
vi.mock('date-fns/startOfDay', () => import('date-fns-v2/startOfDay'));
vi.mock('date-fns/startOfMonth', () => import('date-fns-v2/startOfMonth'));
vi.mock('date-fns/endOfMonth', () => import('date-fns-v2/endOfMonth'));
vi.mock('date-fns/startOfWeek', () => import('date-fns-v2/startOfWeek'));
vi.mock('date-fns/startOfYear', () => import('date-fns-v2/startOfYear'));
vi.mock('date-fns/isWithinInterval', () => import('date-fns-v2/isWithinInterval'));
vi.mock('date-fns/locale/en-US', () => import('date-fns-v2/locale/en-US'));

describe('<AdapterDateFnsV2 />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });
});
