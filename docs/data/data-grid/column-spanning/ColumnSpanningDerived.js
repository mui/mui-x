import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';

const slotTimesLookup = {
  0: '09:00 - 10:00',
  1: '10:00 - 11:00',
  2: '11:00 - 12:00',
  3: '12:00 - 13:00',
  4: '13:00 - 14:00',
  5: '14:00 - 15:00',
  6: '15:00 - 16:00',
  7: '16:00 - 17:00',
};

const rows = [
  {
    id: 1,
    day: 'Monday',
    slots: ['Maths', 'English', 'English', 'Lab', '', 'Lab', 'Music', 'Music'],
  },
  {
    id: 2,
    day: 'Tuesday',
    slots: [
      'Chemistry',
      'Chemistry',
      'Chemistry',
      'Physics',
      '',
      'Maths',
      'Lab',
      'Dance',
    ],
  },
  {
    id: 3,
    day: 'Wednesday',
    slots: ['Physics', 'English', 'Maths', 'Maths', '', 'Chemistry', 'Chemistry'],
  },
  {
    id: 4,
    day: 'Thursday',
    slots: [
      'Music',
      'Music',
      'Chemistry',
      'Chemistry',
      '',
      'Chemistry',
      'English',
      'English',
    ],
  },
  {
    id: 5,
    day: 'Friday',
    slots: ['Maths', 'Dance', 'Dance', 'Physics', '', 'English'],
  },
];

const slotColumnCommonFields = {
  sortable: false,
  filterable: false,
  pinnable: false,
  hideable: false,
  minWidth: 140,
  cellClassName: (params) => params.value,
  colSpan: (value, row, column) => {
    const index = Number(column.field);
    let colSpan = 1;
    for (let i = index + 1; i < row.slots.length; i += 1) {
      const nextValue = row.slots[i];
      if (nextValue === value) {
        colSpan += 1;
      } else {
        break;
      }
    }
    return colSpan;
  },
};

const columns = [
  {
    field: 'day',
    headerName: 'Day',
  },
  {
    field: '0',
    headerName: slotTimesLookup[0],
    valueGetter: (value, row) => row.slots[0],
    ...slotColumnCommonFields,
  },
  {
    field: '1',
    headerName: slotTimesLookup[1],
    valueGetter: (value, row) => row.slots[1],
    ...slotColumnCommonFields,
  },
  {
    field: '2',
    headerName: slotTimesLookup[2],
    valueGetter: (value, row) => row.slots[2],
    ...slotColumnCommonFields,
  },
  {
    field: '3',
    headerName: slotTimesLookup[3],
    valueGetter: (value, row) => row.slots[3],
    ...slotColumnCommonFields,
  },
  {
    field: '4',
    headerName: slotTimesLookup[4],
    valueGetter: (value, row) => row.slots[4],
    ...slotColumnCommonFields,
  },
  {
    field: '5',
    headerName: slotTimesLookup[5],
    valueGetter: (value, row) => row.slots[5],
    ...slotColumnCommonFields,
  },
  {
    field: '6',
    headerName: slotTimesLookup[6],
    valueGetter: (value, row) => row.slots[6],
    ...slotColumnCommonFields,
  },
  {
    field: '7',
    headerName: slotTimesLookup[7],
    valueGetter: (value, row) => row.slots[7],
    ...slotColumnCommonFields,
  },
];

const rootStyles = {
  width: '100%',
  '& .Maths': {
    backgroundColor: 'rgba(157, 255, 118, 0.49)',
  },
  '& .English': {
    backgroundColor: 'rgba(255, 255, 10, 0.49)',
  },
  '& .Lab': {
    backgroundColor: 'rgba(150, 150, 150, 0.49)',
  },
  '& .Chemistry': {
    backgroundColor: 'rgba(255, 150, 150, 0.49)',
  },
  '& .Physics': {
    backgroundColor: 'rgba(10, 150, 255, 0.49)',
  },
  '& .Music': {
    backgroundColor: 'rgba(224, 183, 60, 0.55)',
  },
  '& .Dance': {
    backgroundColor: 'rgba(200, 150, 255, 0.49)',
  },
};

export default function ColumnSpanningDerived() {
  return (
    <Box sx={rootStyles}>
      <DataGridPro
        columns={columns}
        rows={rows}
        initialState={{
          pinnedColumns: {
            left: ['day'],
          },
        }}
        autoHeight
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnReorder
      />
    </Box>
  );
}
