import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';
// The Temporal API is not yet available in every runtime, so install the polyfill globally
// for the picker tests that exercise `AdapterTemporal`.
import 'temporal-polyfill/global';

dayjs.extend(utc);
dayjs.extend(timezone);
