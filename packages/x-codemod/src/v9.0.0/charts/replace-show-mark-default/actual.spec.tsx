// @ts-nocheck

<div>
  <LineChart series={[{ data: [1, 2, 3] }]} />
  <LineChartPro series={[{ data: [1, 2, 3] }]} />
  <LineChartPremium series={[{ data: [1, 2, 3] }]} />
  <LineChart series={[{ data: [1, 2, 3], showMark: false }]} />
  <LineChart series={[{ data: [1, 2, 3] }, { data: [1, 2, 3], showMark: false }]} />
  <LineChartPro series={[{ data: [1, 2, 3], showMark: false }]} />
  <BarChart series={[{ data: [1, 2, 3] }]} />


  <ChartsDataProvider series={[{ type: 'line', data: [1, 2, 3] }]} />
  <ChartsDataProviderPro series={[{ type: 'line', data: [1, 2, 3] }]} />
  <ChartsDataProviderPremium series={[{ type: 'line', data: [1, 2, 3] }]} />
  <ChartsDataProvider series={[{ type: 'line', data: [1, 2, 3], showMark: false }]} />
  <ChartsDataProvider series={[{ type: 'line', data: [1, 2, 3] }, { type: 'line', data: [1, 2, 3], showMark: false }]} />
  <ChartsDataProviderPro series={[{ type: 'line', data: [1, 2, 3], showMark: false }]} />
  <ChartsDataProvider series={[{ type: 'bar', data: [1, 2, 3] }, { type: 'line', data: [1, 2, 3] }]} />
</div>;
