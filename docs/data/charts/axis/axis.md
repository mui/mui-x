---
title: Charts - Axis
---

# Charts - Axis

<p class="description">Axis provides associate values to element positions.</p>

Axes are used in the following charts: `<LineChart />`, `<BarChart />`, `<ScatterChart />`.

## Defining axis

Like your data, axis definition plays a central role in the chart rendering.
It's responsible for the mapping between your data and element positions.

You can define custom axes by using `xAxis` and `yAxis` props.
Those props expect an array of objects.

Here is a demonstration with two lines with the same data.
But one uses a linear, and the other a log axis.

Each axis definition is identified by its property `id`.
And series specify the axis they use with `xAxisKey` and `yAxisKey` properties.

{{"demo": "ScaleExample.js"}}

:::info
The management of those ids is for advanced use cases, such as charts with multiple axes.
Or customized axes.

If you do not provide a `xAxisKey` or `yAxisKey`, the series will use the first axis defined.

That's why in most of the demonstrations with single x and y axis you will not see definitions of axis `id`, `xAxisKey`, or `yAxisKey`.
Those demonstrations use the defaultized values.
:::

### Axis type

The axis type is specified by its property `scaleType` which expect one of the following values:

- `'band'`: Split the axis in equal band. Mostly used for bar charts.
- `'linear'`, `'log'`, `'sqrt'`: Map numerical values to the space available for the chart. `'linear'` is the default behavior.
- `'time'`, `'utc'`: Map JavaScript `Date()` object to the space available for the chart.

### Axis data

The axis definition object also includes a `data` property.
Which expects an array of value coherent with the `scaleType`:

- For `'linear'`, `'log'`, or `'sqrt'` it should contain numerical values
- For `'time'` or `'utc'` it should contain `Date()` objects
- For `'band'` it can contain `string`, or numerical values

Some series types also require specific axis attributes:

- line plots require an `xAxis` to have `data` provided
- bar plots require an `xAxis` with `scaleType='band'` and some `data` provided.

### Axis sub domain

By default, the axis domain is computed such that all your data is visible.
To show a specific range of values, you can provide properties `min` and/or `max` to the axis definition.

```js
xAxis={[{ min: 10, max: 50,  }]}
```

{{"demo": "MinMaxExample.js"}}

### Ticks positions

You can customize the number of ticks with the property `tickNumber`.

:::info
This number is not the exact number of ticks displayed.

Thanks to d3, ticks are placed to be human-readable.
For example, ticks for time axes will be placed on special values (years, days, half-days, ...).

If you set `tickNumber=5` but there are only 4 years to display in the axis, the component might chose to render ticks on the 4 years, instead of putting 5 ticks on some months.
:::

As a helper, you can also provide `tickMinStep` and `tickMaxStep` which will compute `tickNumber` such that the step between two ticks respect those min/max values.

Here the top axis has a `tickMinStep` of half a day, and the bottom axis a `tickMinStep` of a full day.

{{"demo": "TickNumber.js"}}

## Axis customization

You can further customize the axis rendering besides the axis definition.

### Position

Charts components provide 4 props: `topAxis`, `rightAxis`, `bottomAxis`, and `leftAxis` allowing to define the 4 axes of the chart.
Those pros can accept three type of value:

- `null` to not display the axis
- `string` which should correspond to the id of a `xAxis` for top and bottom. Or to the id of a `yAxis` for left and right.
- `object` which will be passed as props to `<XAxis />` or `<YAxis />`. It allows to specify which axis should be represent, and to customize the design of the axis.

{{"demo": "ModifyAxisPosition.js"}}

### Rendering

Axes rendering can be further customized. Below is an interactive demonstration of the axis props.

{{"demo": "AxisCustomizationNoSnap.js", "hideToolbar": true, "bg": "inline"}}

### Composition

If you are using composition, you have to provide the axis settings in the `<ChartContainer />` by using `xAxis` and `yAxis` props.

It will provide all the scaling properties to its children, and allows you to use `<XAxis/>` and `<YAxis/>` components as children.
Those components require an `axisId` prop to link them to an axis you defined in the `<ChartContainer />`.

You can choose their position with `position` props which accept `'top'`/`'bottom'` for `<XAxis />` and `'left'`/`'right'` for `<YAxis />`.
Other props are similar to the ones defined in the [previous section](/x/react-charts/axis/#rendering).

{{"demo": "AxisWithComposition.js"}}
