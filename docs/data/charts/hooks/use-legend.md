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

{{"demo": "UseLegend.js"}}

## Return value

The hook returns an object with the following structure:

```ts
{
  items: LegendItemParams[]
}
```

The [LegendItemParams](/x/api/charts/legend-item-params/) interface defines the structure of each legend item.

## Caveats

This hook must be used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
