import * as React from 'react';
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
import { DemoContainer } from 'docsx/src/modules/components/DemoContainer';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as exportedElements from '@mui/x-date-pickers-pro';
import Typography from '@mui/material/Typography';

const COMPONENTS = {
  date: {
    field: 'Unstable_DateField',
    view: 'DateCalendar',
    picker: 'Unstable_NextDatePicker',
    desktopPicker: 'Unstable_DesktopNextDatePicker',
    mobilePicker: 'Unstable_MobileNextDatePicker',
    staticPicker: 'Unstable_StaticNextDatePicker',
  },
  time: {
    field: 'Unstable_TimeField',
    view: 'TimeClock',
    picker: 'Unstable_NextTimePicker',
    desktopPicker: 'Unstable_DesktopNextTimePicker',
    mobilePicker: 'Unstable_MobileNextTimePicker',
    staticPicker: 'Unstable_StaticNextTimePicker',
  },
  dateTime: {
    field: 'Unstable_DateTimeField',
    view: ['DateCalendar', 'TimeClock'],
    picker: 'Unstable_NextDateTimePicker',
    desktopPicker: 'Unstable_DesktopNextDateTimePicker',
    mobilePicker: 'Unstable_MobileNextDateTimePicker',
    staticPicker: 'Unstable_StaticNextDateTimePicker',
  },
  dateRange: {
    field: [
      'Unstable_SingleInputDateRangeField',
      'Unstable_MultiInputDateRangeField',
    ],
    view: 'DateRangeCalendar',
    picker: 'Unstable_NextDateRangePicker',
    desktopPicker: 'Unstable_DesktopNextDateRangePicker',
    mobilePicker: 'Unstable_MobileNextDateRangePicker',
    staticPicker: 'Unstable_StaticNextDateRangePicker',
  },
  timeRange: {
    field: 'Unstable_MultiInputTimeRangeField',
    view: null,
    picker: null,
    desktopPicker: null,
    mobilePicker: null,
    staticPicker: null,
  },
  dateTimeRange: {
    field: 'Unstable_MultiInputDateTimeRangeField',
    view: null,
    picker: null,
    desktopPicker: null,
    mobilePicker: null,
    staticPicker: null,
  },
};

export default function ComponentExplorer() {
  const [state, setState] = React.useState({
    valueType: 'date',
    family: 'picker',
  });

  const config = COMPONENTS[state.valueType][state.family];
  let exportedNames;
  if (Array.isArray(config)) {
    exportedNames = config;
  } else if (config == null) {
    exportedNames = [];
  } else {
    exportedNames = [config];
  }

  const importCode = exportedNames
    .map((exportedName) => {
      const cleanName = exportedName.replace('Unstable_', '').replace('Next', '');
      const subPackage = exportedName.replace('Unstable_', '');

      const isPro = cleanName.includes('Range');

      return isPro
        ? `
import { ${exportedName} } from '@mui/x-date-pickers-pro'    
import { ${exportedName} } from '@mui/x-date-pickers-pro/${subPackage}'    
`
        : `
import { ${exportedName} } from '@mui/x-date-pickers'
import { ${exportedName} } from '@mui/x-date-pickers-pro'    
import { ${exportedName} } from '@mui/x-date-pickers/${subPackage}'    
`;
    })
    .join('\n');

  const content = exportedNames.map((exportedName) => {
    const Component = exportedElements[exportedName];

    return <Component />;
  });

  return (
    <Stack spacing={3} sx={{ width: '100%', py: 2 }}>
      <Stack direction="row" spacing={2}>
        <FormControl size="small">
          <InputLabel id="component-explorer-value-type-label">
            Value type
          </InputLabel>
          <Select
            label="Value type"
            labelId="component-explorer-value-type-label"
            value={state.valueType}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                valueType: event.target.value,
              }))
            }
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="time">Time</MenuItem>
            <MenuItem value="dateTime">Date and Time</MenuItem>
            <MenuItem value="dateRange">
              Date Range <span className="plan-pro" />
            </MenuItem>
            <MenuItem value="timeRange">
              Time Range <span className="plan-pro" />
            </MenuItem>
            <MenuItem value="dateTimeRange">
              Date Time Range <span className="plan-pro" />
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel id="component-explorer-family-label">Family</InputLabel>
          <Select
            label="Family"
            labelId="component-explorer-family-label"
            value={state.family}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                family: event.target.value,
              }))
            }
          >
            <MenuItem value="picker">Picker</MenuItem>
            <MenuItem value="desktopPicker">Desktop Picker</MenuItem>
            <MenuItem value="mobilePicker">Mobile Picker</MenuItem>
            <MenuItem value="staticPicker">Static Picker</MenuItem>
            <MenuItem value="field">Field</MenuItem>
            <MenuItem value="view">Calendar / Clock</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {exportedNames.length > 0 && (
        <React.Fragment>
          <Stack>
            <Typography>Import code:</Typography>
            <HighlightedCode code={importCode} language="tsx" />
          </Stack>
          <Stack spacing={2}>
            <Typography>Live example:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer>{content}</DemoContainer>
            </LocalizationProvider>
          </Stack>
        </React.Fragment>
      )}

      {exportedNames.length === 0 && (
        <Typography>This component is not available yet</Typography>
      )}
    </Stack>
  );
}
