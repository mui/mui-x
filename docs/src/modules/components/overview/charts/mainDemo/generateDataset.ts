// Map data from https://github.com/Janpot/npm-versions-tracker to a data set per major version
export type Versions = '5' | '6' | '7' | '8';

const versions = new Set<Versions>(['5', '6', '7', '8']);

export type DataItem = {
  date: Date;
} & Partial<Record<Versions, number | undefined | null>> &
  Partial<Record<`${Versions}_percent`, number | undefined | null>>;

export interface DataFileContent {
  package: string;
  timestamps: number[];
  downloads: Record<string, number[]>;
}

export function generateDataset(data: DataFileContent): DataItem[] {
  const rep: DataItem[] = data.timestamps.map((timestamp) => ({ date: new Date(timestamp) }));

  Object.entries(data.downloads).forEach(([version, values]) => {
    const isUnstable = version.includes('alpha') || version.includes('beta');
    if (
      isUnstable &&
      !(data.package === '@mui/x-date-pickers' && version.startsWith('5.')) && // v5-alpha was the only initial pickers
      !(data.package === '@mui/x-charts' && version.startsWith('6.')) // v6-alpha was the only initial charts
    ) {
      return;
    }

    const major = version.split('.')[0] as Versions;
    values.forEach((nbDownloads, timeIndex) => {
      if (nbDownloads === 0) {
        return;
      }
      rep[timeIndex][major] = (rep[timeIndex][major] ?? 0) + nbDownloads;
    });
  });

  return rep.map((item) => {
    const versionEntries: [string, number][] = Object.entries(item).filter(
      (entry): entry is [Versions, number] =>
        typeof entry[1] === 'number' && versions.has(entry[0] as Versions),
    );

    const total = versionEntries.reduce((a, [, b]) => a + b, 0);

    return {
      ...item,
      ...Object.fromEntries(
        versionEntries.map(([version, value]) => [`${version}_percent`, (100 * value) / total]),
      ),
    };
  });
}
