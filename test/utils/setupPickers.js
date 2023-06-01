import dayjs from 'dayjs';
import advancedFormats from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ru';

dayjs.extend(advancedFormats);
dayjs.extend(utc);
dayjs.extend(timezone);
