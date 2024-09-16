import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Typography from '@mui/material/Typography';
import { useResizeObserver } from '@mui/x-internals/useResizeObserver';

const minHeight = 200;
const maxHeight = 400;

export default function MinMaxHeightGrid() {
  const [nbRows, setNbRows] = React.useState(3);
  const removeRow = () => setNbRows((x) => Math.max(0, x - 1));
  const addRow = () => setNbRows((x) => Math.min(100, x + 1));
  const containerRef = React.useRef(null);

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeRow}>
          Remove a row
        </Button>
        <Button size="small" onClick={addRow}>
          Add a row
        </Button>
      </Stack>
      <div style={{ position: 'relative' }} ref={containerRef}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight,
            minHeight,
          }}
        >
          <DataGrid {...data} rows={data.rows.slice(0, nbRows)} loading={loading} />
        </div>

        {/** Visualize max and min container height */}
        {!loading && <ContainerMeasurements containerRef={containerRef} />}
      </div>
    </Box>
  );
}

function ContainerMeasurements({ containerRef }) {
  const [containerHeight, setContainerHeight] = React.useState(0);

  useResizeObserver(containerRef, (entry) => {
    setContainerHeight(entry[0].contentRect.height);
  });

  return (
    <React.Fragment>
      <Measurment
        height={minHeight}
        label={`min-height: ${minHeight}px`}
        visible={containerHeight === minHeight}
      />
      <Measurment
        height={maxHeight}
        label={`max-height: ${maxHeight}px`}
        visible={containerHeight === maxHeight}
      />
    </React.Fragment>
  );
}

function Measurment({ height, label, visible = false }) {
  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: 0,
        left: -20,
        width: 20,
        height,
        borderColor: theme.palette.text.secondary,
        borderStyle: 'dashed',
        borderTopWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s',
      })}
    >
      <Typography
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'rotate(180deg) translate(0, 50%)',
          writingMode: 'vertical-lr',
          color: theme.palette.text.secondary,
          textWrap: 'nowrap',
          lineHeight: 1.2,
          fontSize: '15px',
        })}
      >
        {label}
      </Typography>
    </Box>
  );
}
