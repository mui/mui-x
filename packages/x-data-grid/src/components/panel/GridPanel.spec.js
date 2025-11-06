"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var x_data_grid_1 = require("@mui/x-data-grid");
function MyPanel() {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(x_data_grid_1.GridPanel, { classes: { paper: 'paper' }, open: true, flip: false }), (0, jsx_runtime_1.jsx)(x_data_grid_1.GridPanel, { classes: { foo: 'foo' } })] }));
}
