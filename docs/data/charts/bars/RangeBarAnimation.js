import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

export default function RangeBarAnimation() {
  const [seriesNb, setSeriesNb] = React.useState(2);
  const [itemNb, setItemNb] = React.useState(5);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

  const handleItemNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setItemNb(newValue);
  };
  const handleSeriesNbChange = (event, newValue) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setSeriesNb(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <BarChartPro
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

const highlightScope = {
  highlight: 'series',
  fade: 'global',
};

const series = [
  {
    label: 'series 1',
    data: [
      { start: 500, end: 2423 },
      { start: 300, end: 2210 },
      { start: 100, end: 764 },
      { start: 400, end: 1879 },
      { start: 200, end: 1478 },
      { start: 300, end: 1373 },
      { start: 500, end: 1891 },
      { start: 600, end: 2171 },
      { start: 100, end: 620 },
      { start: 300, end: 1269 },
      { start: 200, end: 724 },
      { start: 400, end: 1707 },
      { start: 300, end: 1188 },
      { start: 500, end: 1879 },
      { start: 100, end: 626 },
      { start: 400, end: 1635 },
      { start: 600, end: 2177 },
      { start: 100, end: 516 },
      { start: 500, end: 1793 },
      { start: 400, end: 1598 },
    ],
  },
  {
    label: 'series 2',
    data: [
      { start: 600, end: 2362 },
      { start: 500, end: 2254 },
      { start: 400, end: 1962 },
      { start: 300, end: 1336 },
      { start: 100, end: 586 },
      { start: 200, end: 1069 },
      { start: 600, end: 2194 },
      { start: 400, end: 1629 },
      { start: 600, end: 2173 },
      { start: 500, end: 2031 },
      { start: 400, end: 1757 },
      { start: 200, end: 862 },
      { start: 700, end: 2446 },
      { start: 200, end: 910 },
      { start: 700, end: 2430 },
      { start: 600, end: 2300 },
      { start: 200, end: 805 },
      { start: 500, end: 1835 },
      { start: 400, end: 1684 },
      { start: 600, end: 2197 },
    ],
  },
  {
    label: 'series 3',
    data: [
      { start: 300, end: 1145 },
      { start: 300, end: 1214 },
      { start: 200, end: 975 },
      { start: 600, end: 2266 },
      { start: 400, end: 1768 },
      { start: 700, end: 2341 },
      { start: 200, end: 747 },
      { start: 300, end: 1282 },
      { start: 500, end: 1780 },
      { start: 400, end: 1766 },
      { start: 600, end: 2115 },
      { start: 400, end: 1720 },
      { start: 300, end: 1057 },
      { start: 500, end: 2000 },
      { start: 400, end: 1716 },
      { start: 600, end: 2253 },
      { start: 100, end: 619 },
      { start: 400, end: 1626 },
      { start: 300, end: 1209 },
      { start: 500, end: 1786 },
    ],
  },
  {
    label: 'series 4',
    data: [
      { start: 600, end: 2361 },
      { start: 200, end: 979 },
      { start: 700, end: 2430 },
      { start: 400, end: 1768 },
      { start: 500, end: 1913 },
      { start: 700, end: 2342 },
      { start: 500, end: 1868 },
      { start: 300, end: 1319 },
      { start: 200, end: 1038 },
      { start: 600, end: 2139 },
      { start: 400, end: 1691 },
      { start: 200, end: 935 },
      { start: 600, end: 2262 },
      { start: 400, end: 1580 },
      { start: 100, end: 692 },
      { start: 400, end: 1559 },
      { start: 300, end: 1344 },
      { start: 300, end: 1442 },
      { start: 400, end: 1593 },
      { start: 500, end: 1889 },
    ],
  },
  {
    label: 'series 5',
    data: [
      { start: 200, end: 968 },
      { start: 300, end: 1371 },
      { start: 300, end: 1381 },
      { start: 300, end: 1060 },
      { start: 300, end: 1327 },
      { start: 200, end: 934 },
      { start: 500, end: 1779 },
      { start: 300, end: 1361 },
      { start: 200, end: 878 },
      { start: 300, end: 1055 },
      { start: 500, end: 1737 },
      { start: 700, end: 2380 },
      { start: 200, end: 875 },
      { start: 700, end: 2408 },
      { start: 300, end: 1066 },
      { start: 500, end: 1802 },
      { start: 300, end: 1442 },
      { start: 400, end: 1567 },
      { start: 400, end: 1552 },
      { start: 500, end: 1742 },
    ],
  },
  {
    label: 'series 6',
    data: [
      { start: 600, end: 2316 },
      { start: 500, end: 1845 },
      { start: 600, end: 2057 },
      { start: 300, end: 1479 },
      { start: 500, end: 1859 },
      { start: 300, end: 1015 },
      { start: 400, end: 1569 },
      { start: 300, end: 1448 },
      { start: 300, end: 1354 },
      { start: 300, end: 1007 },
      { start: 200, end: 799 },
      { start: 500, end: 1748 },
      { start: 300, end: 1454 },
      { start: 500, end: 1968 },
      { start: 300, end: 1129 },
      { start: 300, end: 1196 },
      { start: 600, end: 2158 },
      { start: 100, end: 540 },
      { start: 300, end: 1482 },
      { start: 200, end: 880 },
    ],
  },
  {
    label: 'series 7',
    data: [
      { start: 600, end: 2140 },
      { start: 600, end: 2082 },
      { start: 200, end: 708 },
      { start: 600, end: 2032 },
      { start: 100, end: 554 },
      { start: 300, end: 1365 },
      { start: 600, end: 2121 },
      { start: 400, end: 1639 },
      { start: 700, end: 2430 },
      { start: 700, end: 2440 },
      { start: 200, end: 814 },
      { start: 300, end: 1328 },
      { start: 200, end: 883 },
      { start: 500, end: 1811 },
      { start: 600, end: 2322 },
      { start: 500, end: 1743 },
      { start: 200, end: 700 },
      { start: 600, end: 2131 },
      { start: 300, end: 1473 },
      { start: 200, end: 957 },
    ],
  },
  {
    label: 'series 8',
    data: [
      { start: 300, end: 1074 },
      { start: 200, end: 744 },
      { start: 700, end: 2487 },
      { start: 200, end: 823 },
      { start: 600, end: 2252 },
      { start: 600, end: 2317 },
      { start: 600, end: 2139 },
      { start: 500, end: 1818 },
      { start: 600, end: 2256 },
      { start: 500, end: 1769 },
      { start: 300, end: 1123 },
      { start: 300, end: 1461 },
      { start: 100, end: 672 },
      { start: 300, end: 1335 },
      { start: 200, end: 960 },
      { start: 500, end: 1871 },
      { start: 600, end: 2305 },
      { start: 300, end: 1231 },
      { start: 600, end: 2005 },
      { start: 200, end: 908 },
    ],
  },
  {
    label: 'series 9',
    data: [
      { start: 500, end: 1792 },
      { start: 200, end: 886 },
      { start: 700, end: 2472 },
      { start: 400, end: 1546 },
      { start: 600, end: 2164 },
      { start: 600, end: 2323 },
      { start: 700, end: 2435 },
      { start: 300, end: 1268 },
      { start: 600, end: 2368 },
      { start: 600, end: 2158 },
      { start: 600, end: 2200 },
      { start: 300, end: 1316 },
      { start: 100, end: 552 },
      { start: 500, end: 1874 },
      { start: 500, end: 1771 },
      { start: 300, end: 1038 },
      { start: 500, end: 1838 },
      { start: 600, end: 2029 },
      { start: 500, end: 1793 },
      { start: 300, end: 1117 },
    ],
  },
  {
    label: 'series 10',
    data: [
      { start: 300, end: 1433 },
      { start: 300, end: 1161 },
      { start: 300, end: 1107 },
      { start: 400, end: 1517 },
      { start: 300, end: 1410 },
      { start: 300, end: 1058 },
      { start: 100, end: 676 },
      { start: 300, end: 1280 },
      { start: 500, end: 1936 },
      { start: 500, end: 1774 },
      { start: 100, end: 698 },
      { start: 500, end: 1721 },
      { start: 300, end: 1421 },
      { start: 200, end: 785 },
      { start: 500, end: 1752 },
      { start: 200, end: 800 },
      { start: 200, end: 990 },
      { start: 500, end: 1809 },
      { start: 500, end: 1985 },
      { start: 100, end: 665 },
    ],
  },
].map((s) => ({ type: 'rangeBar', ...s, highlightScope }));
