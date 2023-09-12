# Data Grid - Custom columns

<p class="description">Create custom column types.</p>

You can extend the [built-in column types](/x/react-data-grid/column-definition/#column-types) with your own by simply spreading the necessary properties.

The demo below defines a new column type: `usdPrice` that extends the native `number` column type.

```ts
const usdPrice: GridColTypeDef = {
  type: 'number',
  width: 130,
  valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
  cellClassName: 'font-tabular-nums',
};
```

{{"demo": "CustomColumnTypesGrid.js", "bg": "inline"}}

:::info
If an unsupported column type is used, the `string` column type will be used instead.
:::

## Sparkline

Sparkline charts can be useful as an overview of data trends.

In the demo below, we create a custom column type using the `GridColTypeDef` interface and use the [Sparkline](/x/react-charts/sparkline/) component from [`@mui/x-charts`](/x/react-charts/) package in the [`renderCell`](/x/react-data-grid/column-definition/#rendering-cells) property.

{{"demo": "SparklineColumn.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
