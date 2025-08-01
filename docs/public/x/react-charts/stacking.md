---
title: Charts - Stacking
productId: x-charts
---

# Charts - Stacking

Stacking allows displaying the decomposition of values.

## Basics

Bar and line charts allow stacking series.
To stack series together, you need to pass them a `stack` attribute.
Series with the same `stack` value will get stacked together.

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const seriesA = {
  data: [2, 3, 1, 4, 5],
  label: 'Series A',
};
const seriesB = {
  data: [3, 1, 4, 2, 1],
  label: 'Series B',
};
const seriesC = {
  data: [3, 2, 4, 5, 1],
  label: 'Series C',
};
export default function BasicStacking() {
  return (
    <BarChart
      height={300}
      series={[
        { ...seriesA, stack: 'total' },
        { ...seriesB, stack: 'total' },
        { ...seriesC, stack: 'total' },
      ]}
    />
  );
}

```

## Stacking strategy

Based on D3 [stack orders](https://github.com/d3/d3-shape#stack-orders) and [stack offsets](https://github.com/d3/d3-shape#stack-offsets) you can modify how series are stacked.

To pass those attributes, use series properties `stackOffset` (default `'diverging'` for bar and `'none'` for line) and `stackOrder` (default `'none'`).
You can define them for only one of the series of a stack group.

### Stack offset

If you just want to stack values, the `stackOffset` set to `'none'` should do the job.

However, with negative values, you should use `'diverging'`.
Otherwise, the stacked rectangle will overlap.

To show series evolution relative to other stacked series (instead of their absolute values), you can use `'expand'`.

| Value         | Description                                               |
| :------------ | :-------------------------------------------------------- |
| `'none'`      | Set baseline at 0 and stack data on top of each other.    |
| `'expand'`    | Set baseline at zero and scale data to end up at 1.       |
| `'diverging'` | Stack positive value above zero and negative value below. |

The next demonstration allows testing the different `stackOffset` values.

To see how they interact with a dataset containing negative values, you can toggle "data has negative values" switch.
When turned on, the series will have the following composition:

- series A has only positive values.
- series B has one negative value.
- series C and D have only negative values.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { BarChart } from '@mui/x-charts/BarChart';
import { StackOffsetType } from '@mui/x-charts/models';

type GetSeriesParams = {
  hasNegativeValue: boolean;
  stackOffset: StackOffsetType;
};

const availableStackOffset = ['expand', 'diverging', 'none'] as const;

const getSeries = ({ hasNegativeValue, stackOffset }: GetSeriesParams) => [
  {
    label: 'A',
    data: [125, 450, 492, 625],
    stack: 'total',
    stackOffset,
  },
  {
    label: 'B',
    data: [50, hasNegativeValue ? -150 : 150, 203, 620],
    stack: 'total',
  },
  {
    label: 'C',
    data: [134, 215, 342, 402].map((y) => (hasNegativeValue ? -y : y)),
    stack: 'total',
  },
  {
    label: 'D',
    data: [315, 421, 289, 321].map((y) => (hasNegativeValue ? -y : y)),
    stack: 'total',
  },
];

export default function StackOffsetDemo() {
  const [stackOffset, setStackOffset] = React.useState<StackOffsetType>('none');

  const [hasNegativeValue, setHasNegativeValue] = React.useState(true);

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Stack direction="row">
        <TextField
          sx={{ minWidth: 150, mr: 5 }}
          select
          label="stackOffset"
          value={stackOffset}
          onChange={(event) => setStackOffset(event.target.value as any)}
        >
          {availableStackOffset.map((offset) => (
            <MenuItem key={offset} value={offset}>
              {offset}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          checked={hasNegativeValue}
          onChange={(event) => setHasNegativeValue((event.target as any).checked)}
          control={<Switch color="primary" />}
          label="data has negative value"
          labelPlacement="end"
        />
      </Stack>
      <BarChart height={300} series={getSeries({ hasNegativeValue, stackOffset })} />
    </Box>
  );
}

```

### Stack order

The order of stacked data matters for the reading of charts.
The evolution of the series at the bottom is the easiest to read since its baseline is 0.

If you know the data you are displaying, you can use `'none'` which respects the order you defined the series in.
Otherwise, it might be interesting to order them according to their properties.

With `'appearance'`, the position of the maximal series value is taken into consideration.

With `'ascending'` and `'descending'`, the sum of values is taken into consideration.
Which corresponds to the area taken by the series on the chart.

| Value          | Description                                                                                                                               |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `'none'`       | Respect the order the series are provided in.                                                                                             |
| `'reverse'`    | Reverse the order the series are provided in.                                                                                             |
| `'appearance'` | Sort series by ascending order according to the index of their maximal value. The series with the earliest maximum will be at the bottom. |
| `'ascending'`  | Sort series by ascending order according to the sum of their values. Series taking the smallest surface will be at the bottom             |
| `'descending'` | Sort series by descending order according to the sum of their values. Series taking the largest surface will be at the bottom             |

To experiment with stack orders, here are statistics about the transport used to go to the office depending on the distance between home and office.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { BarChart } from '@mui/x-charts/BarChart';
import { StackOrderType } from '@mui/x-charts/models';

// Data coming from https://www.insee.fr/fr/statistiques/5013868
const commonTransportation = [
  6.5, 12.5, 17.2, 19.6, 20.1, 20.0, 19.5, 18.8, 18.2, 17.3, 16.4, 15.9, 15.2, 14.7,
  14.3, 14.3, 14.3, 14.1, 14.2, 14.2, 14.0, 13.8, 13.8, 13.9, 13.6, 14.0, 14.9, 14.8,
  15.2, 21.1,
];
const car = [
  48.8, 56.3, 63.2, 67.3, 70.2, 72.3, 74.1, 75.8, 76.9, 78.4, 79.7, 80.5, 81.5, 82.4,
  83.0, 83.1, 83.2, 83.6, 83.6, 83.8, 83.9, 84.3, 84.4, 84.4, 84.6, 84.4, 83.6, 83.9,
  83.6, 77.6,
];
const motorcycle = [
  1.3, 2.1, 2.5, 2.6, 2.7, 2.7, 2.6, 2.6, 2.6, 2.5, 2.5, 2.3, 2.2, 2.1, 1.9, 1.9,
  1.8, 1.7, 1.6, 1.6, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.0, 0.9, 0.8, 0.7,
];
const biking = [
  4.0, 5.9, 5.8, 5.0, 4.0, 3.1, 2.4, 1.8, 1.5, 1.2, 0.9, 0.8, 0.7, 0.5, 0.5, 0.4,
  0.4, 0.3, 0.3, 0.2, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.1, 0.3,
];
const walking = [
  39.4, 23.2, 11.3, 5.5, 3.0, 1.9, 1.4, 1.0, 0.8, 0.6, 0.5, 0.5, 0.4, 0.3, 0.3, 0.3,
  0.3, 0.3, 0.3, 0.2, 0.2, 0.2, 0.3, 0.2, 0.3, 0.2, 0.3, 0.3, 0.3, 0.3,
];
const xAxis = {
  label: 'Distance between home and office (km)',
  data: [
    '0-1',
    '1-2',
    '2-3',
    '3-4',
    '4-5',
    '5-6',
    '6-7',
    '7-8',
    '8-9',
    '9-10',
    '10-11',
    '11-12',
    '12-13',
    '13-14',
    '14-15',
    '15-16',
    '16-17',
    '17-18',
    '18-19',
    '19-20',
    '20-21',
    '21-22',
    '22-23',
    '23-24',
    '24-25',
    '25-30',
    '30-35',
    '35-40',
    '40-50',
    '>50',
  ],
};

const series = [
  { label: 'Car', data: car, stack: 'total' },
  { label: 'Public T.', data: commonTransportation, stack: 'total' },
  { label: 'Motorcycle', data: motorcycle, stack: 'total' },
  { label: 'Walk', data: walking, stack: 'total' },
  { label: 'Bike', data: biking, stack: 'total' },
];

const availableStackOrder = [
  'none',
  'reverse',
  'appearance',
  'ascending',
  'descending',
] as const;

export default function StackOrderDemo() {
  const [stackOrder, setStackOrder] = React.useState<StackOrderType>('none');

  const modifiedSeries = [{ ...series[0], stackOrder }, ...series.slice(1)];
  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        sx={{ minWidth: 150, mr: 5, mt: 1 }}
        select
        label="stackOrder"
        value={stackOrder}
        onChange={(event) => setStackOrder(event.target.value as any)}
      >
        {availableStackOrder.map((offset) => (
          <MenuItem key={offset} value={offset}>
            {offset}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ py: 2 }}>
        <BarChart
          height={300}
          xAxis={[
            {
              ...xAxis,
              tickLabelStyle: {
                angle: 45,
                dominantBaseline: 'hanging',
                textAnchor: 'start',
              },
              height: 65,
            },
          ]}
          yAxis={[{ min: 0, max: 100 }]}
          series={modifiedSeries}
        />
      </Box>
    </Box>
  );
}

```

With the `'appearance'` order, **walking** will be the first since its maximal percentage is for **0-1km**. And the last one is **common transportation** because its maximum value is at the **>50km** distance.

With the `'ascending'` order, stacking starts with **bicycles** and **motorbikes** since their values respectively sum to **41.7** and **55.4**.
Then arrives **walking** (with values sum to **94.1**).
Lastly, comes **common transportation** and **cars** which are visually more important.

The `'descending'` order is the strict opposite.
