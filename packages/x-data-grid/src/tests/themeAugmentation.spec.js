"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var styles_1 = require("@mui/material/styles");
(0, styles_1.createTheme)({
    components: {
        MuiDataGrid: {
            defaultProps: {
                checkboxSelection: true,
                // @ts-expect-error invalid DataGrid prop
                disableMultipleColumnsFiltering: true,
            },
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
                // @ts-expect-error invalid class key
                wrong: {
                    display: 'flex',
                },
            },
        },
    },
});
