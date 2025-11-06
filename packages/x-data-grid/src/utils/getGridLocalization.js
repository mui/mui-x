"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridLocalization = void 0;
var getGridLocalization = function (gridTranslations) { return ({
    components: {
        MuiDataGrid: {
            defaultProps: {
                localeText: gridTranslations,
            },
        },
    },
}); };
exports.getGridLocalization = getGridLocalization;
