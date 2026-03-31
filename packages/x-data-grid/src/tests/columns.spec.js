import { jsx as _jsx } from "react/jsx-runtime";
import { DataGrid } from '@mui/x-data-grid';
function RenderCellParamsExplicitTyping() {
    return (_jsx(DataGrid, { rows: [], columns: [
            {
                field: 'price1',
                renderCell: (params) => {
                    return params.value.toUpperCase();
                },
            },
            {
                field: 'price2',
                renderCell: (params) => {
                    return params.value.toUpperCase();
                },
            },
            {
                field: 'price3',
                renderCell: (params) => {
                    return params.row.price.toUpperCase();
                },
            },
            {
                field: 'price4',
                renderCell: (params) => {
                    return params.row.price.toUpperCase();
                },
            },
            {
                field: 'price5',
                renderCell: (params) => {
                    // @ts-expect-error `toUpperCase` doesn't exist in number
                    return params.formattedValue.toUpperCase();
                },
            },
            {
                field: 'price6',
                type: 'actions',
                getActions: (params) => {
                    // @ts-expect-error Property tax does not exist on type { price: string }
                    params.row.tax;
                    params.row.price.toUpperCase();
                    return [];
                },
            },
            {
                field: 'price7',
                type: 'actions',
                getActions: (params) => {
                    // row is typed as any by default
                    params.row.price.toUpperCase();
                    return [];
                },
            },
        ] }));
}
function CellParamsFromRowModel() {
    const actionColumn = {
        field: 'price1',
        type: 'actions',
        getActions: (params) => {
            // @ts-expect-error `toUpperCase` does not exist on number
            return params.row.price1.toUpperCase(); // fails
        },
    };
    const priceCol = {
        field: 'price2',
        renderCell: (params) => {
            // @ts-expect-error `toExponential` does not exist on string
            return params.row.price2.toExponential();
        },
    };
    const columns = [
        {
            field: 'price1',
            type: 'actions',
            getActions: (params) => {
                // @ts-expect-error `toUpperCase` does not exist on number
                return params.row.price1.toUpperCase(); // fails
            },
        },
        {
            field: 'price2',
            renderCell: (params) => {
                // @ts-expect-error `toExponential` does not exist on string
                return params.row.price2.toExponential();
            },
        },
    ];
    return _jsx(DataGrid, { rows: [], columns: columns });
}
function CellParamsValue() {
    return (_jsx(DataGrid, { rows: [], columns: [{ field: 'brand' }], onCellClick: (params) => {
            params.value.toUpperCase();
        }, onCellDoubleClick: (params) => {
            params.value.toUpperCase();
        } }));
}
function CellParamsRow() {
    return (_jsx(DataGrid, { rows: [], columns: [{ field: 'brand' }], onCellClick: (params) => {
            params.row.brand.toUpperCase();
        }, onCellDoubleClick: (params) => {
            // @ts-expect-error `toUpperCase` doesn't exist in number
            params.row.brand.toUpperCase();
        } }));
}
function CellParamsFormattedValue() {
    return (_jsx(DataGrid, { rows: [], columns: [{ field: 'brand' }], onCellClick: (params) => {
            params.formattedValue.toUpperCase();
        }, onCellDoubleClick: (params) => {
            params.formattedValue.toUpperCase();
        } }));
}
const constBrandColumns = [{ field: 'brand' }];
const constEmptyRows = [];
function ConstProps() {
    return _jsx(DataGrid, { rows: constEmptyRows, columns: constBrandColumns });
}
function ValueGetter() {
    const oldSignatureValueGetter = [
        {
            field: 'brand',
            valueGetter: (params) => {
                return '';
            },
        },
        {
            field: 'brand',
            valueGetter: ({ value, row }) => {
                return '';
            },
        },
    ];
    const currentSignatureValueGetter = [
        {
            field: 'brand',
            valueGetter: (value) => {
                return value;
            },
        },
        {
            field: 'brand',
            valueGetter: (value) => {
                return value;
            },
        },
        {
            field: 'brand',
            valueGetter: (value) => {
                return value;
            },
        },
    ];
}
function ValueFormatter() {
    const oldSignatureValueFormatter = [
        {
            field: 'brand',
            valueFormatter: (params) => {
                return '';
            },
        },
        {
            field: 'brand',
            valueFormatter: ({ value, row }) => {
                return '';
            },
        },
    ];
    const currentSignatureValueFormatter = [
        {
            field: 'brand',
            valueFormatter: (value) => {
                return value;
            },
        },
        {
            field: 'brand',
            valueFormatter: (value) => {
                return value;
            },
        },
        {
            field: 'brand',
            valueFormatter: (value) => {
                return value;
            },
        },
    ];
}
function GroupingValueGetter() {
    const oldSignatureGroupingValueGetter = [
        {
            field: 'brand',
            groupingValueGetter: (params) => {
                return '';
            },
        },
        {
            field: 'brand',
            groupingValueGetter: ({ value, row }) => {
                return '';
            },
        },
    ];
    const currentSignatureGroupingValueGetter = [
        {
            field: 'brand',
            groupingValueGetter: (value) => {
                return value;
            },
        },
        {
            field: 'brand',
            groupingValueGetter: (value) => {
                return value;
            },
        },
        {
            field: 'brand',
            groupingValueGetter: (value) => {
                return value;
            },
        },
    ];
}
