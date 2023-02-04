import * as React from 'react';
// @ts-ignore
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as exportedElements from '@mui/x-date-pickers-pro';
import Typography from '@mui/material/Typography';

const camelCaseToKebabCase = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const camelCaseToPascalCase = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1 $2');

const getSubPackageFromExportedName = (exportedName: string) =>
  exportedName.replace(/Unstable_/g, '');

type ExportedElements = keyof typeof exportedElements;

interface State {
  valueType:
    | 'date'
    | 'time'
    | 'dateTime'
    | 'dateRange'
    | 'timeRange'
    | 'dateTimeRange';
  family: 'field' | 'view' | 'picker';
}

const COMPONENTS: Record<
  State['valueType'],
  Record<State['family'], ExportedElements[]>
> = {
  date: {
    field: ['DateField'],
    view: ['DateCalendar'],
    picker: [
      'DatePicker',
      'DesktopDatePicker',
      'MobileDatePicker',
      'StaticDatePicker',
    ],
  },
  time: {
    field: ['TimeField'],
    view: ['TimeClock'],
    picker: [
      'TimePicker',
      'DesktopTimePicker',
      'MobileTimePicker',
      'StaticTimePicker',
    ],
  },
  dateTime: {
    field: ['DateTimeField'],
    view: ['DateCalendar', 'TimeClock'],
    picker: [
      'DateTimePicker',
      'DesktopDateTimePicker',
      'MobileDateTimePicker',
      'StaticDateTimePicker',
    ],
  },
  dateRange: {
    field: ['SingleInputDateRangeField', 'MultiInputDateRangeField'],
    view: ['DateRangeCalendar'],
    picker: [
      'DateRangePicker',
      'DesktopDateRangePicker',
      'MobileDateRangePicker',
      'StaticDateRangePicker',
    ],
  },
  timeRange: {
    field: ['SingleInputTimeRangeField', 'MultiInputTimeRangeField'],
    view: [],
    picker: [],
  },
  dateTimeRange: {
    field: ['SingleInputDateTimeRangeField', 'MultiInputDateTimeRangeField'],
    view: [],
    picker: [],
  },
};

export default function ComponentExplorerNoSnap() {
  const [state, setState] = React.useState<State>({
    valueType: 'date',
    family: 'picker',
  });

  const exportedNames = COMPONENTS[state.valueType][state.family];

  const importCode = exportedNames
    .map((exportedName) => {
      const cleanName = exportedName.replace(/Unstable_|Next/g, '');
      const subPackage = getSubPackageFromExportedName(exportedName);

      const isPro = cleanName.includes('Range');

      return isPro
        ? `import { ${exportedName} } from '@mui/x-date-pickers-pro';
import { ${exportedName} } from '@mui/x-date-pickers-pro/${subPackage}';`
        : `import { ${exportedName} } from '@mui/x-date-pickers/${subPackage}';
import { ${exportedName} } from '@mui/x-date-pickers';
import { ${exportedName} } from '@mui/x-date-pickers-pro';`;
    })
    .join('\n\n');

  const content = exportedNames.map((exportedName) => {
    const Component = exportedElements[
      exportedName
    ] as unknown as React.JSXElementConstructor<{}>;

    return (
      <DemoItem
        label={getSubPackageFromExportedName(exportedName)}
        component={exportedName}
      >
        <Component />
      </DemoItem>
    );
  });

  const docPages = React.useMemo(() => {
    const docPagesNames = Array.from(
      new Set(
        exportedNames.map((exportedName) =>
          exportedName.replace(
            /(Unstable_|Desktop|Mobile|Static|Next|SingleInput|MultiInput)/g,
            '',
          ),
        ),
      ),
    );

    return docPagesNames.map((docPageName) => ({
      name: camelCaseToPascalCase(docPageName),
      path: `/x/react-date-pickers/${camelCaseToKebabCase(docPageName)}/`,
    }));
  }, [exportedNames]);

  return (
    <Stack spacing={3} sx={{ width: '100%', py: 2 }}>
      <Stack direction="row" spacing={2}>
        <FormControl>
          <InputLabel id="component-explorer-value-type-label">
            Value type
          </InputLabel>
          <Select
            label="Value type"
            labelId="component-explorer-value-type-label"
            sx={{ minWidth: 192 }}
            value={state.valueType}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                valueType: event.target.value as State['valueType'],
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
        <FormControl>
          <InputLabel id="component-explorer-family-label">Family</InputLabel>
          <Select
            label="Family"
            labelId="component-explorer-family-label"
            sx={{ minWidth: 164 }}
            value={state.family}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                family: event.target.value as State['family'],
              }))
            }
          >
            <MenuItem value="picker">Picker</MenuItem>
            <MenuItem value="field">Field</MenuItem>
            <MenuItem value="view">Calendar / Clock</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {exportedNames.length > 0 ? (
        <React.Fragment>
          <div>
            {docPages.map((docPage) => (
              <div>
                <Link href={docPage.path} rel="noopener" target="_blank">
                  {docPage.name} documentation
                </Link>
              </div>
            ))}
          </div>
          <Stack>
            <Typography>Import code:</Typography>
            <HighlightedCode code={importCode} language="tsx" />
          </Stack>
          <Stack spacing={2}>
            <Typography>Live example:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={exportedNames}>{content}</DemoContainer>
            </LocalizationProvider>
          </Stack>
        </React.Fragment>
      ) : (
        <Typography>This component is not available yet</Typography>
      )}
    </Stack>
  );
}
