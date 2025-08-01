# Data Grid - Row spanning

Span cells across several rows.

By default, each cell in a Data Grid takes up the height of one row.
The row spanning feature makes it possible for a cell to fill multiple rows in a single column.

To enable, pass the `rowSpanning` prop to the Data Grid.
The Data Grid will automatically merge consecutive cells with repeating values in the same column, as shown in the demo below—switch off the toggle button to see the actual rows:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function RowSpanning() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <FormControlLabel
        checked={enabled}
        onChange={(event) => setEnabled((event.target as HTMLInputElement).checked)}
        control={<Switch />}
        label="Enable row spanning"
      />
      <Box sx={{ height: 300 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          density="compact"
          showCellVerticalBorder
          showColumnVerticalBorder
          disableRowSelectionOnClick
          rowSpanning={enabled}
          hideFooter
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'transparent',
            },
            '& .bold': {
              fontWeight: 'bold',
            },
          }}
        />
      </Box>
    </Box>
  );
}

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'code',
    headerName: 'Item Code',
    width: 85,
    cellClassName: ({ row }) => (row.summaryRow ? 'bold' : ''),
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 170,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 80,
    // Do not span the values
    rowSpanValueGetter: () => null,
  },
  {
    field: 'unitPrice',
    headerName: 'Unit Price',
    type: 'number',
    valueFormatter: (value) => (value ? `$${value}.00` : ''),
  },
  {
    field: 'totalPrice',
    headerName: 'Total Price',
    type: 'number',
    valueGetter: (value, row) => value ?? row?.unitPrice,
    valueFormatter: (value) => `$${value}.00`,
    cellClassName: ({ row }) => (row.summaryRow ? 'bold' : ''),
  },
];

const rows = [
  {
    id: 1,
    code: 'A101',
    description: 'Wireless Mouse',
    quantity: 2,
    unitPrice: 50,
    totalPrice: 100,
  },
  {
    id: 2,
    code: 'A102',
    description: 'Mechanical Keyboard',
    quantity: 1,
    unitPrice: 75,
  },
  {
    id: 3,
    code: 'A103',
    description: 'USB Dock Station',
    quantity: 1,
    unitPrice: 400,
  },
  {
    id: 4,
    code: 'A104',
    description: 'Laptop',
    quantity: 1,
    unitPrice: 1800,
    totalPrice: 2050,
  },
  {
    id: 5,
    code: 'A104',
    description: '- 16GB RAM Upgrade',
    quantity: 1,
    unitPrice: 100,
    totalPrice: 2050,
  },
  {
    id: 6,
    code: 'A104',
    description: '- 512GB SSD Upgrade',
    quantity: 1,
    unitPrice: 150,
    totalPrice: 2050,
  },
  {
    id: 7,
    code: 'TOTAL',
    totalPrice: 2625,
    summaryRow: true,
  },
];

```

:::info
In this demo, the `quantity` column has been deliberately excluded from the row spanning computation using the `colDef.rowSpanValueGetter` prop.

See the [Customizing row-spanning cells](#customizing-row-spanning-cells) section for more details.
:::

:::warning
Row spanning works by increasing the height of the spanned cell by a factor of `rowHeight`—it won't work properly with a variable or dynamic height.
:::

## Customizing row-spanning cells

You can customize how row spanning works using two props:

- `colDef.rowSpanValueGetter`: Controls which values are used for row spanning
- `colDef.valueGetter`: Controls both the row spanning logic and the cell value

This lets you prevent unwanted row spanning when there are repeating values that shouldn't be merged.

In the following example, `rowSpanValueGetter` is used to avoid merging `age` cells that don't belong to the same person.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export default function RowSpanningCustom() {
  return (
    <Box sx={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        showCellVerticalBorder
        showColumnVerticalBorder
        disableRowSelectionOnClick
        hideFooter
        rowSpanning
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Box>
  );
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    editable: true,
  },
  {
    field: 'designation',
    headerName: 'Designation',
    width: 200,
    editable: true,
  },
  {
    field: 'department',
    headerName: 'Department',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 100,
    valueFormatter: (value) => {
      return `${value} yo`;
    },
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.name}-${row.age}` : value;
    },
  },
];

const rows = [
  {
    id: 1,
    name: 'Andrew Clark',
    designation: 'React Engineer',
    department: 'Engineering',
    age: 25,
  },
  {
    id: 2,
    name: 'Andrew Clark',
    designation: 'Technical Interviewer',
    department: 'Human resource',
    age: 25,
  },
  {
    id: 3,
    name: 'Cynthia Duke',
    designation: 'Technical Team Lead',
    department: 'Engineering',
    age: 25,
  },
  {
    id: 4,
    name: 'Jordyn Black',
    designation: 'React Engineer',
    department: 'Engineering',
    age: 31,
  },
  {
    id: 5,
    name: 'Rene Glass',
    designation: 'Ops Lead',
    department: 'Operations',
    age: 31,
  },
];

```

## Usage with column spanning

Row spanning can be used in conjunction with column spanning to create cells that span multiple rows and columns simultaneously, as shown in the demo below:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const rows = [
  {
    id: 0,
    day: 'Monday',
    time: '9:00 AM - 10:30 AM',
    course: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    room: 'Room 101',
    notes: 'Midterm exam',
  },
  {
    id: 1,
    day: 'Monday',
    time: '10:30 AM - 12:00 PM',
    course: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    room: 'Room 101',
    notes: 'Midterm exam',
  },
  {
    id: 2,
    day: 'Tuesday',
    time: '9:00 AM - 10:30 AM',
    course: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    room: 'Room 101',
    notes: 'Practical and lab work',
  },
  {
    id: 3,
    day: 'Tuesday',
    time: '10:30 AM - 12:00 PM',
    course: 'Introduction to Biology',
    instructor: 'Dr. Johnson',
    room: 'Room 107',
    notes: 'Lab session',
  },
  {
    id: 4,
    day: 'Wednesday',
    time: '9:00 AM - 10:30 AM',
    course: 'Computer Science 101',
    instructor: 'Dr. Lee',
    room: 'Room 303',
    notes: 'Class',
  },
  {
    id: 5,
    day: 'Wednesday',
    time: '10:30 AM - 12:00 PM',
    course: 'Computer Science 101',
    instructor: 'Dr. Lee',
    room: 'Room 303',
    notes: 'Lab session',
  },
  {
    id: 6,
    day: 'Thursday',
    time: '9:00 AM - 11:00 AM',
    course: 'Physics II',
    instructor: 'Dr. Carter',
    room: 'Room 104',
    notes: 'Project Discussion',
  },

  {
    id: 7,
    day: 'Thursday',
    time: '11:00 AM - 12:30 PM',
    course: 'Physics II',
    instructor: 'Dr. Carter',
    room: 'Room 104',
    notes: 'Project Discussion',
  },

  {
    id: 8,
    day: 'Friday',
    time: '9:00 AM - 11:00 AM',
    course: 'Physics II',
    instructor: 'Dr. Carter',
    room: 'Room 104',
    notes: 'Project Submission',
  },
  {
    id: 9,
    day: 'Friday',
    time: '11:00 AM - 12:30 PM',
    course: 'Literature & Composition',
    instructor: 'Prof. Adams',
    room: 'Lecture Hall 1',
    notes: 'Reading Assignment',
  },
];

const columns: GridColDef[] = [
  {
    field: 'day',
    headerName: 'Day',
  },
  {
    field: 'time',
    headerName: 'Time',
    minWidth: 160,
  },
  {
    field: 'course',
    headerName: 'Course',
    minWidth: 140,
    colSpan: 2,
    valueGetter: (_, row) => `${row?.course} (${row?.instructor})`,
    cellClassName: 'course-instructor--cell',
  },
  {
    field: 'instructor',
    headerName: 'Instructor',
    minWidth: 140,
    hideable: false,
  },
  {
    field: 'room',
    headerName: 'Room',
    minWidth: 120,
  },
  {
    field: 'notes',
    headerName: 'Notes',
    minWidth: 180,
  },
];

export default function RowSpanningClassSchedule() {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowSpanning
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
          [`& .course-instructor--cell`]: {
            textAlign: 'center',
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  );
}

```

:::warning
Row spanning works well with features like [sorting](/x/react-data-grid/sorting/) and [filtering](/x/react-data-grid/filtering/), but be sure to check that everything works as expected when using it with [column spanning](/x/react-data-grid/column-spanning/).
:::

## Demo

The demo below recreates the calendar from the [column spanning documentation](/x/react-data-grid/column-spanning/#function-signature) using the row spanning feature:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type Subject =
  | 'Maths'
  | 'English'
  | 'Lab'
  | 'Chemistry'
  | 'Physics'
  | 'Music'
  | 'Dance';

type Row = { id: number; time: string; slots: Array<Subject | ''> };

const rows: Array<Row> = [
  {
    id: 0,
    time: slotTimesLookup[0],
    slots: ['Maths', 'Chemistry', 'Physics', 'Music', 'Maths'],
  },
  {
    id: 1,
    time: slotTimesLookup[1],
    slots: ['English', 'Chemistry', 'English', 'Music', 'Dance'],
  },
  {
    id: 2,
    time: slotTimesLookup[2],
    slots: ['English', 'Chemistry', 'Maths', 'Chemistry', 'Dance'],
  },
  {
    id: 3,
    time: slotTimesLookup[3],
    slots: ['Lab', 'Physics', 'Maths', 'Chemistry', 'Physics'],
  },
  {
    id: 4,
    time: slotTimesLookup[4],
    slots: ['', '', '', '', ''],
  },
  {
    id: 5,
    time: slotTimesLookup[5],
    slots: ['Lab', 'Maths', 'Chemistry', 'Chemistry', 'English'],
  },
  {
    id: 6,
    time: slotTimesLookup[6],
    slots: ['Music', 'Lab', 'Chemistry', 'English', ''],
  },
  {
    id: 7,
    time: slotTimesLookup[7],
    slots: ['Music', 'Dance', '', 'English', ''],
  },
];

const slotColumnCommonFields: Partial<GridColDef> = {
  sortable: false,
  filterable: false,
  pinnable: false,
  hideable: false,
  cellClassName: (params) => params.value,
};

const columns: GridColDef<Row>[] = [
  {
    field: 'time',
    headerName: 'Time',
    width: 120,
  },
  {
    field: '0',
    headerName: days[0],
    valueGetter: (value, row) => row?.slots[0],
    ...slotColumnCommonFields,
  },
  {
    field: '1',
    headerName: days[1],
    valueGetter: (value, row) => row?.slots[1],
    ...slotColumnCommonFields,
  },
  {
    field: '2',
    headerName: days[2],
    valueGetter: (value, row) => row?.slots[2],
    ...slotColumnCommonFields,
  },
  {
    field: '3',
    headerName: days[3],
    valueGetter: (value, row) => row?.slots[3],
    ...slotColumnCommonFields,
  },
  {
    field: '4',
    headerName: days[4],
    valueGetter: (value, row) => row?.slots[4],
    ...slotColumnCommonFields,
  },
];

const rootStyles = {
  display: 'flex',
  flexDirection: 'column',
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

export default function RowSpanningCalendar() {
  return (
    <Box sx={rootStyles}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowSpanning
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Box>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
