---
title: Charts - useLegend
productId: x-charts
---

# useLegend

<p class="description">Get formatted legend data to build custom legend components.</p>

The `useLegend()` hook returns formatted legend data for building custom legend components.

## Usage

```js
import { useLegend } from '@mui/x-charts/hooks';

function CustomLegend() {
  const { items } = useLegend();
  // items: Array of legend items with id, label, color, markType
}
```

{{"demo": "UseLegend.js"}}

## Return value

`useLegend()` returns an object with the following structure:

```ts
{
  items: LegendItemParams[]
}
```

The [`LegendItemParams`](/x/api/charts/legend-item-params/) interface defines the structure of each legend item.

## Caveats

You can only use this hook within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
