---
title: Charts - useLegend
productId: x-charts
---

# useLegend

<p class="description">Access formatted legend data for creating custom legend components.</p>

The `useLegend` hook provides access to formatted legend data that can be used to create custom legend components.

## Usage

```js
import { useLegend } from '@mui/x-charts/hooks';

function CustomLegend() {
  const { items } = useLegend();
  // items: Array of legend items with id, label, color, markType
}
```

{{"demo": "UseLegendDemo.js"}}

## Return value

The hook returns an object with the following structure:

```ts
{
  items: LegendItemParams[]
}
```

## LegendItemParams

Each legend item contains the following properties:

| Property   | Type                                          | Description                                  |
| :--------- | :-------------------------------------------- | :------------------------------------------- |
| `id`       | `string \| number`                            | The identifier of the legend element         |
| `label`    | `string`                                      | The text label to display                    |
| `color`    | `string`                                      | The color associated with the legend item    |
| `markType` | `'square' \| 'circle' \| 'line' \| Component` | The type of mark to display                  |
| `seriesId` | `string`                                      | The identifier of the series                 |
| `itemId`   | `string \| number`                            | _(optional)_ The identifier of the pie slice |

## Caveats

This hook requires being used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
