---
title: React Chart library
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts

<p class="description">A fast and extendable library of react chart components for data visualization.</p>

{{"component": "modules/components/ComponentLinkHeader.js", "design": false}}

## Overview

The `@mui/x-charts` is an MIT library for rendering charts relying on [D3.js](https://d3js.org/) for data manipulation and SVG for rendering.
And, like other MUI X components, charts are production-ready components that integrate smoothly into your app.

With a high level of customization, MUI X Charts provides on three levels of customization layers: **single components** with great defaults, extensive **configuration props**, and **subcomponents** for flexible composition.
Additionally, you can also use all the MUI System tools, such as the theme override or the `sx` prop.

## Installation

Run one of the following commands to add the MUI X Charts to your project:
To achieve this goal, the `@mui/x-charts` relies on three levels of customization:

- _single components_ with nice defaults
- extensive _configuration props_
- subcomponents for _composition_

To modify the styling of charts you can rely on all the MUI styling tools, such as the theme override, or the `sx` props.

## Documentation

:::info
This documentation does not follow the usual MUI structure.
:::

Each component has two docs pages:

- The first one describes behaviors that are specific to this component.
- The second one provides a set of basic examples.

For features shared across multiple components, likes axes and legends, visit their corresponding documents:

- [Axis](/x/react-charts/axis/)
- [Custom components](/x/react-charts/components/)
- [Legend](/x/react-charts/legend/)
- [Stacking](/x/react-charts/stacking/)
- [Styling](/x/react-charts/styling/)
- [Tooltips and Highlights](/x/react-charts/tooltip/)

## What's next?

:::info
The `next` tag is used to download the latest, **pre-release**, v7 version.
:::

## Rendering charts

Charts can be rendered in two ways: with a single component or by composing sub-components.

### Single charts

For common use cases, the single component is the recommended way.

Those components' names end with "Chart" and only require the series prop describing the data to render.

They also have plenty of other props to customize the Chart behavior.

{{"demo": "SimpleCharts.js"}}

### Multiple charts

To combine different charts, like lines with bars, you can use composition with the `<ChartContainer />` wrapper.

Inside this wrapper, you can render `<XAxis />`, `<YAxis />`, or any plot component (`<BarPlot />`, `<LinePlot />`, `<AreaPlot />`, `<ScatterPlot />`)

{{"demo": "Combining.js"}}

## Axis management

MUI X Charts have a flexible approach to axis management, supporting multiple-axis charts with any combination of scales and ranges.

Check the [Axis page](/x/react-charts/axis/) for more details.

## Styling

MUI X Charts follows the Material UI styling and features all of the customization tools you'd find there, making tweaking charts as straightforward as designing buttons.

Check the [Styling page](/x/react-charts/styling/) for more details.
Continue to the [Getting started doc](/x/react-charts/getting-started/) and learn how to prepare your application for Charts.
