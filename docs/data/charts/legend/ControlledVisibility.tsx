import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { VisibilityIdentifier } from '@mui/x-charts/plugins';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
];

export default function ControlledVisibility() {
  const [hiddenIdentifiers, setHiddenIdentifiers] = React.useState<
    VisibilityIdentifier<'pie'>[]
  >([]);

  const handleShowAll = () => {
    setHiddenIdentifiers([
      { type: 'pie', seriesId: 'pie', dataIndex: 0 },
      { type: 'pie', seriesId: 'pie', dataIndex: 1 },
      { type: 'pie', seriesId: 'pie', dataIndex: 2 },
    ]);
  };

  const handleHideAll = () => {
    setHiddenIdentifiers([]);
  };

  const handleShowOnlyA = () => {
    setHiddenIdentifiers([{ type: 'pie', seriesId: 'pie', dataIndex: 0 }]);
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
    const allVisible = hiddenIdentifiers.length === data.length;
    const allHidden = hiddenIdentifiers.length === 0;
    const onlyAVisible =
      hiddenIdentifiers.length === 1 && hiddenIdentifiers[0].dataIndex === 0;

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
        hiddenIdentifiers={hiddenIdentifiers}
        slotProps={{
          legend: {
            toggleVisibilityOnClick: true,
          },
        }}
        onVisibilityChange={(newIdentifiers) => setHiddenIdentifiers(newIdentifiers)}
      />
    </Stack>
  );
}
