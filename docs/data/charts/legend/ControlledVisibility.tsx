import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
];

export default function ControlledVisibility() {
  const [visibilityMap, setVisibilityMap] = React.useState<Record<string, boolean>>(
    {},
  );

  const handleShowAll = () => {
    setVisibilityMap({
      'pie-0': true,
      'pie-1': true,
      'pie-2': true,
    });
  };

  const handleHideAll = () => {
    setVisibilityMap({
      'pie-0': false,
      'pie-1': false,
      'pie-2': false,
    });
  };

  const handleShowOnlyA = () => {
    setVisibilityMap({
      'pie-0': true,
      'pie-1': false,
      'pie-2': false,
    });
  };

  return (
    <Stack spacing={2}>
      <ButtonGroup variant="outlined" size="small">
        <Button onClick={handleShowAll}>Show All</Button>
        <Button onClick={handleHideAll}>Hide All</Button>
        <Button onClick={handleShowOnlyA}>Show Only A</Button>
      </ButtonGroup>
      <PieChart
        series={[{ id: 'pie', data }]}
        height={300}
        visibilityMap={visibilityMap}
        slotProps={{
          legend: {
            toggleVisibilityOnClick: true,
          },
        }}
        onVisibilityChange={(newVisibilityMap) => setVisibilityMap(newVisibilityMap)}
      />
    </Stack>
  );
}
