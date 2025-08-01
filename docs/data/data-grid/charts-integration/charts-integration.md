---
title: Data Grid and Charts integration
---

# Charts integration [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Use the MUI X Charts to visualize data from the Data Grid.</p>

Data Grid seamlessly integrate with MUI X Charts for data visualization with dynamic Chart updates based on Grid state changes (whether through the Grid API or user interactions).

This integration is possible via the `<GridChartsIntegrationContextProvider />` and `<GridChartsRendererProxy />` components from `@mui/x-data-grid-premium` and the `<ChartRenderer />` component from the `@mui/x-charts-premium` package.

Based on its internal models, the Grid calculates and stores the data in a format that is easy to use for chart rendering.
`<ChartRenderer />` reads that data and renders an appropriate chart component with props that depend on the configuration stored in the context.

## Implementing Charts and Data Grid integration

To enable chart integration, pass the `chartsIntegration` prop to the Grid and `<GridChartsPanel />` to the `chartsPanel` slot.
This enables the charts panel and makes it possible for the charts integration context provider state to receive updates.

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

### Basic integration

The demo below shows all the basic elements needed to get the charts integration working.
Use `initialState` to set the initial configuration for the chart renderer.

{{"demo": "GridChartsIntegrationBasic.js", "bg": "inline"}}

## Row grouping

You can integrate charts with grouped and aggregated data.
The Grid's grouping and aggregation states are reflected in the chart.

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

## Server-side data

The following demo shows charts integration with the grid using [Server-side data](/x/react-data-grid/server-side-data/).

{{"demo": "GridChartsIntegrationDataSource.js", "bg": "inline"}}

## Multiple charts

Control multiple charts with one grid by adding more `<GridChartsRendererProxy />` components with unique IDs.
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
- Using the `onRender()` prop on `<GridChartsRendererProxy />` to customize chart rendering for one or all chart types.

The demo below overrides the configuration and removes the option to change the color palette.
Additionally, it adds axes formatting for line and area chart that cannot be controlled via the default customization panel.

If needed, you can extend the configuration to render the UI elements for the additional customized axes.

{{"demo": "GridChartsIntegrationCustomization.js", "bg": "inline"}}

## Live data

The demo below shows how the Charts react to live data updates in the Grid.

{{"demo": "GridChartsIntegrationLiveData.js", "bg": "inline"}}

## Localization

To localize all components included in the Charts integration, choose one method for both the [Grid](/x/react-data-grid/localization/) and [Charts](/x/react-charts/localization/).
We recommend using `createTheme()` and `ThemeProvider`.

To get localized configuration options, use `getLocalizedConfigurationOptions()` instead of `configurationOptions`.

The demo below shows how to incorporate localization into the integration using the `frFr` locale.

{{"demo": "GridChartsIntegrationLocalization.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
