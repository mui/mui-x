---
productId: x-date-pickers
title: DX - Fields
---

# Fields

<p class="description">This page describes how people can use field with Material UI and how they can build custom fields while keeping the built-in editing behavior.</p>

:::success
This page extends the initial proposal made in [this Github comment](https://github.com/mui/mui-x/issues/14496#issuecomment-2348917294)
:::

## With Material UI

### Basic usage

The `@mui/x-date-pickers` package exposes one field per value type.
Those fields are self-contained components (meaning they don't use composition).

Here is a basic example of a `<DateField />`:

```tsx
import { DateField } from '@mui/x-date-pickers/DateField';

<DateField value={value} onChange={setValue} />;
```

The behavior is the same for all the other fields:

```tsx
<TimeField value={value} onChange={setValue} />;

<DateTimeField value={value} onChange={setValue} />;

<DateRangeField value={value} onChange={setValue} />;

<DateTimeRangeField value={value} onChange={setValue} />;

<TimeRangeField value={value} onChange={setValue} />;
```

:::success
I'm proposing to rename `<SingleInputDateRangeField />` into `<DateRangeField />` for concision when the single input range fields will become the default and when the multi input range fields will be gathered into a single component.
:::

### Multi input range field

The `@mui/x-date-pickers` package also exposes a component to create multi input range fields as follow:

```tsx
import { useDateRangeManager } from '@mui/x-date-pickers/managers';
import { MultiInputRangeField } from '@mui/x-date-pickers/MultiInputRangeField';

function MultiInputDateTimeRangeField(props: MultiInputDateTimeRangeFieldProps) {
  const manager = useDateTimeRangeManager(props);

  return <MultiInputRangeField {...props} manager={manager} ref={ref} />;
}
```

:::success
I have a POC of this in [#15505](https://github.com/mui/mui-x/pull/15505)
:::

## Without Material UI

### Basic usage

```tsx
import { useDateManager } from '@base-ui/x-date-pickers/managers';
import { PickerField } from '@base-ui/x-date-pickers/PickerField';

// Misses some parts like the clear button for now
function CustomDateField(props) {
  const manager = useDateManager();

  return (
    <PickerField.Root manager={manager} {...props}>
      <PickerField.Content>
        {(section) => (
          <PickerField.Section section={section}>
            <PickerField.SectionSeparator position="before" />
            <PickerField.SectionContent />
            <PickerField.SectionSeparator position="after" />
          </PickerField.Section>
        )}
      </PickerField.Content>
    </PickerField.Root>
  );
}
```

The field can then either be:

1. Used as standalone:

   ```tsx
   <CustomDateField />
   ```

2. Used inside a self-contained `<DatePicker />` component from `@mui/x-date-pickers/DatePicker`:

   ```tsx
   import { DatePicker } from '@mui/x-date-pickers/DatePicker';

   <DatePicker slots={{ field: CustomDateField }} />;
   ```

   :::success
   The concept of slots does not fit this use-case very well, but the exploration of a better DX to override part of the UI in self-contained component is outside the scope of this documentation, so I'm using the tools we currently have.
   :::

3. Used inside a composable `Picker.*` component from `@base-ui/x-date-pickers/Picker`

   ```tsx
   import { useDateManager } from '@base-ui/x-date-pickers/managers';
   import { Picker } from '@base-ui/x-date-pickers/Picker';

   function CustomDatePicker(props) {
     const manager = useDateManager();

     return (
       <Picker.Root manager={manager} {...props}>
         <CustomField />
         <Picker.ResponsivePopper>
           {/** See the pickers documentation for more details */}
         </Picker.ResponsivePopper>
       </Picker.Root>
     );
   }
   ```

   People could of course also inline their field if they want:

   ```tsx
   import { useDateManager } from '@base-ui/x-date-pickers/managers';
   import { Picker } from '@base-ui/x-date-pickers/Picker';

   function CustomDatePicker(props) {
     const manager = useDateManager();

     return (
       <Picker.Root manager={manager} {...props}>
         <PickerField.Root manager={manager} {...props}>
           {/** See demo above */}
         </PickerField.Root>
         <Picker.ResponsivePopper>
           {/** See the pickers documentation for more details */}
         </Picker.ResponsivePopper>
       </Picker.Root>
     );
   }
   ```

   :::warning
   I'm wondering if we could make `manager` optional on `<PickerField.Root />` and by default use the one exposed by the `<Picker.Root />` component in a React context.
   That way people could create a single field component for all their pickers, as long as they don't want to use them as standalone.

   If we go that way, then the `<PickerField.Root />` component would no longer receive the `manager` prop in the component above:

   ```tsx
   <Picker.Root manager={manager} {...props}>
     <PickerField.Root {...props}>{/** See demo above */}</PickerField.Root>
     <Picker.ResponsivePopper>
       {/** See the pickers documentation for more details */}
     </Picker.ResponsivePopper>
   </Picker.Root>
   ```

   :::
