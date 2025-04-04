import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

type ItemType = TreeViewBaseItem<{
  id: string;
  label: string;
  childrenCount?: number;
}>;

function getSliderAriaValueText(value: number) {
  return `${value}°C`;
}

export default function BasicLazyLoading() {
  const [latency, setLatency] = React.useState(1000);

  const handleSliderChange = (_event: Event, newLatency: number | number[]) => {
    setLatency(newLatency as number);
  };

  const fetchData = async (): Promise<ItemType[]> => {
    const length: number = randomInt(5, 10);
    const rows = Array.from({ length }, () => ({
      id: randomId(),
      label: randomName({}, {}),
      ...(randomBoolean() ? { childrenCount: length } : {}),
    }));

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rows);
      }, latency);
    });
  };

  return (
    <Box sx={{ width: '300px' }}>
      <Box sx={{ width: 250 }}>
        <Typography id="latency-slider" gutterBottom>
          Loading latency: {latency} (ms)
        </Typography>
        <Slider
          value={latency}
          onChange={handleSliderChange}
          aria-labelledby="latency-slider"
          min={500}
          max={10000}
          shiftStep={1000}
          step={500}
          marks
          getAriaValueText={getSliderAriaValueText}
          valueLabelDisplay="auto"
        />
      </Box>
      <RichTreeViewPro
        items={[]}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount as number,
          getTreeItems: fetchData,
        }}
      />
    </Box>
  );
}
