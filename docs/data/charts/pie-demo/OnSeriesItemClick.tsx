import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Stack } from '@mui/material';

export default function OnSeriesItemClick() {
  const [clickedItem, setClickedItem] = React.useState<any>();
  return (
    <Stack direction={'row'} alignItems={'center'}>
      <Stack>
        <Typography variant="h6">
          {clickedItem
            ? `Clicked on ${clickedItem.label},`
            : 'Click on a series item'}
        </Typography>
        <Typography variant="h6">
          {clickedItem ? `value: ${clickedItem.value}` : ''}
        </Typography>
      </Stack>

      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: 'series A', onClick: setClickedItem },
              { id: 1, value: 15, label: 'series B' },
              { id: 2, value: 20, label: 'series C', onClick: setClickedItem },
            ],
          },
        ]}
        width={400}
        height={200}
      />
    </Stack>
  );
}
