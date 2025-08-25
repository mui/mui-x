"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
function RenderCellParamsExplicitTyping() {
    return (<x_data_grid_1.DataGrid rows={[]} columns={[
            {
                field: 'price1',
                renderCell: function (params) {
                    return params.value.toUpperCase();
                },
            },
            {
                field: 'price2',
                renderCell: function (params) {
                    return params.value.toUpperCase();
                },
            },
            {
                field: 'price3',
                renderCell: function (params) {
                    return params.row.price.toUpperCase();
                },
            },
            {
                field: 'price4',
                renderCell: function (params) {
                    return params.row.price.toUpperCase();
                },
            },
            {
                field: 'price5',
                renderCell: function (params) {
                    // @ts-expect-error `toUpperCase` doesn't exist in number
                    return params.formattedValue.toUpperCase();
                },
            },
            {
                field: 'price6',
                type: 'actions',
                getActions: function (params) {
                    // @ts-expect-error Property tax does not exist on type { price: string }
                    params.row.tax;
                    params.row.price.toUpperCase();
                    return [];
                },
            },
            {
                field: 'price7',
                type: 'actions',
                getActions: function (params) {
                    // row is typed as any by default
                    params.row.price.toUpperCase();
                    return [];
                },
            },
        ]}/>);
}
function CellParamsFromRowModel() {
    var actionColumn = {
        field: 'price1',
        type: 'actions',
        getActions: function (params) {
            // @ts-expect-error `toUpperCase` does not exist on number
            return params.row.price1.toUpperCase(); // fails
        },
    };
    var priceCol = {
        field: 'price2',
        renderCell: function (params) {
            // @ts-expect-error `toExponential` does not exist on string
            return params.row.price2.toExponential();
        },
    };
    var columns = [
        {
            field: 'price1',
            type: 'actions',
            getActions: function (params) {
                // @ts-expect-error `toUpperCase` does not exist on number
                return params.row.price1.toUpperCase(); // fails
            },
        },
        {
            field: 'price2',
            renderCell: function (params) {
                // @ts-expect-error `toExponential` does not exist on string
                return params.row.price2.toExponential();
            },
        },
    ];
    return <x_data_grid_1.DataGrid rows={[]} columns={columns}/>;
}
function CellParamsValue() {
    return (<x_data_grid_1.DataGrid rows={[]} columns={[{ field: 'brand' }]} onCellClick={function (params) {
            params.value.toUpperCase();
        }} onCellDoubleClick={function (params) {
            params.value.toUpperCase();
        }}/>);
}
function CellParamsRow() {
    return (<x_data_grid_1.DataGrid rows={[]} columns={[{ field: 'brand' }]} onCellClick={function (params) {
            params.row.brand.toUpperCase();
        }} onCellDoubleClick={function (params) {
            // @ts-expect-error `toUpperCase` doesn't exist in number
            params.row.brand.toUpperCase();
        }}/>);
}
function CellParamsFormattedValue() {
    return (<x_data_grid_1.DataGrid rows={[]} columns={[{ field: 'brand' }]} onCellClick={function (params) {
            params.formattedValue.toUpperCase();
        }} onCellDoubleClick={function (params) {
            params.formattedValue.toUpperCase();
        }}/>);
}
var constBrandColumns = [{ field: 'brand' }];
var constEmptyRows = [];
function ConstProps() {
    return <x_data_grid_1.DataGrid rows={constEmptyRows} columns={constBrandColumns}/>;
}
function ValueGetter() {
    var oldSignatureValueGetter = [
        {
            field: 'brand',
            valueGetter: function (params) {
                return '';
            },
        },
        {
            field: 'brand',
            valueGetter: function (_a) {
                var value = _a.value, row = _a.row;
                return '';
            },
        },
    ];
    var currentSignatureValueGetter = [
        {
            field: 'brand',
            valueGetter: function (value) {
                return value;
            },
        },
        {
            field: 'brand',
            valueGetter: function (value) {
                return value;
            },
        },
        {
            field: 'brand',
            valueGetter: function (value) {
                return value;
            },
        },
    ];
}
function ValueFormatter() {
    var oldSignatureValueFormatter = [
        {
            field: 'brand',
            valueFormatter: function (params) {
                return '';
            },
        },
        {
            field: 'brand',
            valueFormatter: function (_a) {
                var value = _a.value, row = _a.row;
                return '';
            },
        },
    ];
    var currentSignatureValueFormatter = [
        {
            field: 'brand',
            valueFormatter: function (value) {
                return value;
            },
        },
        {
            field: 'brand',
            valueFormatter: function (value) {
                return value;
            },
        },
        {
            field: 'brand',
            valueFormatter: function (value) {
                return value;
            },
        },
    ];
}
function GroupingValueGetter() {
    var oldSignatureGroupingValueGetter = [
        {
            field: 'brand',
            groupingValueGetter: function (params) {
                return '';
            },
        },
        {
            field: 'brand',
            groupingValueGetter: function (_a) {
                var value = _a.value, row = _a.row;
                return '';
            },
        },
    ];
    var currentSignatureGroupingValueGetter = [
        {
            field: 'brand',
            groupingValueGetter: function (value) {
                return value;
            },
        },
        {
            field: 'brand',
            groupingValueGetter: function (value) {
                return value;
            },
        },
        {
            field: 'brand',
            groupingValueGetter: function (value) {
                return value;
            },
        },
    ];
}
