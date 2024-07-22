import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { AdapterJsJoda } from '@mui/x-date-pickers/AdapterJsJoda';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';

export type AdapterName =
  | 'date-fns'
  | 'dayjs'
  | 'luxon'
  | 'moment'
  | 'moment-hijri'
  | 'moment-jalaali'
  // | 'js-joda'
  | 'date-fns-jalali';

export const availableAdapters: {
  [key in AdapterName]: new (...args: any) => MuiPickersAdapter<any>;
} = {
  'date-fns': AdapterDateFns,
  dayjs: AdapterDayjs,
  luxon: AdapterLuxon,
  moment: AdapterMoment,
  'moment-hijri': AdapterMomentHijri,
  'moment-jalaali': AdapterMomentJalaali,
  'date-fns-jalali': AdapterDateFnsJalali,
  // 'js-joda': AdapterJsJoda,
};

let AdapterClassToExtend = availableAdapters['date-fns'];

// Check if we are in unit tests
if (/jsdom/.test(window.navigator.userAgent)) {
  // Add parameter `--date-adapter luxon` to use AdapterLuxon for running tests
  // adapter available : date-fns (default one), dayjs, luxon, moment
  const args = process.argv.slice(2);
  const flagIndex = args.findIndex((element) => element === '--date-adapter');
  if (flagIndex !== -1 && flagIndex + 1 < args.length) {
    const potentialAdapter = args[flagIndex + 1];
    if (potentialAdapter) {
      if (availableAdapters[potentialAdapter]) {
        AdapterClassToExtend = availableAdapters[potentialAdapter];
      } else {
        const supportedAdapters = Object.keys(availableAdapters);
        const message = `Error: Invalid --date-adapter value "${potentialAdapter}". Supported date adapters: ${supportedAdapters
          .map((key) => `"${key}"`)
          .join(', ')}`;
        // eslint-disable-next-line no-console
        console.log(message); // log message explicitly, because error message gets swallowed by mocha
        throw new Error(message);
      }
    }
  }
}

export class AdapterClassToUse extends AdapterClassToExtend {}

export const adapterToUse = new AdapterClassToUse();
