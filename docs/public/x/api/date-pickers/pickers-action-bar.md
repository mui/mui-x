# PickersActionBar API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom slots and subcomponents](/x/react-date-pickers/custom-components/)
- [Custom layout](/x/react-date-pickers/custom-layout/)

## Import

```jsx
import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
// or
import { PickersActionBar } from '@mui/x-date-pickers';
// or
import { PickersActionBar } from '@mui/x-date-pickers-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| actions | `Array<'accept' \| 'cancel' \| 'clear' \| 'next' \| 'nextOrAccept' \| 'today'>` | ``[]` for Pickers with one selection step which `closeOnSelect`.
- `['cancel', 'nextOrAccept']` for all other Pickers.` | No |  |
| disableSpacing | `bool` | `false` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element.

> Any other props supplied will be provided to the root element (native element).

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | root | Styles applied to the root element. |
| - | spacing | Styles applied to the root element unless `disableSpacing={true}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-date-pickers/src/PickersActionBar/PickersActionBar.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-date-pickers/src/PickersActionBar/PickersActionBar.tsx)