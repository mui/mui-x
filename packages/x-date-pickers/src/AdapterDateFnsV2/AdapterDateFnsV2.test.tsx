// @ts-nocheck
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import { describeGregorianAdapter } from 'test/utils/pickers/describeGregorianAdapter';
import { fr } from 'date-fns-v2/locale';

// TODO: remove when we migrate to vitest
declare global {
  const vi: {
    mock: any;
  };
}

vi.mock(import('date-fns/addSeconds'), () => import('date-fns-v2/addSeconds'));
vi.mock(import('date-fns/addMinutes'), () => import('date-fns-v2/addMinutes'));
vi.mock(import('date-fns/addHours'), () => import('date-fns-v2/addHours'));
vi.mock(import('date-fns/addDays'), () => import('date-fns-v2/addDays'));
vi.mock(import('date-fns/addWeeks'), () => import('date-fns-v2/addWeeks'));
vi.mock(import('date-fns/addMonths'), () => import('date-fns-v2/addMonths'));
vi.mock(import('date-fns/addYears'), () => import('date-fns-v2/addYears'));
vi.mock(import('date-fns/endOfDay'), () => import('date-fns-v2/endOfDay'));
vi.mock(import('date-fns/endOfWeek'), () => import('date-fns-v2/endOfWeek'));
vi.mock(import('date-fns/endOfYear'), () => import('date-fns-v2/endOfYear'));
vi.mock(import('date-fns/format'), () => import('date-fns-v2/format'));
vi.mock(import('date-fns/getHours'), () => import('date-fns-v2/getHours'));
vi.mock(import('date-fns/getSeconds'), () => import('date-fns-v2/getSeconds'));
vi.mock(import('date-fns/getMilliseconds'), () => import('date-fns-v2/getMilliseconds'));
vi.mock(import('date-fns/getWeek'), () => import('date-fns-v2/getWeek'));
vi.mock(import('date-fns/getYear'), () => import('date-fns-v2/getYear'));
vi.mock(import('date-fns/getMonth'), () => import('date-fns-v2/getMonth'));
vi.mock(import('date-fns/getDate'), () => import('date-fns-v2/getDate'));
vi.mock(import('date-fns/getDaysInMonth'), () => import('date-fns-v2/getDaysInMonth'));
vi.mock(import('date-fns/getMinutes'), () => import('date-fns-v2/getMinutes'));
vi.mock(import('date-fns/isAfter'), () => import('date-fns-v2/isAfter'));
vi.mock(import('date-fns/isBefore'), () => import('date-fns-v2/isBefore'));
vi.mock(import('date-fns/isEqual'), () => import('date-fns-v2/isEqual'));
vi.mock(import('date-fns/isSameDay'), () => import('date-fns-v2/isSameDay'));
vi.mock(import('date-fns/isSameYear'), () => import('date-fns-v2/isSameYear'));
vi.mock(import('date-fns/isSameMonth'), () => import('date-fns-v2/isSameMonth'));
vi.mock(import('date-fns/isSameHour'), () => import('date-fns-v2/isSameHour'));
vi.mock(import('date-fns/isValid'), () => import('date-fns-v2/isValid'));
vi.mock(import('date-fns/parse'), () => import('date-fns-v2/parse'));
vi.mock(import('date-fns/setDate'), () => import('date-fns-v2/setDate'));
vi.mock(import('date-fns/setHours'), () => import('date-fns-v2/setHours'));
vi.mock(import('date-fns/setMinutes'), () => import('date-fns-v2/setMinutes'));
vi.mock(import('date-fns/setMonth'), () => import('date-fns-v2/setMonth'));
vi.mock(import('date-fns/setSeconds'), () => import('date-fns-v2/setSeconds'));
vi.mock(import('date-fns/setMilliseconds'), () => import('date-fns-v2/setMilliseconds'));
vi.mock(import('date-fns/setYear'), () => import('date-fns-v2/setYear'));
vi.mock(import('date-fns/startOfDay'), () => import('date-fns-v2/startOfDay'));
vi.mock(import('date-fns/startOfMonth'), () => import('date-fns-v2/startOfMonth'));
vi.mock(import('date-fns/endOfMonth'), () => import('date-fns-v2/endOfMonth'));
vi.mock(import('date-fns/startOfWeek'), () => import('date-fns-v2/startOfWeek'));
vi.mock(import('date-fns/startOfYear'), () => import('date-fns-v2/startOfYear'));
vi.mock(import('date-fns/isWithinInterval'), () => import('date-fns-v2/isWithinInterval'));
vi.mock(import('date-fns/locale/en-US'), () => import('date-fns-v2/locale/en-US'));
vi.mock(
  'date-fns/_lib/format/longFormatters',
  () => import('test/utils/pickers/longFormattersMock'),
);

describe('<AdapterDateFnsV2 />', () => {
  describeGregorianAdapter(AdapterDateFns, {
    formatDateTime: 'yyyy-MM-dd HH:mm:ss',
    setDefaultTimezone: () => {},
    frenchLocale: fr,
  });
});
