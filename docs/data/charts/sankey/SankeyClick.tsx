import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { SankeyChart, SankeyItemIdentifier } from '@mui/x-charts-pro/SankeyChart';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (key === 'source' || key === 'target') {
      return '(Circular Node)';
    }
    if (key === 'sourceLinks' || key === 'targetLinks') {
      return '[...(Circular Links)]';
    }

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};

const sankeyChartsParams = {
  series: {
    data: {
      nodes: [
        { id: 'Coal', label: 'Coal' },
        { id: 'Natural Gas', label: 'Natural Gas' },
        { id: 'Nuclear', label: 'Nuclear' },
        { id: 'Hydro', label: 'Hydro' },
        { id: 'Wind', label: 'Wind' },
        { id: 'Solar', label: 'Solar' },
        { id: 'Electricity', label: 'Electricity' },
        { id: 'Residential', label: 'Residential' },
        { id: 'Commercial', label: 'Commercial' },
        { id: 'Industrial', label: 'Industrial' },
      ],
      links: [
        { source: 'Coal', target: 'Electricity', value: 30 },
        { source: 'Natural Gas', target: 'Electricity', value: 40 },
        { source: 'Nuclear', target: 'Electricity', value: 20 },
        { source: 'Hydro', target: 'Electricity', value: 10 },
        { source: 'Wind', target: 'Electricity', value: 15 },
        { source: 'Solar', target: 'Electricity', value: 8 },
        { source: 'Electricity', target: 'Residential', value: 45 },
        { source: 'Electricity', target: 'Commercial', value: 35 },
        { source: 'Electricity', target: 'Industrial', value: 43 },
      ],
    },
    highlightScope: {
      highlight: 'item',
    },
  },
  height: 400,
  margin: { left: 20, right: 120 },
} as const;

export default function SankeyClick() {
  const [itemData, setItemData] = React.useState<SankeyItemIdentifier>();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <SankeyChart
          {...sankeyChartsParams}
          onNodeClick={(event, d) => setItemData(d)}
          onLinkClick={(event, d) => setItemData(d)}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>Click on the chart</Typography>
          <IconButton
            aria-label="reset"
            size="small"
            onClick={() => {
              setItemData(undefined);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, getCircularReplacer(), 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
