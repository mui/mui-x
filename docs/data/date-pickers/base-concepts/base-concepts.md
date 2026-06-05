---
productId: x-date-pickers
title: Date and Time Picker - Base concepts
packageName: '@mui/x-date-pickers'
githubLabel: 'scope: pickers'
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
  It renders the views inside a popover and a field for keyboard editing.

- The mobile component (for example `MobileDatePicker`) which works best for touch devices and small screens.
  It renders the view inside a modal and a field for keyboard editing.

{{"demo": "ResponsivePickers.js"}}

### Find your component

There are many components available, each fitting specific use cases. Use the form below to find the component you need:

{{"demo": "ComponentExplorerNoSnap.js", "hideToolbar": true}}

## Reference date when no value is defined

If `value` or `defaultValue` contains a valid date, this date will be used to initialize the rendered component.

In the demo below, you can see that the calendar is set to April 2022 on mount:

{{"demo": "ReferenceDateUsingValue.js"}}

When `value` and `defaultValue` contain no valid date, the component will try to find a reference date that passes the validation to initialize its rendering:

{{"demo": "ReferenceDateDefaultBehavior.js"}}

You can override this date using the `referenceDate` prop:

{{"demo": "ReferenceDateExplicitDateTimePicker.js"}}

This can also be useful to set the part of the value that will not be selectable in the component.
For example, in a Time Picker, it lets you choose the date of your value:

{{"demo": "ReferenceDateExplicitTimePicker.js"}}

Reference date can be unique for each range component position.
You can pass an array of dates to the `referenceDate` prop to set the reference date for each position in the range.
This might be useful when you want different time values for start and end positions in a Date Time Range Picker.

:::info
Try selecting a date in the demo below, then move to the next position to observe the end reference date usage.
:::

{{"demo": "ReferenceDateRange.js"}}

## Testing caveats

### Responsive components

:::info
Some test environments (for example `jsdom`) do not support media query. In such cases, components will be rendered in desktop mode. To modify this behavior you can fake the `window.matchMedia`.
:::

Be aware that running tests in headless browsers might not pass the default mediaQuery (`pointer: fine`).
In such cases you can [force pointer precision](https://github.com/microsoft/playwright/issues/7769#issuecomment-1205106311) via browser flags or preferences.

### Field components

:::info
To support RTL and some keyboard interactions, field components add some Unicode characters that are invisible, but appear in the input value.
:::

To add tests about a field value without having to care about those characters, you can remove the specific characters before testing the equality.
Here is an example of how to do it.

```js
// Helper removing specific characters
const cleanText = (string) =>
  string.replace(/\u200e|\u2066|\u2067|\u2068|\u2069/g, '');

// Example of a test using the helper
expect(cleanText(input.value)).to.equal('04-17-2022');
```

### End-to-end testing with Playwright

The field's accessible DOM structure renders a visually-hidden, form-submittable `<input>` alongside the `role="group"` container that holds the editable sections.
This hidden input is a stable target for filling a value and asserting it: unlike the visible section spans, its value doesn't contain the invisible Unicode characters mentioned above, so assertions don't need any cleanup.
When the picker has a `label`, that label becomes the accessible name of both the group and the hidden input (the field wires `<label htmlFor={id}>` automatically), which lets you scope the locators on pages that render more than one picker.

Given a labeled picker:

```tsx
<DatePicker label="Departure" />
```

**Recommended: click the field, then fill the hidden input.**
Clicking the visible field focuses it deterministically before the fill resolves:

```ts
const field = page.getByRole('group', { name: 'Departure' });
const input = field.getByRole('textbox', { includeHidden: true });

await field.click();
await input.fill('02/12/2020');
await expect(input).toHaveValue('02/12/2020');
```

`includeHidden: true` is only required to _locate_ the input, since it carries `aria-hidden="true"`.
The `.fill()` itself works because the visually-hidden input is a 1px clipped element (not `display: none`), so it passes Playwright's editability checks.

**Single-locator alternative.**
You can keep everything on the hidden input, focusing it before the fill:

```ts
const input = page.getByRole('textbox', { includeHidden: true, name: 'Departure' });

await input.focus();
await input.fill('02/12/2020');
await expect(input).toHaveValue('02/12/2020');
```

:::warning
Focusing the hidden input redirects focus to the editable sections.
A bare `input.fill()` _without_ the preceding `.focus()` is silently dropped because focus moves away mid-fill - this is especially visible on a pre-filled field, where the value reverts to its previous content.
The explicit `.focus()` works around it, but it relies on the focus settling before the fill resolves, so it can still be flaky under load.
Prefer clicking the field first when you can.
:::

To drive individual sections (for example, keyboard-flow tests), click the field first, then fill each `spinbutton`:

```ts
const field = page.getByRole('group', { name: 'Departure' });

await field.click();
await field.getByRole('spinbutton', { name: 'Month' }).fill('04');
await field.getByRole('spinbutton', { name: 'Day' }).fill('11');
await field.getByRole('spinbutton', { name: 'Year' }).fill('2022');
```

:::warning
The `spinbutton` accessible names are locale-dependent.
Use the localized labels if your tests run against a non-English locale.
:::

:::info
The hidden input's value substitutes placeholders for empty sections (for example, `04/DD/YYYY` if only the month is filled).
For partial-fill assertions, prefer reading section content via `getByRole('spinbutton', { name: ... })`.
:::

A few additional gotchas:

- **Date format and locale**. The hidden input's value uses the picker's configured format. `04/11/2022` parses as April 11 in `en-US` but November 4 in `en-GB`. Pin your tests to a fixed locale, or generate the expected string from the same adapter you configured the picker with.
- **Range pickers expose two sets of sections**. With a single-input range picker each `spinbutton` role appears twice; scope using `.first()` / `.last()` (or `.nth(i)`) to target the start or end side. With a multi-input range picker the two fields are separate `role="group"` containers; target each input via a parent locator.
- **Wait for the picker dialog to detach**. After selecting a date in a picker, the dialog closes asynchronously. If you are asserting selection and experiencing flaky failures, be sure to add `await page.waitForSelector('[role="dialog"]', { state: 'detached' })` (or `[role="tooltip"]` in case of a range picker with multiple input fields) before the next assertion.

## Overriding slots and slot props

Date and Time Pickers are complex components built using many subcomponents known as **slots**.
Slots are commonly filled by React components that you can override using the `slots` prop.
You can also pass additional props to the available slots using the `slotProps` prop.
Learn more about the mental model of slots in the Base UI documentation: [Overriding component structure](https://v6.mui.com/base-ui/guides/overriding-component-structure/).

You can find the list of available slots for each component in its respective [API reference](/x/api/date-pickers/date-picker/#slots) doc.

Some parts of the Pickers' UI are built on several nested slots. For instance, the adornment of the `TextField` on `DatePicker` contains three slots (`inputAdornment`, `openPickerButton`, and `openPickerIcon`) that you can use depending on what you are trying to customize.

{{"demo": "CustomSlots.js"}}

:::info
Learn more about overriding slots in the doc page about [Custom slots and subcomponents](/x/react-date-pickers/custom-components/).
:::
