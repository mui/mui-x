---
productId: x-date-pickers
---

# Migration from v6 to v7

<!-- #default-branch-switch -->

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v6 to v7.</p>

## Introduction

TBD

## Start using the new release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-date-pickers": "6.x.x",
+"@mui/x-date-pickers": "next",
```

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.

### Rename `components` to `slots`

The `components` and `componentsProps` props are renamed to `slots` and `slotProps` props respectively.
This is a slow and ongoing effort between the different MUI libraries.
To smooth the transition, they were deprecated during the [v6](/x/migration/migration-pickers-v5/#rename-components-to-slots-optional).
And are removed from the v7.

If not already done, this modification can be handled by the codemod

```bash
npx @mui/x-codemod v7.0.0/pickers/ <path>
```

Take a look at [the RFC](https://github.com/mui/material-ui/issues/33416) for more information.

:::warning
If this codemod is applied on a component with both a `slots` and a `components` prop, the output will contain two `slots` props.
You are then responsible for merging those two props manually.

For example:

```tsx
// Before running the codemod
<DatePicker
  slots={{ textField: MyTextField }}
  components={{ toolbar: MyToolbar }}
/>

// After running the codemod
<DatePicker
  slots={{ textField: MyTextField }}
  slots={{ toolbar: MyToolbar }}
/>
```

The same applies to `slotProps` and `componentsProps`.
:::

## Field components

### Replace the section `hasLeadingZeros` property

:::success
This only impacts you if you are using the `unstableFieldRef` prop to imperatively access the section object.
:::

The property `hasLeadingZeros` has been removed from the sections in favor of the more precise `hasLeadingZerosInFormat` and `hasLeadingZerosInInput` properties.
To keep the same behavior, you can replace it by `hasLeadingZerosInFormat`

```diff
 const fieldRef = React.useRef<FieldRef<FieldSection>>(null);

 React.useEffect(() => {
     const firstSection = fieldRef.current!.getSections()[0]
-    console.log(firstSection.hasLeadingZeros)
+    console.log(firstSection.hasLeadingZerosInFormat)
 }, [])

 return (
   <DateField unstableFieldRef={fieldRef} />
 );
```

## Adapters

:::success
The following breaking changes only impact you if you are using the adapters outside the pickers like displayed in the following example:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const adapter = new AdapterDays();
adapter.isValid(dayjs('2022-04-17T15:30'));
```

If you are just passing an adapter to `LocalizationProvider`, then you can safely skip this section.
:::

### Restrict the input format of the `isEqual` method

The `isEqual` method used to accept any type of value for its two input and tried to parse them before checking if they were equal.
The method has been simplified and now only accepts an already-parsed date or `null` (ie: the same formats used by the `value` prop in the pickers)

```diff
 const adapterDayjs = new AdapterDayjs();
 const adapterLuxon = new AdapterLuxon();
 const adapterDateFns = new AdapterDateFns();
 const adapterMoment = new AdatperMoment();

 // Supported formats
 const isValid = adapterDayjs.isEqual(null, null); // Same for the other adapters
 const isValid = adapterLuxon.isEqual(DateTime.now(), DateTime.fromISO('2022-04-17'));
 const isValid = adapterMoment.isEqual(moment(), moment('2022-04-17'));
 const isValid = adapterDateFns.isEqual(new Date(), new Date('2022-04-17'));

 // Non-supported formats (JS Date)
- const isValid = adapterDayjs.isEqual(new Date(), new Date('2022-04-17'));
+ const isValid = adapterDayjs.isEqual(dayjs(), dayjs('2022-04-17'));

- const isValid = adapterLuxon.isEqual(new Date(), new Date('2022-04-17'));
+ const isValid = adapterLuxon.isEqual(DateTime.now(), DateTime.fromISO('2022-04-17'));

- const isValid = adapterMoment.isEqual(new Date(), new Date('2022-04-17'));
+ const isValid = adapterMoment.isEqual(moment(), moment('2022-04-17'));

 // Non-supported formats (string)
- const isValid = adapterDayjs.isEqual('2022-04-16', '2022-04-17');
+ const isValid = adapterDayjs.isEqual(dayjs('2022-04-17'), dayjs('2022-04-17'));

- const isValid = adapterLuxon.isEqual('2022-04-16', '2022-04-17');
+ const isValid = adapterLuxon.isEqual(DateTime.fromISO('2022-04-17'), DateTime.fromISO('2022-04-17'));

- const isValid = adapterMoment.isEqual('2022-04-16', '2022-04-17');
+ const isValid = adapterMoment.isEqual(moment('2022-04-17'), moment('2022-04-17'));

- const isValid = adapterDateFns.isEqual('2022-04-16', '2022-04-17');
+ const isValid = adapterDateFns.isEqual(new Date('2022-04-17'), new Date('2022-04-17'));
```

### Restrict the input format of the `isValid` method

The `isValid` method used to accept any type of value and tried to parse them before checking their validity.
The method has been simplified and now only accepts an already-parsed date or `null`.
Which is the same type as the one accepted by the components `value` prop.

```diff
 const adapterDayjs = new AdapterDayjs();
 const adapterLuxon = new AdapterLuxon();
 const adapterDateFns = new AdapterDateFns();
 const adapterMoment = new AdatperMoment();

 // Supported formats
 const isValid = adapterDayjs.isValid(null); // Same for the other adapters
 const isValid = adapterLuxon.isValid(DateTime.now());
 const isValid = adapterMoment.isValid(moment());
 const isValid = adapterDateFns.isValid(new Date());

 // Non-supported formats (JS Date)
- const isValid = adapterDayjs.isValid(new Date('2022-04-17'));
+ const isValid = adapterDayjs.isValid(dayjs('2022-04-17'));

- const isValid = adapterLuxon.isValid(new Date('2022-04-17'));
+ const isValid = adapterLuxon.isValid(DateTime.fromISO('2022-04-17'));

- const isValid = adapterMoment.isValid(new Date('2022-04-17'));
+ const isValid = adapterMoment.isValid(moment('2022-04-17'));

 // Non-supported formats (string)
- const isValid = adapterDayjs.isValid('2022-04-17');
+ const isValid = adapterDayjs.isValid(dayjs('2022-04-17'));

- const isValid = adapterLuxon.isValid('2022-04-17');
+ const isValid = adapterLuxon.isValid(DateTime.fromISO('2022-04-17'));

- const isValid = adapterMoment.isValid('2022-04-17');
+ const isValid = adapterMoment.isValid(moment('2022-04-17'));

- const isValid = adapterDateFns.isValid('2022-04-17');
+ const isValid = adapterDateFns.isValid(new Date('2022-04-17'));
```
