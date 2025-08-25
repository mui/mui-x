"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var icons_1 = require("./icons");
var iconsSlots = {
    collapsibleIcon: x_data_grid_1.GridExpandMoreIcon,
    columnMenuUngroupIcon: icons_1.GridWorkspacesIcon,
    columnMenuGroupIcon: icons_1.GridGroupWorkIcon,
    columnMenuAggregationIcon: icons_1.GridFunctionsIcon,
    pivotIcon: icons_1.GridPivotIcon,
    pivotSearchIcon: x_data_grid_1.GridSearchIcon,
    pivotSearchClearIcon: x_data_grid_1.GridClearIcon,
    pivotMenuAddIcon: x_data_grid_1.GridAddIcon,
    pivotMenuMoveUpIcon: icons_1.GridExpandLessIcon,
    pivotMenuMoveDownIcon: x_data_grid_1.GridExpandMoreIcon,
    pivotMenuMoveToTopIcon: icons_1.GridMoveToTopIcon,
    pivotMenuMoveToBottomIcon: icons_1.GridMoveToBottomIcon,
    pivotMenuCheckIcon: x_data_grid_1.GridCheckIcon,
    pivotMenuRemoveIcon: x_data_grid_1.GridDeleteIcon,
    sidebarCloseIcon: x_data_grid_1.GridCloseIcon,
    aiAssistantIcon: icons_1.GridAssistantIcon,
    aiAssistantPanelCloseIcon: x_data_grid_1.GridCloseIcon,
    aiAssistantPanelNewConversationIcon: x_data_grid_1.GridAddIcon,
    aiAssistantPanelHistoryIcon: icons_1.GridHistoryIcon,
    promptIcon: icons_1.GridPromptIcon,
    promptSendIcon: icons_1.GridSendIcon,
    promptSpeechRecognitionIcon: icons_1.GridMicIcon,
    promptSpeechRecognitionOffIcon: icons_1.GridMicOffIcon,
    promptRerunIcon: icons_1.GridRerunIcon,
    promptSortAscIcon: x_data_grid_pro_1.GridArrowUpwardIcon,
    promptSortDescIcon: x_data_grid_pro_1.GridArrowDownwardIcon,
    promptFilterIcon: x_data_grid_pro_1.GridFilterAltIcon,
    promptPivotIcon: icons_1.GridPivotIcon,
    promptAggregationIcon: icons_1.GridFunctionsIcon,
    promptGroupIcon: icons_1.GridGroupWorkIcon,
    promptChangesToggleIcon: x_data_grid_1.GridExpandMoreIcon,
};
var materialSlots = __assign({}, iconsSlots);
exports.default = materialSlots;
