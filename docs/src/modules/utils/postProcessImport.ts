// eslint-disable-next-line import/no-relative-packages
import pickersPackageJson from '../../../../packages/x-date-pickers/package.json';

export const ADAPTER_TO_LIBRARY: Record<string, keyof typeof pickersPackageJson.devDependencies> = {
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
    return { [packageName]: pickersPackageJson.devDependencies[packageName] ?? 'latest' };
  }
  return null;
};
