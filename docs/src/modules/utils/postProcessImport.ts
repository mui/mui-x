export const DATE_ADAPTER_VERSIONS: Record<string, string> = {
  'date-fns': '^2.30.0',
  'date-fns-jalali': '^2.30.0-0',
  dayjs: '^1.11.10',
  luxon: '^3.4.4',
  moment: '^2.29.4',
  'moment-hijri': '^2.1.2',
  'moment-jalaali': '^0.10.0',
} as const;

export const ADAPTER_TO_LIBRARY: Record<string, string> = {
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
    return { [packageName]: DATE_ADAPTER_VERSIONS[packageName] ?? 'latest' };
  }
  return null;
};
