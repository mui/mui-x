import * as React from 'react';
import Box from '@mui/material/Box';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import {
  DataGridPro,
  GridRow,
  GridCell,
  DataGridProColumnHeaders,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const TraceUpdates = React.forwardRef((props, ref) => {
  const { Component, ...other } = props;
  const rootRef = React.useRef();
  const handleRef = useForkRef(rootRef, ref);

  React.useEffect(() => {
    rootRef.current?.classList.add('updating');

    const timer = setTimeout(() => {
      rootRef.current?.classList.remove('updating');
    }, 500);

    return () => clearTimeout(timer);
  });

  return <Component ref={handleRef} {...other} />;
});

const RowWithTracer = React.forwardRef((props, ref) => {
  return <TraceUpdates ref={ref} Component={GridRow} {...props} />;
});

const CellWithTracer = React.forwardRef((props, ref) => {
  return <TraceUpdates ref={ref} Component={GridCell} {...props} />;
});

const ColumnHeadersWithTracer = React.forwardRef((props, ref) => {
  return <TraceUpdates ref={ref} Component={DataGridProColumnHeaders} {...props} />;
});

const MemoizedRow = React.memo(RowWithTracer);
const MemoizedCell = React.memo(CellWithTracer);
const MemoizedColumnHeaders = React.memo(ColumnHeadersWithTracer);

export default function GridWithReactMemo() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    editable: true,
    maxColumns: 15,
  });

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
        '& .updating': {
          background: '#b2dfdb',
          transition: (theme) =>
            theme.transitions.create('background', {
              duration: theme.transitions.duration.standard,
            }),
        },
      }}
    >
      <DataGridPro
        {...data}
        rowHeight={38}
        checkboxSelection
        disableRowSelectionOnClick
        components={{
          Row: MemoizedRow,
          Cell: MemoizedCell,
          ColumnHeaders: MemoizedColumnHeaders,
        }}
      />
    </Box>
  );
}
