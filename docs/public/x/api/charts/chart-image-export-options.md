# ChartImageExportOptions API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Image export](https://mui.com/x/react-charts/export/#export-as-image)

## Import

```jsx
import { ChartImageExportOptions } from '@mui/x-charts-pro'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| copyStyles | `boolean` | `true` | No |  |
| fileName | `string` | `The title of the document the chart belongs to` | No |  |
| onBeforeExport | `(iframe: HTMLIFrameElement) => Promise<void> \| void` | - | No |  |
| quality | `number` | `0.9` | No |  |
| type | `'image/png' \| string` | `'image/png'` | No |  |

> **Note**: The `ref` is forwarded to the root element.