import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';

const slotTimesLookup = {
  0: '09:00 - 10:00',
  1: '10:00 - 11:00',
  2: '11:00 - 12:00',
  3: '12:00 - 13:00',
  4: '13:00 - 14:00',
};

const rows = [
  {
    id: 1,
    day: 'Monday',
    slots: ['Maths', 'English', 'English', 'Lab', 'Lab'],
  },
  {
    id: 2,
    day: 'Tuesday',
    slots: ['Chemistry', 'Chemistry', 'Chemistry', 'Physics', 'Maths'],
  },
  {
    id: 3,
    day: 'Wednesday',
    slots: ['Physics', 'Chemistry', 'Physics', 'Maths', 'Maths'],
  },
];

function slotColSpan({ row, field, value }) {
  const index = Number(field);
  let colSpan = 1;
  let nextIndex = index + 1;
  let nextValue = row.slots[nextIndex];
  while (nextValue === value) {
    colSpan += 1;
    nextIndex += 1;
    nextValue = row.slots[nextIndex];
  }
  return colSpan;
}

const columns = [
  {
    field: 'day',
    headerName: 'Day',
  },
  {
    field: '0',
    headerName: slotTimesLookup[0],
    sortable: false,
    filterable: false,
    valueGetter: ({ row }) => {
      return row.slots[0];
    },
    colSpan: slotColSpan,
    flex: 1,
  },
  {
    field: '1',
    headerName: slotTimesLookup[1],
    sortable: false,
    filterable: false,
    valueGetter: ({ row }) => {
      return row.slots[1];
    },
    colSpan: slotColSpan,
    flex: 1,
  },
  {
    field: '2',
    headerName: slotTimesLookup[2],
    sortable: false,
    filterable: false,
    valueGetter: ({ row }) => {
      return row.slots[2];
    },
    colSpan: slotColSpan,
    flex: 1,
  },
  {
    field: '3',
    headerName: slotTimesLookup[3],
    sortable: false,
    filterable: false,
    valueGetter: ({ row }) => {
      return row.slots[3];
    },
    colSpan: slotColSpan,
    flex: 1,
  },
  {
    field: '4',
    headerName: slotTimesLookup[4],
    sortable: false,
    filterable: false,
    valueGetter: ({ row }) => {
      return row.slots[4];
    },
    colSpan: slotColSpan,
    flex: 1,
  },
];

export default function ColumnSpanningDerived() {
  return (
    <Box sx={{ width: '100%' }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        pinnedColumns={{
          left: ['day'],
        }}
        autoHeight
        disableExtendRowFullWidth
        disableSelectionOnClick
        hideFooter
        showCellRightBorder
        showColumnRightBorder
      />
    </Box>
  );
}
