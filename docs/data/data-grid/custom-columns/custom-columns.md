# Data Grid - Custom columns

<p class="description">Create custom column types.</p>

You can extend the [built-in column types](/x/react-data-grid/column-definition/#column-types) with your own by simply spreading the necessary properties.

The demo below defines a new column type: `usdPrice` that extends the native `number` column type.

```ts
const usdPrice: GridColTypeDef = {
  type: 'number',
  width: 130,
  valueFormatter: (value) => valueFormatter.format(Number(value)),
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

## Date pickers

By default, the data grid uses native browser inputs for editing `date` and `dateTime` columns.

While [MUI X Date / Time Pickers](/x/react-date-pickers/getting-started/) are not supported by the data grid out of the box yet, it is easy to integrate them by creating [custom edit components](/x/react-data-grid/editing/#create-your-own-edit-component) and [custom filter operators](/x/react-data-grid/filtering/customization/#create-a-custom-operator).

The example below uses `@mui/x-date-pickers` for both `date` and `dateTime` column types:

{{"demo": "EditingWithDatePickers.js", "bg": "inline", "defaultCodeOpen": false }}

:::info
You can change the date format by importing different locale (`en-US` locale is used in the example above).
See [Localization](/x/react-date-pickers/localization/) for more information.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
