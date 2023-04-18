---
product: charts
title: Charts - Axis
---

# Charts - Axis

<p class="description">Axis provides associate values to element positions</p>

Axis are used in the following charts: `<LineChart />`, `<BarChart />`, `<ScatterChart />`.

## Defining axis

Like your data, axis definition play a central role in the charts rendering.
It's responsible of the mapping between your data and elements positions.

You can define custom axis by using `xAxis` and `yAxis` props.
Those props expect an array of objects.

Here is a demonstration with two lines with the same data.
But one uses a linear, and the other a log axis.

Each axis definition is identified by its property `id`.
And series specify the axis they use with `xAxisKey` and `yAxisKey` properties.

{{"demo": "ScaleExample.js", "bg": "inline"}}

### Axis type

The axis type is specified by its property `scaleName` which expect one of the following values:

- `'band'`: Split the axis in equal band. Mostly used for bar charts.
- `'linear'`, `'log'`, `'sqrt'`: Map numerical values to the space available for the chart. `'linear'` is the default behavior.
- `'time'`, `'utc'`: Map javascript `Date()` object to the space available for the chart.

### Axis data

The axis definition object also includes a `data` properties.
Which expects an array of value coherent with the `scaleName`:

- For `'linear'`, `'log'`, or `'sqrt'` it should contain numerical values
- For `'time'` or `'utc'` it should contain `Date()` objects
- For `'band'` it can contain `string`, or numerical values

Moreover, some series types require specific axis types:

- line plots require a x-axis to have `data` provided
- bar blots require a x-axis with `scaleName='band'` and some `data` provided.

### Axis sub domain

By default, the axis domain is computed such that all your data are visible.
To show a specific range of values, you can provide properties `min` and/or `max` to axis definitions.

```js
xAxis={[
  {
    id: 'axisId',
    min: 10,
    max: 50,
  }
]}
```

{{"demo": "MinMaxExample.js", "bg": "inline"}}

## Axis customization

Beside the impact of axis definition on the rendered chart, you can also customize the axis rendering.

### Position

To do that, charts components provide 4 props names `topAxis`, `rightAxis`, `bottomAxis`, and `leftAxis` allowsing to define the 4 axis of the chart.
Those pros can accept three type of value:

- `null` to do not display any axis
- `string` which should correspond to the id of a `xAxis` for top and bottom. Or to the id of a `yAxis` for left and right.
- `object` which will be passed as props to `<XAxis />` or `<YAxis />`. It allows to specify which axis should be represent, and to customize the design of the axis.

{{"demo": "ModifyAxisPosition.js", "bg": "inline"}}

### Rendering

To customize how axis are rendered, here is an interactive demonstration of the axis props (Work in progress)

{{"demo": "AxisCustomizationNoSnap.js", "hideToolbar": true, "bg": "inline"}}

### Composition

If you are using composition, you have to provide the axis settings in the `<ChartContainer />` by using `xAxis` and `yAxis` props.

It will provides all the scaling properties to its children, and allows you to use `<XAxis/>` and `<YAxis/>`.
Those components require a props `axisId` to link them to an axis you defined in the `<ChartContainer />`.

You can chose their position with `position` props which accept `'top'`/`'bottom'` for `<XAxis />` and `'left'`/`'right'` for `<YAxis />`.
Other props are similar to the one defined in the [previous section](/x/react-charts/axis/#rendering).

{{"demo": "AxisWithComposition.js", "bg": "inline"}}
