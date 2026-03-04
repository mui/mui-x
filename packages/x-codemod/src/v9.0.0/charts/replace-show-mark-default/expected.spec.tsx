// @ts-nocheck

<div>
  <LineChart series={[{
    data: [1, 2, 3],
    showMark: true,
  }]} />
  <LineChartPro series={[{
    data: [1, 2, 3],
    showMark: true,
  }]} />
  <LineChartPremium series={[{
    data: [1, 2, 3],
    showMark: true,
  }]} />
  <LineChart series={[{ data: [1, 2, 3], showMark: false }]} />
  <LineChart series={[{
    data: [1, 2, 3],
    showMark: true,
  }, { data: [1, 2, 3], showMark: false }]} />
  <LineChartPro series={[{ data: [1, 2, 3], showMark: false }]} />
  <BarChart series={[{ data: [1, 2, 3] }]} />


  <ChartsDataProvider series={[{
    type: 'line',
    data: [1, 2, 3],
    showMark: true,
  }]} />
  <ChartsDataProviderPro series={[{
    type: 'line',
    data: [1, 2, 3],
    showMark: true,
  }]} />
  <ChartsDataProviderPremium series={[{
    type: 'line',
    data: [1, 2, 3],
    showMark: true,
  }]} />
  <ChartsDataProvider series={[{ type: 'line', data: [1, 2, 3], showMark: false }]} />
  <ChartsDataProvider series={[{
    type: 'line',
    data: [1, 2, 3],
    showMark: true,
  }, { type: 'line', data: [1, 2, 3], showMark: false }]} />
  <ChartsDataProviderPro series={[{ type: 'line', data: [1, 2, 3], showMark: false }]} />
  <ChartsDataProvider series={[{ type: 'bar', data: [1, 2, 3] }, {
    type: 'line',
    data: [1, 2, 3],
    showMark: true,
  }]} />
</div>;
