"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var styles_1 = require("@mui/material/styles");
(0, styles_1.createTheme)({
    components: {
        MuiDataGrid: {
            defaultProps: {
                disableMultipleColumnsFiltering: true,
            },
        },
    },
});
