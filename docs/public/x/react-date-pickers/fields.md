---
productId: x-date-pickers
title: React Date Fields components
components: DateField, TimeField, DateTimeField, MultiInputDateRangeField, SingleInputDateRangeField, MultiInputTimeRangeField, SingleInputTimeRangeField, MultiInputDateTimeRangeField, SingleInputDateTimeRangeField
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers'
---

# Fields component

The field components let the user input date and time values with a keyboard and refined keyboard navigation.

## Introduction

The fields are React components that let you enter a date or time with the keyboard, without using any popover or modal UI.
They provide refined navigation through arrow keys and support advanced behaviors like localization and validation.

### Fields to edit a single element

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

const defaultValue = dayjs('2022-04-17T15:30');

export default function SingleDateFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'TimeField', 'DateTimeField']}>
        <DemoItem label="DateField">
          <DateField defaultValue={defaultValue} />
        </DemoItem>
        <DemoItem label="TimeField">
          <TimeField defaultValue={defaultValue} />
        </DemoItem>
        <DemoItem label="DateTimeField">
          <DateTimeField defaultValue={defaultValue} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

### Fields to edit a range [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

All fields to edit a range are available in a single input version and in a multi input version.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import { SingleInputDateTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputDateTimeRangeField';

const date1 = dayjs('2022-04-17T15:30');
const date2 = dayjs('2022-04-21T18:30');

export default function DateRangeFieldExamples() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'SingleInputDateRangeField',
          'SingleInputTimeRangeField',
          'SingleInputDateTimeRangeField',
          'MultiInputDateRangeField',
          'MultiInputTimeRangeField',
          'MultiInputDateTimeRangeField',
        ]}
      >
        <DemoItem label="SingleInputDateRangeField">
          <SingleInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem label="SingleInputTimeRangeField">
          <SingleInputTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem label="SingleInputDateTimeRangeField">
          <SingleInputDateTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputDateRangeField"
          component="MultiInputDateRangeField"
        >
          <MultiInputDateRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputTimeRangeField"
          component="MultiInputTimeRangeField"
        >
          <MultiInputTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
        <DemoItem
          label="MultiInputDateTimeRangeField"
          component="MultiInputDateTimeRangeField"
        >
          <MultiInputDateTimeRangeField defaultValue={[date1, date2]} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Advanced

### What is a section?

In the field components, the date is divided into several sections, each one responsible for the edition of a date token.
For example, if the format passed to the field is `MM/DD/YYYY`, the field will create 3 sections:

- A `month` section for the token `MM`
- A `day` section for the token `DD`
- A `year` section for the token `YYYY`

Those sections are independent, pressing <kbd class="key">ArrowUp</kbd> while focusing the `day` section will add one day to the date, but it will never change the month or the year.

### Control the selected sections

Use the `selectedSections` and `onSelectedSectionsChange` props to control which sections are currently being selected.

This prop accepts the following formats:

1. If a number is provided, the section at this index will be selected.
2. If `"all"` is provided, all the sections will be selected.
3. If an object with a `startIndex` and `endIndex` fields are provided, the sections between those two indexes will be selected.
4. If a string of type `FieldSectionType` is provided, the first section with that name will be selected.
5. If `null` is provided, no section will be selected

:::warning
You need to make sure the input is focused before imperatively updating the selected sections.
:::

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FieldSectionType, FieldSelectedSections } from '@mui/x-date-pickers/models';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function ControlledSelectedSections() {
  const [selectedSections, setSelectedSections] =
    React.useState<FieldSelectedSections>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setSelectedSectionType = (selectedSectionType: FieldSectionType) => {
    inputRef.current?.focus();
    setSelectedSections(selectedSectionType);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => setSelectedSectionType('month')}>
            Month
          </Button>
          <Button variant="outlined" onClick={() => setSelectedSectionType('day')}>
            Day
          </Button>
          <Button variant="outlined" onClick={() => setSelectedSectionType('year')}>
            Year
          </Button>
        </Stack>
        <DateField
          inputRef={inputRef}
          selectedSections={selectedSections}
          onSelectedSectionsChange={setSelectedSections}
        />
      </Stack>
    </LocalizationProvider>
  );
}

```

#### Usage with single input range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

For single input range fields, you won't be able to use the section name to select a single section because each section is present both in the start and in the end date.
Instead, you can pass the index of the section using the `unstableFieldRef` prop to access the full list of sections:

:::warning
The `unstableFieldRef` is not stable yet. More specifically, the shape of the `section` object might be modified in the near future.
Please only use it if needed.
:::

```tsx
import * as React from 'react';
import { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  FieldSectionType,
  FieldSelectedSections,
  FieldRef,
} from '@mui/x-date-pickers/models';
import { DateRange, RangePosition } from '@mui/x-date-pickers-pro/models';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export default function ControlledSelectedSectionsSingleInputRangeField() {
  const [selectedSections, setSelectedSections] =
    React.useState<FieldSelectedSections>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldRef = React.useRef<FieldRef<DateRange<Dayjs>>>(null);

  const setSelectedSectionType = (
    selectedSectionType: FieldSectionType,
    position: RangePosition,
  ) => {
    if (!fieldRef.current) {
      return;
    }

    inputRef.current?.focus();
    const sections = fieldRef.current.getSections().map((el) => el.type);
    setSelectedSections(
      position === 'start'
        ? sections.indexOf(selectedSectionType)
        : sections.lastIndexOf(selectedSectionType),
    );
  };

  const renderDateHeader = (position: RangePosition) => (
    <Stack spacing={2} alignItems="center">
      <Typography textTransform="capitalize">{position}</Typography>
      <Stack direction="row" spacing={1}>
        {(['month', 'day', 'year'] as const).map((sectionName) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedSectionType(sectionName, position)}
            key={sectionName}
          >
            {sectionName}
          </Button>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack spacing={2}>
          {renderDateHeader('start')}
          {renderDateHeader('end')}
        </Stack>
        <SingleInputDateRangeField
          sx={{ minWidth: 300 }}
          unstableFieldRef={fieldRef}
          inputRef={inputRef}
          selectedSections={selectedSections}
          onSelectedSectionsChange={setSelectedSections}
        />
      </Stack>
    </LocalizationProvider>
  );
}

```

#### Usage with multi input range fields [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

For multi input range fields, you just have to make sure that the right input is focused before updating the selected section(s).
Otherwise, the section(s) might be selected on the wrong input.

```tsx
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FieldSectionType, FieldSelectedSections } from '@mui/x-date-pickers/models';
import { RangePosition } from '@mui/x-date-pickers-pro/models';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';

export default function ControlledSelectedSectionsMultiInputRangeField() {
  const [selectedSections, setSelectedSections] =
    React.useState<FieldSelectedSections>(null);
  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);

  const setSelectedSectionType = (
    selectedSectionType: FieldSectionType,
    position: RangePosition,
  ) => {
    if (position === 'start') {
      startInputRef.current?.focus();
    } else {
      endInputRef.current?.focus();
    }
    setSelectedSections(selectedSectionType);
  };

  const renderDateHeader = (position: RangePosition) => (
    <Stack spacing={2} alignItems="center">
      <Typography textTransform="capitalize">{position}</Typography>
      <Stack direction="row" spacing={1}>
        {(['month', 'day', 'year'] as const).map((sectionName) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedSectionType(sectionName, position)}
          >
            {sectionName}
          </Button>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2}>
        <Stack spacing={2} justifyContent="space-between">
          {renderDateHeader('start')}
          {renderDateHeader('end')}
        </Stack>
        <MultiInputDateRangeField
          sx={{ minWidth: 300 }}
          slotProps={{
            textField: (ownerState) => ({
              inputRef:
                ownerState.position === 'start' ? startInputRef : endInputRef,
            }),
          }}
          selectedSections={selectedSections}
          onSelectedSectionsChange={setSelectedSections}
        />
      </Stack>
    </LocalizationProvider>
  );
}

```

### Clearable behavior

You can use the `clearable` prop to enable the clearing behavior on a field. You can also add an event handler using the `onClear` callback prop.

:::info
For **multi-input** range fields the clearable behavior is not supported yet.
:::

```tsx
import * as React from 'react';
import { Dayjs } from 'dayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function ClearableBehavior() {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [cleared, setCleared] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <DemoItem label="DateField">
          <DateField
            sx={{ width: '300px' }}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            onClear={() => setCleared(true)}
            clearable
          />
        </DemoItem>
        {cleared && !value && (
          <Alert
            sx={{ position: 'absolute', bottom: 0, right: 0 }}
            severity="success"
          >
            Field cleared!
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
}

```

You can also customize the icon you want to be displayed inside the clear `IconButton`.

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import BackspaceIcon from '@mui/icons-material/Backspace';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function CustomizeClearIcon() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'SingleInputDateRangeField']}>
        <DateField
          label="Date Field"
          clearable
          slots={{ clearIcon: HighlightOffIcon }}
        />
        <SingleInputDateRangeField
          label="Date Range Field"
          clearable
          slots={{ clearIcon: BackspaceIcon }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```
