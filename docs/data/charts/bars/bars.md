---
product: charts
title: Charts - Bars
---

# Charts - Bars

<p class="description">Bar charts express quantities through a bar's length, using a common baseline.</p>

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #7885](https://github.com/mui/mui-x/issues/7885) if you want to see it land faster.
>
> 💬 To have a solution that meets your needs, leave a comment on the [same issue](https://github.com/mui/mui-x/issues/7885).
> If you already have a use case for this component, or if you are facing a pain-point with your current solution.

{{"demo": "TestBars.js", "bg": "inline"}}

## Use composition

You can mix all charts together by using composition. The basic structure should be

```jsx
// Provide data and layout
<ChartContainer series={series} width={500} height={500} xAxis={xAxis} yAxis={yAxis}>
  // Add the components to render (even your custom ones)
  <BarPlot />
  <LinePlot />
  <XAxis />
</ChartContainer>
```

{{"demo": "Composition.js", "bg": "inline"}}

## Use responsive container

If you do not want to provide `width` or `height` you can use `<ResponsiveChartContainer />`

{{"demo": "CompositionResponsive.js", "bg": "inline"}}
