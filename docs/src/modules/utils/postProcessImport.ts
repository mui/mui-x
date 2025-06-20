export type AdapterLibrary =
  | 'date-fns'
  | 'date-fns-jalali'
  | 'dayjs'
  | 'luxon'
  | 'moment'
  | 'moment-hijri'
  | 'moment-jalaali';

export const ADAPTER_TO_LIBRARY: Record<string, AdapterLibrary> = {
  AdapterDateFns: 'date-fns',
  AdapterDateFnsJalali: 'date-fns-jalali',
  AdapterDayjs: 'dayjs',
  AdapterLuxon: 'luxon',
  AdapterMoment: 'moment',
  AdapterMomentHijri: 'moment-hijri',
  AdapterMomentJalaali: 'moment-jalaali',
};

const PICKERS_ADAPTER_REGEX = /^@mui\/(lab|x-date-pickers(?:-pro)?)\/(?<adapterName>Adapter.*)/;

export const postProcessImport = (importName: string): Record<string, string> | null => {
  // for example date-fns
  const dateAdapterMatch = PICKERS_ADAPTER_REGEX.exec(importName);
  if (dateAdapterMatch !== null) {
    /**
     * Mapping from the date adapter sub-packages to the npm packages they require.
     * @example `@mui/x-date-pickers/AdapterDayjs` has a peer dependency on `dayjs`.
     */
    const packageName = ADAPTER_TO_LIBRARY[dateAdapterMatch.groups?.adapterName || ''];
    if (packageName === undefined) {
      throw new TypeError(
        `Can't determine required npm package for adapter '${dateAdapterMatch[1]}'`,
      );
    }
    return {
      // @ts-expect-error, ADAPTER_DEPENDENCIES is replaced at run/build time
      [packageName]: JSON.parse(ADAPTER_DEPENDENCIES)[packageName] ?? 'latest',
    };
  }
  return null;
};
