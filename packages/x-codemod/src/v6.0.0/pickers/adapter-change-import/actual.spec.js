import DateFnsAdapter from '@date-io/date-fns';
import DateFnsJalaliAdapter from '@date-io/date-fns-jalali';
import DayjsAdapter from '@date-io/dayjs';
import LuxonAdapter from '@date-io/luxon';
import MomentAdapter from '@date-io/moment';
import HijriAdapter from '@date-io/hijri';
import JalaaliAdapter from '@date-io/jalaali';

<>
  <LocalizationProvider dateAdapter={DateFnsAdapter} />
  <LocalizationProvider dateAdapter={DateFnsJalaliAdapter} />
  <LocalizationProvider dateAdapter={DayjsAdapter} />
  <LocalizationProvider dateAdapter={LuxonAdapter} />
  <LocalizationProvider dateAdapter={MomentAdapter} />
  <LocalizationProvider dateAdapter={HijriAdapter} />
  <LocalizationProvider dateAdapter={JalaaliAdapter} />
</>;
