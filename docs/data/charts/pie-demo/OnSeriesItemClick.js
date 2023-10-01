import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Stack } from '@mui/material';

export default function OnSeriesItemClick() {
  const [itemId, setItemId] = React.useState();

  const items = React.useMemo(
    () => [
      { id: 12, value: 10, label: 'series A' },
      { id: 1, value: 15, label: 'series B' },
      { id: 2, value: 20, label: 'series C' },
    ],
    [],
  );

  const clickedItem = React.useMemo(
    () => items.find((item) => item.id === itemId),
    [itemId, items],
  );

  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <Stack>
        <Typography variant="h6">
          {clickedItem ? `Clicked on ${clickedItem.label},` : 'Missing itemId'}
        </Typography>
        <Typography variant="h6">
          {clickedItem ? `value: ${clickedItem.value}` : ''}
        </Typography>
      </Stack>

      <PieChart
        series={[
          {
            data: [
              { value: 10, label: 'series A ( No id )' },
              { id: 1, value: 15, label: 'series B' },
              { id: 2, value: 20, label: 'series C' },
            ],
            cx: 100,
          },
        ]}
        slotProps={{
          legend: {
            offset: { x: -50 },
          },
        }}
        onClick={(pieItemIdentifier) => setItemId(pieItemIdentifier)}
        width={400}
        height={200}
      />
    </Stack>
  );
}
