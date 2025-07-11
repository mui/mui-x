---
title: Data Grid & Charts integration
---

# Charts integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Visualize grid data with charts.</p>

Data Grid integrates seamlessly with MUI X Charts, allowing data visualization and enabling dynamic chart updates based on Grid state changes, either through the Grid API or user interaction.

This integration is possible via the `<GridChartsIntegrationContextProvider />` and `<GridChartsRendererProxy />` components from `@mui/x-data-grid-premium` and the `<ChartRenderer />` component from the `@mui/x-charts-premium` package.

Based on its internal models, the Grid calculates and stores the data in a format that is easy to use for chart rendering.
`<ChartRenderer />` reads that data and renders an appropriate chart component with props that depend on the configuration stored in the context.

## Setup

To enable chart integration, pass the `chartsIntegration` prop to the Grid and `<GridChartsPanel />` to the `chartsPanel` slot.
This will enable the charts panel and allow updates to the charts integration context provider state.

```tsx
<DataGridPremium
  chartsIntegration
  slots={{
    chartsPanel: GridChartsPanel,
    // ...other slots
  }}
  // ...other props
/>
```

Wrap your Grid and chart renderer in a `<GridChartsIntegrationContextProvider />`.
Use `<GridChartsRendererProxy />` to connect the chart renderer to the Grid's state updates.

```tsx
<GridChartsIntegrationContextProvider>
  <DataGridPremium
  // ...props
  />
  <GridChartsRendererProxy id="main" renderer={ChartsRenderer} />
</GridChartsIntegrationContextProvider>
```

## Basic integration

The demo below shows all the basic elements needed to get the charts integration working.
Use `initialState` to set the initial configuration for the chart renderer.

{{"demo": "GridChartsIntegrationBasic.js", "bg": "inline"}}

## Row grouping

You can integrate charts with grouped and aggregated data.
The Grid's grouping and aggregation state will be reflected in the chart.

{{"demo": "GridChartsIntegrationRowGrouping.js", "bg": "inline"}}

## Pivoting

[Pivoting](/x/react-data-grid/pivoting/) creates columns dynamically, based on the pivoting model.
The names of those columns are determined by the values used to generate them, which makes it impossible to initialize `series` with those values.
Use the [`updateSeries()`](/x/api/data-grid/grid-api/#grid-api-prop-updateSeries) to update the chart's series after the columns are created.

```tsx
const apiRef = useGridApiRef();

React.useEffect(() => {
  const handleColumnVisibilityModelChange = () => {
    // Get dynamically created columns
    const unwrappedGroupingModel = Object.keys(
      gridColumnGroupsUnwrappedModelSelector(apiRef),
    );
    // Update chart series
    apiRef.current?.updateSeries(
      'main',
      unwrappedGroupingModel
        .filter((field) => field.endsWith('quantity'))
        .slice(0, 5)
        .map((field, index) => ({ field, hidden: index >= 3 })),
    );
  };
  return apiRef.current?.subscribeEvent(
    'columnVisibilityModelChange',
    handleColumnVisibilityModelChange,
  );
}, [apiRef]);
```

{{"demo": "GridChartsIntegrationPivoting.js", "bg": "inline"}}

## Multiple charts

Control multiple charts with one grid by adding more `<GridChartsRendererProxy />` components with unique `id`s.
Each chart can have its own configuration and state.

```tsx
<GridChartsRendererProxy id="quantity" label="Quantity" renderer={ChartsRenderer} />
<GridChartsRendererProxy id="feeRate" label="Fee Rate" renderer={ChartsRenderer} />
```

{{"demo": "GridChartsIntegrationMultipleCharts.js", "bg": "inline"}}

## Customization

Customize the chart configuration and rendering by:

- Overriding configuration options to force certain values.
  Use it to hide or lock configuration controls in the panel.
- Using `onRender()` prop on `<GridChartsRendererProxy />` to customize chart rendering for a single or all chart types.

```tsx
const onRender = (type, props, Component) => {
  if (type !== 'line') return <Component {...props} />;
  return <LineChart {...props} grid={{ vertical: true, horizontal: true }} />;
};

<GridChartsRendererProxy id="main" renderer={ChartsRenderer} onRender={onRender} />;
```

{{"demo": "GridChartsIntegrationCustomization.js", "bg": "inline"}}

## Live data

The demo below shows charts' responsiveness to live data updates in the Grid.

{{"demo": "GridChartsIntegrationLiveData.js", "bg": "inline"}}

## Localization

To localize all components included in the charts integration, choose one of the ways to localize [Grid](/x/react-data-grid/localization/) and [Charts](/x/react-charts/localization/).
Easiest way is to use `createTheme()` and `ThemeProvider`.

In addition to this, use `getLocalizedConfigurationOptions()` instead of `configurationOptions` to get localized configuration options.

The demo below shows the integration using `frFr` locale.

{{"demo": "GridChartsIntegrationLocalization.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
