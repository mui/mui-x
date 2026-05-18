import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// Regional adapters (moment-hijri, moment-jalaali, date-fns-jalali, dayjs-buddhist)
// drag in large date libraries and are needed only by a handful of tests. They are
// not registered here; tests that use them pass the Adapter class directly via
// `createPickerRenderer({ Adapter })`.
export type AdapterName =
  | 'date-fns'
  | 'dayjs'
  | 'dayjs-buddhist'
  | 'luxon'
  | 'moment'
  | 'moment-hijri'
  | 'moment-jalaali'
  | 'date-fns-jalali';

type AdapterConstructor = new (...args: any) => MuiPickersAdapter;

export const availableAdapters: Partial<Record<AdapterName, AdapterConstructor>> = {
  'date-fns': AdapterDateFns,
  dayjs: AdapterDayjs,
  luxon: AdapterLuxon,
  moment: AdapterMoment,
};

let AdapterClassToExtend: AdapterConstructor = AdapterDateFns;

// Check if we are in unit tests
if (/jsdom/.test(window.navigator.userAgent)) {
  // Add parameter `--date-adapter luxon` to use AdapterLuxon for running tests
  // adapter available : date-fns (default one), dayjs, luxon, moment
  const args = process.argv.slice(2);
  const flagIndex = args.findIndex((element) => element === '--date-adapter');
  if (flagIndex !== -1 && flagIndex + 1 < args.length) {
    const potentialAdapter = args[flagIndex + 1];
    if (potentialAdapter) {
      const constructor = availableAdapters[potentialAdapter as AdapterName];
      if (constructor) {
        AdapterClassToExtend = constructor;
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

export const adapterToUse = new AdapterClassToUse() as MuiPickersAdapter;
