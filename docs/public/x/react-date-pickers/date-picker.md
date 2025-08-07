---
productId: x-date-pickers
title: React Date Picker component
components: DatePicker, DesktopDatePicker, MobileDatePicker, StaticDatePicker, DateCalendar
githubLabel: 'scope: DatePicker'
packageName: '@mui/x-date-pickers'
materialDesign: https://m2.material.io/components/date-pickers
---

# Date Picker

The Date Picker component lets users select a date.

## Basic usage

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
        <DatePicker label="Basic date picker" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Component composition

The component is built using the `DateField` for the keyboard editing and the `DateCalendar` for the view editing.

Check-out their documentation page for more information:

- [Date Field](/x/react-date-pickers/date-field/)
- [Date Calendar](/x/react-date-pickers/date-calendar/)

You can check the available props of the combined component on the dedicated [API page](/x/api/date-pickers/date-picker/#props).
Some [DateField props](/x/api/date-pickers/date-field/#props) are not available on the Picker component, you can use `slotProps.field` to pass them to the field.

## Uncontrolled vs. controlled value

The value of the component can be uncontrolled or controlled.

```tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker label="Uncontrolled picker" defaultValue={dayjs('2022-04-17')} />
        <DatePicker
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::info

- The value is **controlled** when its parent manages it by providing a `value` prop.
- The value is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultValue` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Available components

The component is available in four variants:

- The `DesktopDatePicker` component which works best for mouse devices and large screens.
  It renders the views inside a popover and a field for keyboard editing.

- The `MobileDatePicker` component which works best for touch devices and small screens.
  It renders the view inside a modal and a field for keyboard editing.

- The `DatePicker` component which renders `DesktopDatePicker` or `MobileDatePicker` depending on the device it runs on.

- The `StaticDatePicker` component which renders without the popover/modal and field.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function ResponsiveDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
          'MobileDatePicker',
          'DesktopDatePicker',
          'StaticDatePicker',
        ]}
      >
        <DemoItem label="Desktop variant">
          <DesktopDatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Mobile variant">
          <MobileDatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Responsive variant">
          <DatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Static variant">
          <StaticDatePicker defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the `DatePicker` component renders the desktop version if the media query [`@media (pointer: fine)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer) matches.
This can be customized with the `desktopModeMediaQuery` prop.

:::warning
Responsive components can suffer some inconsistencies between testing environments if media query is not supported.
Please refer to [this section](/x/react-date-pickers/base-concepts/#testing-caveats) for solutions.
:::

### Keyboard Date Picker (legacy)

The current implementation of the Date Picker component replaces the experimental Keyboard Date Picker from Material UI.
See the [migration documentation](/material-ui/migration/pickers-migration/#imports) for more information.

For accessibility, all Picker components accept keyboard inputs.
If your use case only calls for keyboard editing, you can use Field components: the Date Picker component can be edited via input or a calendar, whereas the Date Field can only be edited via input.
See the [Fields documentation](/x/react-date-pickers/fields/) for more details.

## Form props

The component supports the `disabled`, `readOnly` and `name` form props:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FormPropsDatePickers() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
        <DatePicker label="disabled" disabled />
        <DatePicker label="readOnly" readOnly />
        <DatePicker label="name" name="startDate" />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

## Views

The component supports three views: `day`, `month`, and `year`.

By default, the `day` and `year` views are enabled.
Use the `views` prop to change this behavior:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
        <DatePicker
          label={'"year", "month" and "day"'}
          views={['year', 'month', 'day']}
        />
        <DatePicker label={'"day"'} views={['day']} />
        <DatePicker label={'"month" and "year"'} views={['month', 'year']} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

By default, the component renders the `day` view on mount.
Use the `openTo` prop to change this behavior:

```tsx
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerOpenTo() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker label={'"year"'} openTo="year" />
        <DatePicker
          label={'"month"'}
          openTo="month"
          views={['year', 'month', 'day']}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

```

:::success
The views will appear in the order defined by the `views` array.
If the view defined in `openTo` is not the first view, then the views before will not be included in the default flow
(for example view the default behaviors, the `year` is only accessible when clicking on the toolbar).
:::

## Order of years

By default, years are displayed in ascending order, chronologically from the minimum year to the maximum.
Set the `yearsOrder` prop to `desc` to show the years in descending order.

```tsx
import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const currentYear = dayjs();

export default function DatePickerYearsOrder() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Years in descending order"
        maxDate={currentYear}
        openTo="year"
        views={['year', 'month']}
        yearsOrder="desc"
        sx={{ minWidth: 250 }}
      />
    </LocalizationProvider>
  );
}

```

## Landscape orientation

By default, the Date Picker component automatically sets the orientation based on the `window.orientation` value.
You can force a specific orientation using the `orientation` prop:

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function StaticDatePickerLandscape() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker orientation="landscape" />
    </LocalizationProvider>
  );
}

```

:::info
You can find more information about the layout customization in the [custom layout page](/x/react-date-pickers/custom-layout/).
:::

## Helper text

You can show a helper text with the date format accepted:

```tsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function HelperText() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Helper text example"
        slotProps={{
          textField: {
            helperText: 'MM/DD/YYYY',
          },
        }}
      />
    </LocalizationProvider>
  );
}

```

## Clearing the value

You can enable the clearable behavior:

```tsx
import * as React from 'react';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function ClearableProp() {
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
        <DemoItem label="DesktopDatePicker">
          <DesktopDatePicker
            sx={{ width: 260 }}
            slotProps={{
              field: { clearable: true, onClear: () => setCleared(true) },
            }}
          />
        </DemoItem>

        {cleared && (
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

:::info
See [Field components—Clearable behavior](/x/react-date-pickers/fields/#clearable-behavior) for more details.
:::

## Localization

See the [Date format and localization](/x/react-date-pickers/adapters-locale/) and [Translated components](/x/react-date-pickers/localization/) documentation pages for more details.

## Validation

See the [Validation](/x/react-date-pickers/validation/) documentation page for more details.

## Customization

You can check out multiple examples of how to customize the date pickers and their subcomponents.

```jsx
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BrandingProvider } from '@mui/docs/branding';
import CustomizationPlayground from 'docsx/src/modules/components/CustomizationPlayground';
import CircularProgress from '@mui/material/CircularProgress';
import { pickerExamples } from './examplesConfig.styling';

export default function CustomizationExamplesNoSnap() {
  const [selectedPicker, setSelectedPicker] = React.useState(0);

  const handleSelectedPickerChange = (_e, newValue) => {
    if (newValue !== null) {
      setSelectedPicker(newValue);
    }
  };

  if (!pickerExamples[selectedPicker]?.examples) {
    return (
      <BrandingProvider>
        <CircularProgress />
      </BrandingProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ mb: 2, width: '100%', px: { xs: 2, sm: 0 } }}>
        <BrandingProvider>
          <ToggleButtonGroup
            value={selectedPicker}
            exclusive
            onChange={handleSelectedPickerChange}
            aria-label="date picker components"
          >
            {pickerExamples.map(({ name }, index) => (
              <ToggleButton value={index} aria-label={name} key={name}>
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </BrandingProvider>
        <CustomizationPlayground
          examples={pickerExamples[selectedPicker].examples}
          componentName={pickerExamples[selectedPicker].name}
        >
          {pickerExamples.map(
            (example, index) =>
              String(index) === String(selectedPicker) && (
                <example.component key={index} {...example?.componentProps} />
              ),
          )}
        </CustomizationPlayground>
      </Stack>
    </LocalizationProvider>
  );
}

```
