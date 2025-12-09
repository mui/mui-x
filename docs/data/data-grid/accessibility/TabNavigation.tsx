import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid-pro';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'Internal',
    description: '',
    children: [{ field: 'id' }],
  },
  {
    groupId: 'Basic info',
    children: [
      {
        groupId: 'Full name',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];

export default function TabNavigation() {
  const keyPressCount = React.useRef(0);
  const [tabNavigation, setTabNavigation] =
    React.useState<DataGridProProps['tabNavigation']>('all');

  const preventKeyDown =
    (key: string, shiftKey: boolean) => (event: React.KeyboardEvent) => {
      if (keyPressCount.current > 2) {
        return;
      }

      if (event.key === key && event.shiftKey === shiftKey) {
        event.preventDefault();
        keyPressCount.current += 1;
      }
    };

  const resetKeyPressCount = () => {
    keyPressCount.current = 0;
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <FormLabel id="tab-navigation-radio-buttons-group-label">
        Tab Navigation
      </FormLabel>
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={tabNavigation}
          onChange={(event) =>
            setTabNavigation(event.target.value as DataGridProProps['tabNavigation'])
          }
          name="grid-tab-navigation"
          aria-labelledby="tab-navigation-radio-buttons-group-label"
        >
          <FormControlLabel
            value="none"
            control={<Radio />}
            label={<code>&quot;none&quot;</code>}
          />
          <FormControlLabel
            value="content"
            control={<Radio />}
            label={<code>&quot;content&quot;</code>}
          />
          <FormControlLabel
            value="header"
            control={<Radio />}
            label={<code>&quot;header&quot;</code>}
          />
          <FormControlLabel
            value="all"
            control={<Radio />}
            label={<code>&quot;all&quot;</code>}
          />
        </RadioGroup>
      </FormControl>

      {/* Top tab barrier */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={preventKeyDown('Tab', true)}
        onBlur={resetKeyPressCount}
        style={{
          width: '100%',
          padding: '8px',
          textAlign: 'center',
          fontSize: '12px',
        }}
      >
        Tab Barrier (prevents Shift+Tab 3 times)
      </div>

      <Box style={{ height: 500, width: '100%' }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          columnGroupingModel={columnGroupingModel}
          tabNavigation={tabNavigation}
          headerFilters
        />
      </Box>

      {/* Bottom tab barrier */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={preventKeyDown('Tab', false)}
        onBlur={resetKeyPressCount}
        style={{
          width: '100%',
          padding: '8px',
          textAlign: 'center',
          fontSize: '12px',
        }}
      >
        Tab Barrier (prevents Tab 3 times)
      </div>
    </div>
  );
}
