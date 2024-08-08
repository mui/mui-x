---
productId: x-date-pickers
title: Date and Time Picker - Base concepts
packageName: '@mui/x-date-pickers'
githubLabel: 'component: pickers'
materialDesign: https://m2.material.io/components/date-pickers
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
---

# Date and Time Pickers - Base concepts

<p class="description">The Date and Time Pickers expose a lot of components to fit your every need.</p>

## Controlled value

All the components have a `value` / `onChange` API to set and control the values:

{{"demo": "ControlledComponent.js"}}

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

{{"demo": "BasicDatePicker.js", "hideToolbar": true, "bg": "inline"}}

- For input-only editing, use the _Field_ components:

{{"demo": "BasicDateField.js", "hideToolbar": true, "bg": "inline"}}

- For inline editing, use the _Calendar / Clock_ components:

{{"demo": "BasicDateCalendar.js", "hideToolbar": true, "bg": "inline"}}

:::info
Each _Picker_ is a combination of one _Field_ and one or several _Calendar / Clock_ components.
For example, the `DatePicker` is the combination of the `DateField` and the `DateCalendar`.

The _Calendar / Clock_ components are rendered inside a _Popover_ on desktop and inside a _Modal_ on mobile.
:::

### Date or time editing?

The Date and Time Pickers are divided into six families of components.
The demo below shows each one of them using their field component:

{{"demo": "ComponentFamilies.js"}}

### Responsiveness

Each _Picker_ is available in a responsive, desktop and mobile variant:

- The responsive component (for example `DatePicker`) which renders the desktop component or the mobile one depending on the device it runs on.

- The desktop component (for example `DesktopDatePicker`) which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The mobile component (for example `MobileDatePicker`) which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

{{"demo": "ResponsivePickers.js"}}

### Find your component

There are many components available, each fitting specific use cases. Use the form below to find the component you need:

{{"demo": "ComponentExplorerNoSnap.js", "hideToolbar": true}}

## Reference date when no value is defined

If `value` or `defaultValue` contains a valid date, this date will be used to initialize the rendered component.

In the demo below, you can see that the calendar is set to April 2022 on mount:

{{"demo": "ReferenceDateUsingValue.js"}}

When `value` and `defaultValue` contains no valid date, the component will try to find a reference date that passes the validation to initialize its rendering:

{{"demo": "ReferenceDateDefaultBehavior.js"}}

You can override this date using the `referenceDate` prop:

{{"demo": "ReferenceDateExplicitDateTimePicker.js"}}

This can also be useful to set the part of the value that will not be selectable in the component.
For example, in a Time Picker, it allows you to choose the date of your value:

{{"demo": "ReferenceDateExplicitTimePicker.js"}}

## TypeScript

### Theme augmentation

To benefit from the [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users need to import the following types.
Internally, it uses module augmentation to extend the default theme structure.

```tsx
// When using TypeScript 4.x and above
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-date-pickers-pro/themeAugmentation';
// When using TypeScript 3.x and below
import '@mui/x-date-pickers/themeAugmentation';
import '@mui/x-date-pickers-pro/themeAugmentation';

const theme = createTheme({
  components: {
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
```

:::info
You don't have to import the theme augmentation from both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` when using `@mui/x-date-pickers-pro`.
Importing it from `@mui/x-date-pickers-pro` is enough.
:::

### Typing of the date

The Date and Time Pickers components are compatible with several date libraries
that use different formats to represent their dates
(`Date` object for `date-fns`, `daysjs.Dayjs` object for `days-js`, etc.).
To correctly type all the props that are date-related, the adapters override a global type named `PickerValidDate`
to allow the usage of their own date format.
This allows TypeScript to throw an error if you try to pass `value={new Date()}` to a component using `AdapterDayjs` for instance.

If you run into TypeScript errors such as `DesktopDatePickerProps<Date> error Type 'Date' does not satisfy the constraint 'never'`,
it is probably because you are not importing the adapter in the same TypeScript project as the rest of your codebase.
You can fix it by manually importing the adapter in some file of your project as follows:

```ts
// Replace `AdapterDayjs` with the adapter you are using.
import type {} from '@mui/x-date-pickers/AdapterDayjs';
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
Learn more about the mental model of slots in the Base UI documentation: [Overriding component structure](/base-ui/guides/overriding-component-structure/).

You can find the list of available slots for each component in its respective [API reference](/x/api/date-pickers/date-picker/#slots) doc.

Some parts of the Pickers' UI are built on several nested slots. For instance, the adornment of the `TextField` on `DatePicker` contains three slots (`inputAdornment`, `openPickerButton`, and `openPickerIcon`) that you can use depending on what you are trying to customize.

{{"demo": "CustomSlots.js"}}

:::info
Learn more about overriding slots in the doc page about [Custom slots and subcomponents](/x/react-date-pickers/custom-components/).
:::
