import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import {
  DataGridPro,
  GridActionsCellItem,
  type GridColDef,
  type GridRowsProp,
  type DataGridProProps,
  GridActionsCell,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

type SectionSeparator = NonNullable<
  DataGridProProps['pinnedColumnsSectionSeparator']
>;

export default function ColumnPinningSectionSeparator() {
  const [separator, setSeparator] =
    React.useState<SectionSeparator>('border-and-shadow');

  return (
    <div style={{ width: '100%' }}>
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={separator}
          onChange={(event) => setSeparator(event.target.value as SectionSeparator)}
          name="pinned-columns-section-separator"
        >
          <FormControlLabel
            value="border-and-shadow"
            control={<Radio />}
            label={<code>&quot;border-and-shadow&quot;</code>}
          />
          <FormControlLabel
            value="border"
            control={<Radio />}
            label={<code>&quot;border&quot;</code>}
          />
          <FormControlLabel
            value="shadow"
            control={<Radio />}
            label={<code>&quot;shadow&quot;</code>}
          />
        </RadioGroup>
      </FormControl>
      <div style={{ height: 400 }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          initialState={{ pinnedColumns: { left: ['name'], right: ['actions'] } }}
          pinnedColumnsSectionSeparator={separator}
        />
      </div>
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 160, editable: true },
  { field: 'email', headerName: 'Email', width: 200, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
  {
    field: 'actions',
    type: 'actions',
    width: 100,
    renderCell: (params) => (
      <GridActionsCell {...params}>
        <GridActionsCellItem icon={<EditIcon />} label="Edit" />
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />
      </GridActionsCell>
    ),
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: randomTraderName(),
    email: randomEmail(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    email: randomEmail(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    email: randomEmail(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    email: randomEmail(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    email: randomEmail(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 6,
    name: randomTraderName(),
    email: randomEmail(),
    age: 27,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 7,
    name: randomTraderName(),
    email: randomEmail(),
    age: 18,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 8,
    name: randomTraderName(),
    email: randomEmail(),
    age: 31,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 9,
    name: randomTraderName(),
    email: randomEmail(),
    age: 24,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 10,
    name: randomTraderName(),
    email: randomEmail(),
    age: 35,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
