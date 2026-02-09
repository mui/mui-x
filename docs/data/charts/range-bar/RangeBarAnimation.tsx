import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { HighlightScope } from '@mui/x-charts/context';
import {
  BarChartPremium,
  RangeBarSeries,
} from '@mui/x-charts-premium/BarChartPremium';
import { RangeBarValueType } from '@mui/x-charts-premium/models';

export default function RangeBarAnimation() {
  const [seriesNb, setSeriesNb] = React.useState(2);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };
  const handleSeriesNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setSeriesNb(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <BarChartPremium
        height={300}
        series={series
          .slice(0, seriesNb)
          .map((s) => ({ ...s, data: s.data.slice(0, itemNb) }))}
        skipAnimation={skipAnimation}
        margin={{ left: 0 }}
      />
      <FormControlLabel
        checked={skipAnimation}
        control={
          <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
        }
        label="skipAnimation"
        labelPlacement="end"
      />
      <Typography id="input-item-number" gutterBottom>
        Number of items
      </Typography>
      <Slider
        value={itemNb}
        onChange={handleItemNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={20}
        aria-labelledby="input-item-number"
      />
      <Typography id="input-series-number" gutterBottom>
        Number of series
      </Typography>
      <Slider
        value={seriesNb}
        onChange={handleSeriesNbChange}
        valueLabelDisplay="auto"
        min={1}
        max={10}
        aria-labelledby="input-series-number"
      />
    </Box>
  );
}

const highlightScope: HighlightScope<'rangeBar'> = {
  highlight: 'series',
  fade: 'global',
};

const series = [
  {
    label: 'series 1',
    data: [
      [500, 2423],
      [300, 2210],
      [100, 764],
      [400, 1879],
      [200, 1478],
      [300, 1373],
      [500, 1891],
      [600, 2171],
      [100, 620],
      [300, 1269],
      [200, 724],
      [400, 1707],
      [300, 1188],
      [500, 1879],
      [100, 626],
      [400, 1635],
      [600, 2177],
      [100, 516],
      [500, 1793],
      [400, 1598],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 2',
    data: [
      [600, 2362],
      [500, 2254],
      [400, 1962],
      [300, 1336],
      [100, 586],
      [200, 1069],
      [600, 2194],
      [400, 1629],
      [600, 2173],
      [500, 2031],
      [400, 1757],
      [200, 862],
      [700, 2446],
      [200, 910],
      [700, 2430],
      [600, 2300],
      [200, 805],
      [500, 1835],
      [400, 1684],
      [600, 2197],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 3',
    data: [
      [300, 1145],
      [300, 1214],
      [200, 975],
      [600, 2266],
      [400, 1768],
      [700, 2341],
      [200, 747],
      [300, 1282],
      [500, 1780],
      [400, 1766],
      [600, 2115],
      [400, 1720],
      [300, 1057],
      [500, 2000],
      [400, 1716],
      [600, 2253],
      [100, 619],
      [400, 1626],
      [300, 1209],
      [500, 1786],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 4',
    data: [
      [600, 2361],
      [200, 979],
      [700, 2430],
      [400, 1768],
      [500, 1913],
      [700, 2342],
      [500, 1868],
      [300, 1319],
      [200, 1038],
      [600, 2139],
      [400, 1691],
      [200, 935],
      [600, 2262],
      [400, 1580],
      [100, 692],
      [400, 1559],
      [300, 1344],
      [300, 1442],
      [400, 1593],
      [500, 1889],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 5',
    data: [
      [200, 968],
      [300, 1371],
      [300, 1381],
      [300, 1060],
      [300, 1327],
      [200, 934],
      [500, 1779],
      [300, 1361],
      [200, 878],
      [300, 1055],
      [500, 1737],
      [700, 2380],
      [200, 875],
      [700, 2408],
      [300, 1066],
      [500, 1802],
      [300, 1442],
      [400, 1567],
      [400, 1552],
      [500, 1742],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 6',
    data: [
      [600, 2316],
      [500, 1845],
      [600, 2057],
      [300, 1479],
      [500, 1859],
      [300, 1015],
      [400, 1569],
      [300, 1448],
      [300, 1354],
      [300, 1007],
      [200, 799],
      [500, 1748],
      [300, 1454],
      [500, 1968],
      [300, 1129],
      [300, 1196],
      [600, 2158],
      [100, 540],
      [300, 1482],
      [200, 880],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 7',
    data: [
      [600, 2140],
      [600, 2082],
      [200, 708],
      [600, 2032],
      [100, 554],
      [300, 1365],
      [600, 2121],
      [400, 1639],
      [700, 2430],
      [700, 2440],
      [200, 814],
      [300, 1328],
      [200, 883],
      [500, 1811],
      [600, 2322],
      [500, 1743],
      [200, 700],
      [600, 2131],
      [300, 1473],
      [200, 957],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 8',
    data: [
      [300, 1074],
      [200, 744],
      [700, 2487],
      [200, 823],
      [600, 2252],
      [600, 2317],
      [600, 2139],
      [500, 1818],
      [600, 2256],
      [500, 1769],
      [300, 1123],
      [300, 1461],
      [100, 672],
      [300, 1335],
      [200, 960],
      [500, 1871],
      [600, 2305],
      [300, 1231],
      [600, 2005],
      [200, 908],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 9',
    data: [
      [500, 1792],
      [200, 886],
      [700, 2472],
      [400, 1546],
      [600, 2164],
      [600, 2323],
      [700, 2435],
      [300, 1268],
      [600, 2368],
      [600, 2158],
      [600, 2200],
      [300, 1316],
      [100, 552],
      [500, 1874],
      [500, 1771],
      [300, 1038],
      [500, 1838],
      [600, 2029],
      [500, 1793],
      [300, 1117],
    ] satisfies RangeBarValueType[],
  },
  {
    label: 'series 10',
    data: [
      [300, 1433],
      [300, 1161],
      [300, 1107],
      [400, 1517],
      [300, 1410],
      [300, 1058],
      [100, 676],
      [300, 1280],
      [500, 1936],
      [500, 1774],
      [100, 698],
      [500, 1721],
      [300, 1421],
      [200, 785],
      [500, 1752],
      [200, 800],
      [200, 990],
      [500, 1809],
      [500, 1985],
      [100, 665],
    ] satisfies RangeBarValueType[],
  },
].map((s) => ({ type: 'rangeBar', ...s, highlightScope }) satisfies RangeBarSeries);
