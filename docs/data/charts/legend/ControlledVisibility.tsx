import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue === 'all') {
      handleShowAll();
    } else if (newValue === 'none') {
      handleHideAll();
    } else if (newValue === 'onlyA') {
      handleShowOnlyA();
    }
  };

  const getCurrentValue = () => {
    const allVisible =
      visibilityMap['pie-0'] !== false &&
      visibilityMap['pie-1'] !== false &&
      visibilityMap['pie-2'] !== false;
    const allHidden =
      visibilityMap['pie-0'] === false &&
      visibilityMap['pie-1'] === false &&
      visibilityMap['pie-2'] === false;
    const onlyAVisible =
      visibilityMap['pie-0'] !== false &&
      visibilityMap['pie-1'] === false &&
      visibilityMap['pie-2'] === false;

    if (allVisible) {
      return 'all';
    }
    if (allHidden) {
      return 'none';
    }
    if (onlyAVisible) {
      return 'onlyA';
    }
    return null;
  };

  return (
    <Stack spacing={2}>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Controlled Highlighting</FormLabel>
        <ToggleButtonGroup
          value={getCurrentValue()}
          exclusive
          onChange={handleToggleChange}
          aria-label="highlight control"
          size="small"
        >
          <ToggleButton value="all" aria-label="show all nodes">
            Show All
          </ToggleButton>
          <ToggleButton value="none" aria-label="show no nodes">
            Hide All
          </ToggleButton>
          <ToggleButton value="onlyA" aria-label="show only node A">
            Show Only A
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
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
