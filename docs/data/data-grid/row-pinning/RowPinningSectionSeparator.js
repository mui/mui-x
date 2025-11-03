import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { DataGridPro } from '@mui/x-data-grid-pro';
import {
  randomCity,
  randomEmail,
  randomId,
  randomInt,
  randomTraderName,
  randomUserName,
} from '@mui/x-data-grid-generator';

export default function RowPinningSectionSeparator() {
  const [separator, setSeparator] = React.useState('border-and-shadow');

  return (
    <div style={{ width: '100%' }}>
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={separator}
          onChange={(event) => setSeparator(event.target.value)}
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
        </RadioGroup>
      </FormControl>
      <div style={{ height: 500 }}>
        <DataGridPro
          columns={columns}
          rows={rows}
          pinnedRows={pinnedRows}
          pinnedRowsSectionSeparator={separator}
        />
      </div>
    </div>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'username', headerName: 'Username' },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', type: 'number', headerName: 'Age' },
];

const rows = [];

function getRow() {
  return {
    id: randomId(),
    name: randomTraderName(),
    city: randomCity(),
    username: randomUserName(),
    email: randomEmail(),
    age: randomInt(10, 80),
  };
}

for (let i = 0; i < 10; i += 1) {
  rows.push(getRow());
}

const pinnedRows = {
  top: [getRow(), getRow()],
  bottom: [getRow()],
};
