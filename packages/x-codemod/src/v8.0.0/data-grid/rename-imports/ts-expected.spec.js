"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
// prettier-ignore
var apiRef = useGridApiRef();
var selectedRowIdsPro = (0, x_data_grid_pro_1.gridRowSelectionIdsSelector)(apiRef);
var selectedRowIdsPremium = (0, x_data_grid_premium_1.gridRowSelectionIdsSelector)(apiRef);
var selectedRowCountPro = (0, x_data_grid_pro_1.gridRowSelectionCountSelector)(apiRef);
var selectedRowCountPremium = (0, x_data_grid_premium_1.gridRowSelectionCountSelector)(apiRef);
