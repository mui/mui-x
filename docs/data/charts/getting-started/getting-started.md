---
title: React Chart library - Getting started
githubLabel: 'component: charts'
packageName: '@mui/x-charts'
---

# Charts - Getting Started

<p class="description">Get started with the MUI X Charts components. Install the package, configure your application, and start using the components.</p>

## Installation

Run one of the following commands to add the MUI X Charts to your project:

<codeblock storageKey="package-manager">
```bash npm
npm install @mui/x-charts@next
```

```bash yarn
yarn add @mui/x-charts@next
```

```bash pnpm
pnpm add @mui/x-charts@next
```

</codeblock>

:::info
The `next` tag is used to download the latest, **pre-release**, v7 version.
Remove it to get the current stable version.
:::

### Usage with Next.js

If you're using MUI X Charts with Next.js, you might face the following error:

```bash
[ESM][charts] Doesn't build due to require() of ES Module (ERR_REQUIRE_ESM)
```

To solve it, transpile the package by adding `transpilePackages: ['@mui/x-charts']` to your `next.config.js` file.
Visit [this GitHub issue and comment](https://github.com/mui/mui-x/issues/9826#issuecomment-1658333978) for details.

## Displaying Charts

A Chart can be rendered in one of two ways: as a single component, or by composing subcomponents.

### Single Charts

For common use cases, the single component is the recommended way.
Those components' names end with "Chart", as opposed to "Plot", and only require the series prop describing the data to render.

{{"demo": "SimpleCharts.js"}}

### Composed Charts

To combine different Charts, like Lines with Bars, you can use composition with the `ChartContainer` wrapper.

Inside this wrapper, render either axis components, such as `XAxis` and `YAxis`, or any plot component like `BarPlot`, `LinePlot`, `AreaPlot`, and `ScatterPlot`.

Visit the [Composition page](/x/react-charts/composition/) for more details.

{{"demo": "Combining.js"}}

## Axis management

MUI X Charts have a flexible approach to axis management, supporting multiple-axis charts with any combination of scales and ranges.

Visit the [Axis page](/x/react-charts/axis/) for more details.

## Styling

MUI X Charts follows the Material UI styling and features all of the customization tools you'd find there, making tweaking charts as straightforward as designing buttons.

Visit the [Styling page](/x/react-charts/styling/) for more details.
