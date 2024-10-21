import * as React from 'react';
import Box from '@mui/material/Box';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { DataGridPro, GridCell } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const TraceUpdates = React.forwardRef<any, any>((props, ref) => {
  const { Component, ...other } = props;
  const rootRef = React.useRef<HTMLElement>(null);
  const handleRef = useForkRef(rootRef, ref);

  React.useEffect(() => {
    const root = rootRef.current;
    root!.classList.add('updating');
    root!.classList.add('updated');

    const timer = setTimeout(() => {
      root!.classList.remove('updating');
    }, 360);

    return () => {
      clearTimeout(timer);
    };
  });

  return <Component ref={handleRef} {...other} />;
});

const CellWithTracer = React.forwardRef((props, ref) => {
  return <TraceUpdates ref={ref} Component={GridCell} {...props} />;
}) as typeof GridCell;

const slots = {
  cell: CellWithTracer,
};

export default function GridVisualization() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    editable: true,
    maxColumns: 15,
  });

  return (
    <Box
      sx={(theme) => ({
        height: 400,
        width: '100%',
        '&&& .updated': {
          transition: theme.transitions.create(['background-color', 'outline'], {
            duration: theme.transitions.duration.standard,
          }),
        },
        '&&& .updating': {
          backgroundColor: 'rgb(92 199 68 / 20%)',
          outline: '1px solid rgb(92 199 68 / 35%)',
          outlineOffset: '-1px',
          transition: 'none',
        },
      })}
    >
      <DataGridPro
        {...data}
        rowHeight={38}
        checkboxSelection
        disableRowSelectionOnClick
        slots={slots}
      />
    </Box>
  );
}
