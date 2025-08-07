---
productId: x-date-pickers
title: Date and Time Picker - Base concepts
packageName: '@mui/x-date-pickers'
githubLabel: 'scope: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
---

# Date and Time Pickers - Base concepts

The Date and Time Pickers expose a lot of components to fit your every need.

## Controlled value

All the components have a `value` / `onChange` API to set and control the values:

```tsx
import * as React from 'react';
import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ControlledComponent() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Imports

All the components exported by `@mui/x-date-pickers` are also exported by `@mui/x-date-pickers-pro` but without the nested imports.

For example, to use the `DatePicker` component, the following three imports are valid:

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DatePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers-pro';
```

## Date library

The Date and Time Pickers are focused on UI/UX and, like most other picker components available, require a third-party library to format, parse, and mutate dates.

MUI's components let you choose which library you prefer for this purpose.
This gives you the flexibility to implement any date library you may already be using in your application, without adding an extra one to your bundle.

To achieve this, both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` export a set of **adapters** that expose the date manipulation libraries under a unified API.

### Available libraries

The Date and Time Pickers currently support the following date libraries:

- [Day.js](https://day.js.org/)
- [date-fns](https://date-fns.org/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Moment.js](https://momentjs.com/)

:::info
If you are using a non-Gregorian calendar (such as Jalali or Hijri), please refer to the [Support for other calendar systems](/x/react-date-pickers/calendar-systems/) page.
:::

### Recommended library

If you are already using one of the libraries listed above in your application, then you can keep using it with the Date and Time Pickers as well.
This will avoid bundling two libraries.

If you don't have your own requirements or don't manipulate dates outside of MUI X components, then the recommendation is to use `dayjs` because it has the smallest impact on your application's bundle size.

Here is the weight added to your gzipped bundle size by each of these libraries when used inside the Date and Time Pickers:

| Library           | Gzipped size |
| :---------------- | -----------: |
| `dayjs@1.11.5`    |      6.77 kB |
| `date-fns@2.29.3` |     19.39 kB |
| `luxon@3.0.4`     |     23.26 kB |
| `moment@2.29.4`   |     20.78 kB |

:::info
The results above were obtained in October 2022 with the latest version of each library.
The bundling of the JavaScript modules was done by a Create React App, and no locale was loaded for any of the libraries.

The results may vary in your application depending on the version of each library, the locale, and the bundler used.
:::

## Other components

### Choose interaction style

Depending on your use case, different interaction styles are preferred.

- For input editing with a popover or modal for mouse interaction, use the _Picker_ components:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function BasicDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Date Picker" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

- For input-only editing, use the _Field_ components:

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function BasicDateField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField']}>
        <DateField label="Date Field" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

- For inline editing, use the _Calendar / Clock_ components:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function BasicDateCalendar() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar']}>
        <DateCalendar />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::info
Each _Picker_ is a combination of one _Field_ and one or several _Calendar / Clock_ components.
For example, the `DatePicker` is the combination of the `DateField` and the `DateCalendar`.

The _Calendar / Clock_ components are rendered inside a _Popover_ on desktop and inside a _Modal_ on mobile.
:::

### Date or time editing?

The Date and Time Pickers are divided into six families of components.
The demo below shows each one of them using their field component:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

const ProSpan = styled('span')({
  display: 'inline-block',
  height: '1em',
  width: '1em',
  verticalAlign: 'middle',
  marginLeft: '0.3em',
  marginBottom: '0.08em',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'url(https://mui.com/static/x/pro.svg)',
});

function ProLabel({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={0.5} component="span">
      <Tooltip title="Included in Pro package">
        <a
          href="https://mui.com/x/introduction/licensing/#pro-plan"
          aria-label="Included in Pro package"
        >
          <ProSpan />
        </a>
      </Tooltip>
      <span>{children}</span>
    </Stack>
  );
}

export default function ComponentFamilies() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateField',
          'TimeField',
          'DateTimeField',
          'SingleInputDateRangeField',
          'SingleInputTimeRangeField',
          'SingleInputDateTimeRangeField',
        ]}
      >
        <DemoItem label="Date">
          <DateField defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Time">
          <TimeField defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Date Time">
          <DateTimeField defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem
          label={<ProLabel>Date Range</ProLabel>}
          component="SingleInputDateRangeField"
        >
          <SingleInputDateRangeField
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
          />
        </DemoItem>
        <DemoItem
          label={<ProLabel>Time Range</ProLabel>}
          component="SingleInputTimeRangeField"
        >
          <SingleInputTimeRangeField
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem
          label={<ProLabel>Date Time Range</ProLabel>}
          component="SingleInputDateTimeRangeField"
        >
          <SingleInputDateTimeRangeField
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Responsiveness

Each _Picker_ is available in a responsive, desktop and mobile variant:

- The responsive component (for example `DatePicker`) which renders the desktop component or the mobile one depending on the device it runs on.

- The desktop component (for example `DesktopDatePicker`) which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The mobile component (for example `MobileDatePicker`) which works best for touch devices and small screens.
  It renders the view inside a modal and a field for keyboard editing.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export default function ResponsivePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DatePicker', 'DesktopDatePicker', 'MobileDatePicker']}
      >
        <DemoItem label="Responsive variant">
          <DatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Desktop variant">
          <DesktopDatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileDatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Find your component

There are many components available, each fitting specific use cases. Use the form below to find the component you need:

```tsx
import * as React from 'react';
// @ts-ignore
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// eslint-disable-next-line no-restricted-imports
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
    picker: ['TimeRangePicker', 'DesktopTimeRangePicker', 'MobileTimeRangePicker'],
  },
  dateTimeRange: {
    field: ['SingleInputDateTimeRangeField', 'MultiInputDateTimeRangeField'],
    view: [],
    picker: [
      'DateTimeRangePicker',
      'DesktopDateTimeRangePicker',
      'MobileDateTimeRangePicker',
    ],
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
        ? `
import { ${exportedName} } from '@mui/x-date-pickers-pro/${subPackage}';
import { ${exportedName} } from '@mui/x-date-pickers-pro';`
        : `
import { ${exportedName} } from '@mui/x-date-pickers/${subPackage}';
import { ${exportedName} } from '@mui/x-date-pickers';
import { ${exportedName} } from '@mui/x-date-pickers-pro';`;
    })
    .join('\n');

  const content = exportedNames.map((exportedName) => {
    const Component = exportedElements[
      exportedName
    ] as unknown as React.JSXElementConstructor<{}>;

    return (
      <DemoItem
        key={exportedName}
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
        <FormControl sx={{ width: 192 }}>
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
        <FormControl sx={{ width: 164 }}>
          <InputLabel id="component-explorer-family-label">Family</InputLabel>
          <Select
            label="Family"
            labelId="component-explorer-family-label"
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
              <div key={docPage.path}>
                <Link href={docPage.path} rel="noopener" target="_blank">
                  {docPage.name} documentation
                </Link>
              </div>
            ))}
          </div>
          <Stack>
            <Typography>Import code:</Typography>
            <HighlightedCode
              code={importCode}
              language="tsx"
              sx={{ '& pre': { mt: 1, mb: 0 } }}
            />
          </Stack>
          <div>
            <Typography sx={{ mb: 1 }}>Live example:</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={exportedNames}>{content}</DemoContainer>
              </LocalizationProvider>
            </Box>
          </div>
        </React.Fragment>
      ) : (
        <Typography>This component is not available yet</Typography>
      )}
    </Stack>
  );
}

```

## Reference date when no value is defined

If `value` or `defaultValue` contains a valid date, this date will be used to initialize the rendered component.

In the demo below, you can see that the calendar is set to April 2022 on mount:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ReferenceDateUsingValue() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          defaultValue={dayjs('2022-04-17')}
          views={['year', 'month', 'day']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

When `value` and `defaultValue` contains no valid date, the component will try to find a reference date that passes the validation to initialize its rendering:

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ReferenceDateDefaultBehavior() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DemoItem label="No validation: uses today">
          <DatePicker />
        </DemoItem>
        <DemoItem label="Validation: uses the day of `maxDate`">
          <DatePicker maxDate={dayjs('2022-04-17')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

You can override this date using the `referenceDate` prop:

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function ReferenceDateExplicitDateTimePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ minWidth: 305 }}>
        <DateTimePicker
          value={value}
          onChange={setValue}
          referenceDate={dayjs('2022-04-17T15:30')}
        />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}

```

This can also be useful to set the part of the value that will not be selectable in the component.
For example, in a Time Picker, it allows you to choose the date of your value:

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export default function ReferenceDateExplicitTimePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ minWidth: 305 }}>
        <TimePicker
          value={value}
          onChange={setValue}
          referenceDate={dayjs('2022-04-17')}
        />
        <Typography>
          Stored value: {value == null ? 'null' : value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}

```

Reference date can be unique for each range component position.
You can pass an array of dates to the `referenceDate` prop to set the reference date for each position in the range.
This might be useful when you want different time values for start and end positions in a Date Time Range Picker.

:::info
Try selecting a date the demo below, then move to next position to observe the end reference date usage.
:::

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

export default function ReferenceDateRange() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimeRangePicker
        referenceDate={[dayjs('2022-04-17T07:45'), dayjs('2022-04-21T17:30')]}
      />
    </LocalizationProvider>
  );
}

```

## Testing caveats

### Responsive components

:::info
Some test environments (for example `jsdom`) do not support media query. In such cases, components will be rendered in desktop mode. To modify this behavior you can fake the `window.matchMedia`.
:::

Be aware that running tests in headless browsers might not pass the default mediaQuery (`pointer: fine`).
In such case you can [force pointer precision](https://github.com/microsoft/playwright/issues/7769#issuecomment-1205106311) via browser flags or preferences.

### Field components

:::info
To support RTL and some keyboard interactions, field components add some Unicode character that are invisible, but appears in the input value.
:::

To add tests about a field value without having to care about those characters, you can remove the specific character before testing the equality.
Here is an example about how to do it.

```js
// Helper removing specific characters
const cleanText = (string) =>
  string.replace(/\u200e|\u2066|\u2067|\u2068|\u2069/g, '');

// Example of a test using the helper
expect(cleanText(input.value)).to.equal('04-17-2022');
```

## Overriding slots and slot props

Date and Time Pickers are complex components built using many subcomponents known as **slots**.
Slots are commonly filled by React components that you can override using the `slots` prop.
You can also pass additional props to the available slots using the `slotProps` prop.
Learn more about the mental model of slots in the Base UI documentation: [Overriding component structure](https://v6.mui.com/base-ui/guides/overriding-component-structure/).

You can find the list of available slots for each component in its respective [API reference](/x/api/date-pickers/date-picker/#slots) doc.

Some parts of the Pickers' UI are built on several nested slots. For instance, the adornment of the `TextField` on `DatePicker` contains three slots (`inputAdornment`, `openPickerButton`, and `openPickerIcon`) that you can use depending on what you are trying to customize.

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

const StyledButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
}));
const StyledDay = styled(PickersDay)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.secondary.light,
  ...theme.applyStyles('light', {
    color: theme.palette.secondary.dark,
  }),
}));

export default function CustomSlots() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label="Styled picker"
          slots={{
            openPickerIcon: EditCalendarRoundedIcon,
            openPickerButton: StyledButton,
            day: StyledDay,
          }}
          slotProps={{
            openPickerIcon: { fontSize: 'large' },
            openPickerButton: { color: 'secondary' },
            textField: {
              variant: 'filled',
              focused: true,
              color: 'secondary',
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::info
Learn more about overriding slots in the doc page about [Custom slots and subcomponents](/x/react-date-pickers/custom-components/).
:::
