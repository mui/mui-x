// Data from https://finance.yahoo.com/quote/NFLX/financials/

const translations = {
  totAss: 'Total Assets',
  currAss: 'Current Assets',
  nCurrAss: 'non-Current Assets',
  totLia: 'Total Liabilities',
  curLia: 'Current Liabilities',
  nCurLia: 'non-Current Liabilities',
  totEq: 'Total Equity',
  capStock: 'Capital Stock',
  retEarn: 'Retained Earning',
  treas: 'Treasury',
  nonAffect: 'non Affected',
} as const;

export function addLabels<T extends { dataKey: keyof typeof translations }>(series: T[]) {
  return series.map((item) => ({
    ...item,
    label: translations[item.dataKey],
    valueFormatter: (v: number | null) => (v ? `$ ${v.toLocaleString()}k` : '-'),
  }));
}

export const balanceSheet = [
  {
    year: '2020',
    totAss: 39280359,
    currAss: 9761580,
    nCurrAss: 29518779,
    totLia: 28215119,
    curLia: 7805785,
    nCurLia: 20409334,
    totEq: 11065240,
    capStock: 3447698,
    retEarn: 7573144,
    treas: null,
    nonAffect: 44398,
  },
  {
    year: '2021',
    totAss: 44584663,
    currAss: 8069825,
    nCurrAss: 36514838,
    totLia: 28735415,
    curLia: 8488966,
    nCurLia: 20246449,
    totEq: 15849248,
    capStock: 4024561,
    retEarn: 12689372,
    treas: 824190,
    nonAffect: -40495,
  },
  {
    year: '2022',
    totAss: 48594768,
    currAss: 9266473,
    nCurrAss: 39328295,
    totLia: 27817367,
    curLia: 7930974,
    nCurLia: 19886393,
    totEq: 20777401,
    capStock: 4637601,
    retEarn: 17181296,
    treas: 824190,
    nonAffect: -217306,
  },
  {
    year: '2023',
    totAss: 48731992,
    currAss: 9918133,
    nCurrAss: 38813859,
    totLia: 28143679,
    curLia: 8860655,
    nCurLia: 19283024,
    totEq: 20588313,
    capStock: 5145172,
    retEarn: 22589286,
    treas: 6922200,
    nonAffect: -223945,
  },
];
