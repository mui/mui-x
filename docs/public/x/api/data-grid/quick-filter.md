# QuickFilter API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Quick Filter component](/x/react-data-grid/components/quick-filter)

## Import

```jsx
import { QuickFilter } from '@mui/x-data-grid/components';
// or
import { QuickFilter } from '@mui/x-data-grid';
// or
import { QuickFilter } from '@mui/x-data-grid-pro';
// or
import { QuickFilter } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| debounceMs | `number` | `150` | No |  |
| defaultExpanded | `bool` | `false` | No |  |
| expanded | `bool` | - | No |  |
| formatter | `function(values: Array<any>) => string` | `(values: string[]) => values.join(' ')` | No |  |
| onExpandedChange | `function(expanded: boolean) => void` | - | No |  |
| parser | `function(input: string) => Array<any>` | `(searchText: string) => searchText.split(' ').filter((word) => word !== '')` | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/quickFilter/QuickFilter.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/quickFilter/QuickFilter.tsx)