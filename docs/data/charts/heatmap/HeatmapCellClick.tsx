import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HeatmapCellClick() {
  const [cellData, setCellData] = React.useState<any>(null);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Heatmap
          xAxis={[{ data: [1, 2, 3, 4] }]}
          yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
          series={[
            {
              data: data.filter((_, index) => index !== 5 && index !== 13),
              highlightScope: { highlight: 'item' },
            },
          ]}
          height={300}
          onItemClick={(params) => setCellData(params)}
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
              setCellData(null);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Data from cell click
${cellData ? JSON.stringify(cellData, null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
