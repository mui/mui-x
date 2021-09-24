---
title: Charts
---

# Charts

<p class="description">The chart library you always wanted. Available in MIT and Commercial versions (Not really, but watch this space!).</p>

MUI charts are built using SVG elements and a lightweight dependency on d3.
Build your own charts using the decoupled, reusable React components avialable in the package.

## Overview

The chart library is the product of a hackthon at the first MUI company retreat, with a team of local and remote participants iterating on some components produced by one of the team.

It's hacky, buggy, and incomplete; but we're proud of what we achieved in a limited amount of time, and hope that it will ultimately form the basis of a set of MIT chart components, with a paid extension for more advanced and esoteric ones.

This is the set of charts available at this moment:

### Line Chart

{{"demo": "pages/components/charts/overview/LineChart.js"}}

```jsx
<LineChart {...chartProps}>
  <Grid disableX />
  <XAxis label="Year" />
  <YAxis label="Size" />
  <Line series={0} stroke="red" fill="pink" label="Line 1" />
  <Line series={1} stroke="green" fill="linhtgreen" label="Line 2" />
  <Line series={2} stroke="blue" fill="lightblue" label="Line 3" />
  <Legend position="top" spacing={55} />
</LineChart>
```

Note that each part of the chart (the grid, the axes, the lines, the legend etc.) is defined as a component, rendered as a children in the chart.
You can add/remove any part of the chart that you don't wish to use, and you will not have that component in your bundle.

### Bar Charts

{{"demo": "pages/components/charts/overview/MultiBarChart.js"}}

### Scatter charts

{{"demo": "pages/components/charts/overview/ScatterChart.js"}}

For more details and demos, take a look at each chart's dedicated page.
