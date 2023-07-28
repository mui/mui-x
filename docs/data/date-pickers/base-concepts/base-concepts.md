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

- The responsive component (e.g. `DatePicker`) which renders the desktop component or the mobile one depending on the device it runs on.

- The desktop component (e.g. `DesktopDatePicker`) which works best for mouse devices and large screens.
  It renders the views inside a popover and allows editing values directly inside the field.

- The mobile component (e.g. `MobileDatePicker`) which works best for touch devices and small screens.
  It renders the view inside a modal and does not allow editing values directly inside the field.

{{"demo": "ResponsivePickers.js"}}

### Find your component

There are many components available, each fitting specific use cases. Use the form below to find the component you need:

{{"demo": "ComponentExplorerNoSnap.js", "hideToolbar": true}}

## Accessibility

Both `Desktop` and `Mobile` Date and Time Pickers are using `role="dialog"` to display their interactive view parts and thus they should follow [Modal accessibility guidelines](/material-ui/react-modal/#accessibility).
This behavior is automated as much as possible, ensuring that the Date and Time Pickers are accessible in most cases.
A correct `aria-labelledby` value is assigned to the dialog component based on the following rules:

- Use `toolbar` id if the toolbar is visible;
- Use the id of the input label if the toolbar is hidden;

:::info
Make sure to provide an `aria-labelledby` prop to `popper` and/or `mobilePaper` `slotProps` in case you are using Date and Time Pickers component with **hidden toolbar** and **without a label**.
:::

## TypeScript

In order to benefit from the [CSS overrides](/material-ui/customization/theme-components/#theme-style-overrides) and [default prop customization](/material-ui/customization/theme-components/#theme-default-props) with the theme, TypeScript users need to import the following types.
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

## Testing caveats

### Responsive components

:::info
Some test environments (i.e. `jsdom`) do not support media query. In such cases, components will be rendered in desktop mode. To modify this behavior you can fake the `window.matchMedia`.
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
