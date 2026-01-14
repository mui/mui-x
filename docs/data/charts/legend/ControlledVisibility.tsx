import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { VisibilityIdentifier } from '@mui/x-charts/plugins';

const data = [
  { value: 10, label: 'Series A' },
  { value: 15, label: 'Series B' },
  { value: 20, label: 'Series C' },
];

export default function ControlledVisibility() {
  const [hiddenItems, setHiddenItems] = React.useState<
    VisibilityIdentifier<'pie'>[]
  >([]);

  const handleShowAll = () => {
    setHiddenItems([]);
  };

  const handleHideAll = () => {
    setHiddenItems([
      { type: 'pie', seriesId: 'custom', dataIndex: 0 },
      { type: 'pie', seriesId: 'custom', dataIndex: 1 },
      { type: 'pie', seriesId: 'custom', dataIndex: 2 },
    ]);
  };

  const handleShowOnlyA = () => {
    setHiddenItems([
      { type: 'pie', seriesId: 'custom', dataIndex: 1 },
      { type: 'pie', seriesId: 'custom', dataIndex: 2 },
    ]);
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
    const allVisible = hiddenItems.length === 0;
    const allHidden = hiddenItems.length === data.length;
    const onlyAVisible =
      hiddenItems.length === 2 &&
      hiddenItems[0].dataIndex === 1 &&
      hiddenItems[1].dataIndex === 2;

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
        series={[{ id: 'custom', data }]}
        height={300}
        hiddenItems={hiddenItems}
        slotProps={{
          legend: {
            toggleVisibilityOnClick: true,
          },
        }}
        onHiddenItemsChange={(newIdentifiers) => setHiddenItems(newIdentifiers)}
      />
    </Stack>
  );
}
