import * as React from 'react';
import LineChart from '@mui/charts/LineChart';
import Line from '@mui/charts/Line';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

async function getData() {
  const cachedData = localStorage.getItem('covid-cases');
  if (!cachedData) {
    const response = await fetch(
      'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=england&structure={"date":"date","newCases":"newCasesByPublishDate"}',
    );
    const rawData = await response.json();
    const formattedData = rawData.data.map((record) => ({
      x: Date.parse(record.date),
      y: record.newCases,
    }));

    localStorage.setItem('covid-cases', JSON.stringify({ records: formattedData }));

    return formattedData;
  }

  return JSON.parse(cachedData).records;
}

export default function ZoomableLineChart() {
  const [chartData, setChartData] = React.useState([]);

  const [domain, setDomain] = React.useState(undefined);

  React.useEffect(() => {
    async function loadChartData() {
      const records = (await getData())
        .reverse()
        .map((r) => ({ ...r, x: new Date(r.x) }));
      setChartData(records);
    }

    loadChartData();
  }, []);

  React.useEffect(() => {
    if (chartData?.length) {
      setDomain([
        chartData[0].x.getTime(),
        chartData[chartData.length - 1].x.getTime(),
      ]);
    } else {
      setDomain(undefined);
    }
  }, [chartData]);

  const handleDomainChange = (event, newValue) => {
    setDomain(newValue);
  };

  const domainDate = React.useMemo(() => {
    return domain ? [new Date(domain[0]), new Date(domain[1])] : undefined;
  }, [domain]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Box>
        <LineChart
          data={chartData}
          xScaleType="time"
          xDomain={domainDate}
          label="New COVID cases per day in England"
          margin={{ top: 60 }}
          pixelsPerTick={75}
        >
          <Grid />
          <XAxis />
          <YAxis />
          <Line stroke="rgb(235,97,97)" markerShape="none" />
        </LineChart>
      </Box>
      {domain && (
        <Box sx={{ width: '300px', m: '0 auto' }}>
          <Slider
            valueLabelDisplay="off"
            value={domain}
            onChange={handleDomainChange}
            min={chartData[0].x.getTime()}
            max={chartData[chartData.length - 1].x.getTime()}
            size="small"
            style={{ width: '100%' }}
          />
        </Box>
      )}
    </Stack>
  );
}
