"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridRootStyles = void 0;
var styles_1 = require("@mui/material/styles");
var gridClasses_1 = require("../../constants/gridClasses");
var cssVariables_1 = require("../../constants/cssVariables");
var useGridSelector_1 = require("../../hooks/utils/useGridSelector");
var useGridPrivateApiContext_1 = require("../../hooks/utils/useGridPrivateApiContext");
var columnSeparatorTargetSize = 10;
var columnSeparatorOffset = -5;
var focusOutlineWidth = 1;
var separatorIconDragStyles = {
    width: 3,
    rx: 1.5,
    x: 10.5,
};
// Emotion thinks it knows better than us which selector we should use.
// https://github.com/emotion-js/emotion/issues/1105#issuecomment-1722524968
var ignoreSsrWarning = '/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */';
var shouldShowBorderTopRightRadiusSelector = function (apiRef) {
    return apiRef.current.state.dimensions.hasScrollX &&
        (!apiRef.current.state.dimensions.hasScrollY ||
            apiRef.current.state.dimensions.scrollbarSize === 0);
};
exports.GridRootStyles = (0, styles_1.styled)('div', {
    name: 'MuiDataGrid',
    slot: 'Root',
    overridesResolver: function (props, styles) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86;
        return [
            // Root overrides
            styles.root,
            (_a = {}, _a["&.".concat(gridClasses_1.gridClasses.autoHeight)] = styles.autoHeight, _a),
            (_b = {}, _b["&.".concat(gridClasses_1.gridClasses.autosizing)] = styles.autosizing, _b),
            (_c = {}, _c["&.".concat(gridClasses_1.gridClasses['root--densityStandard'])] = styles['root--densityStandard'], _c),
            (_d = {}, _d["&.".concat(gridClasses_1.gridClasses['root--densityComfortable'])] = styles['root--densityComfortable'], _d),
            (_e = {}, _e["&.".concat(gridClasses_1.gridClasses['root--densityCompact'])] = styles['root--densityCompact'], _e),
            (_f = {}, _f["&.".concat(gridClasses_1.gridClasses['root--disableUserSelection'])] = styles['root--disableUserSelection'], _f),
            (_g = {}, _g["&.".concat(gridClasses_1.gridClasses['root--noToolbar'])] = styles['root--noToolbar'], _g),
            (_h = {}, _h["&.".concat(gridClasses_1.gridClasses.withVerticalBorder)] = styles.withVerticalBorder, _h),
            (_j = {}, _j["& .".concat(gridClasses_1.gridClasses.actionsCell)] = styles.actionsCell, _j),
            (_k = {}, _k["& .".concat(gridClasses_1.gridClasses.booleanCell)] = styles.booleanCell, _k),
            (_l = {}, _l["& .".concat(gridClasses_1.gridClasses.cell)] = styles.cell, _l),
            (_m = {}, _m["& .".concat(gridClasses_1.gridClasses['cell--editable'])] = styles['cell--editable'], _m),
            (_o = {}, _o["& .".concat(gridClasses_1.gridClasses['cell--editing'])] = styles['cell--editing'], _o),
            (_p = {}, _p["& .".concat(gridClasses_1.gridClasses['cell--flex'])] = styles['cell--flex'], _p),
            (_q = {}, _q["& .".concat(gridClasses_1.gridClasses['cell--pinnedLeft'])] = styles['cell--pinnedLeft'], _q),
            (_r = {}, _r["& .".concat(gridClasses_1.gridClasses['cell--pinnedRight'])] = styles['cell--pinnedRight'], _r),
            (_s = {}, _s["& .".concat(gridClasses_1.gridClasses['cell--rangeBottom'])] = styles['cell--rangeBottom'], _s),
            (_t = {}, _t["& .".concat(gridClasses_1.gridClasses['cell--rangeLeft'])] = styles['cell--rangeLeft'], _t),
            (_u = {}, _u["& .".concat(gridClasses_1.gridClasses['cell--rangeRight'])] = styles['cell--rangeRight'], _u),
            (_v = {}, _v["& .".concat(gridClasses_1.gridClasses['cell--rangeTop'])] = styles['cell--rangeTop'], _v),
            (_w = {}, _w["& .".concat(gridClasses_1.gridClasses['cell--selectionMode'])] = styles['cell--selectionMode'], _w),
            (_x = {}, _x["& .".concat(gridClasses_1.gridClasses['cell--textCenter'])] = styles['cell--textCenter'], _x),
            (_y = {}, _y["& .".concat(gridClasses_1.gridClasses['cell--textLeft'])] = styles['cell--textLeft'], _y),
            (_z = {}, _z["& .".concat(gridClasses_1.gridClasses['cell--textRight'])] = styles['cell--textRight'], _z),
            (_0 = {}, _0["& .".concat(gridClasses_1.gridClasses['cell--withLeftBorder'])] = styles['cell--withLeftBorder'], _0),
            (_1 = {}, _1["& .".concat(gridClasses_1.gridClasses['cell--withRightBorder'])] = styles['cell--withRightBorder'], _1),
            (_2 = {}, _2["& .".concat(gridClasses_1.gridClasses.cellCheckbox)] = styles.cellCheckbox, _2),
            (_3 = {}, _3["& .".concat(gridClasses_1.gridClasses.cellEmpty)] = styles.cellEmpty, _3),
            (_4 = {}, _4["& .".concat(gridClasses_1.gridClasses.cellOffsetLeft)] = styles.cellOffsetLeft, _4),
            (_5 = {}, _5["& .".concat(gridClasses_1.gridClasses.cellSkeleton)] = styles.cellSkeleton, _5),
            (_6 = {}, _6["& .".concat(gridClasses_1.gridClasses.checkboxInput)] = styles.checkboxInput, _6),
            (_7 = {}, _7["& .".concat(gridClasses_1.gridClasses.columnHeader)] = styles.columnHeader, _7),
            (_8 = {}, _8["& .".concat(gridClasses_1.gridClasses['columnHeader--alignCenter'])] = styles['columnHeader--alignCenter'], _8),
            (_9 = {}, _9["& .".concat(gridClasses_1.gridClasses['columnHeader--alignLeft'])] = styles['columnHeader--alignLeft'], _9),
            (_10 = {}, _10["& .".concat(gridClasses_1.gridClasses['columnHeader--alignRight'])] = styles['columnHeader--alignRight'], _10),
            (_11 = {}, _11["& .".concat(gridClasses_1.gridClasses['columnHeader--dragging'])] = styles['columnHeader--dragging'], _11),
            (_12 = {}, _12["& .".concat(gridClasses_1.gridClasses['columnHeader--emptyGroup'])] = styles['columnHeader--emptyGroup'], _12),
            (_13 = {}, _13["& .".concat(gridClasses_1.gridClasses['columnHeader--filledGroup'])] = styles['columnHeader--filledGroup'], _13),
            (_14 = {}, _14["& .".concat(gridClasses_1.gridClasses['columnHeader--filtered'])] = styles['columnHeader--filtered'], _14),
            (_15 = {}, _15["& .".concat(gridClasses_1.gridClasses['columnHeader--last'])] = styles['columnHeader--last'], _15),
            (_16 = {}, _16["& .".concat(gridClasses_1.gridClasses['columnHeader--lastUnpinned'])] = styles['columnHeader--lastUnpinned'], _16),
            (_17 = {}, _17["& .".concat(gridClasses_1.gridClasses['columnHeader--moving'])] = styles['columnHeader--moving'], _17),
            (_18 = {}, _18["& .".concat(gridClasses_1.gridClasses['columnHeader--numeric'])] = styles['columnHeader--numeric'], _18),
            (_19 = {}, _19["& .".concat(gridClasses_1.gridClasses['columnHeader--pinnedLeft'])] = styles['columnHeader--pinnedLeft'], _19),
            (_20 = {}, _20["& .".concat(gridClasses_1.gridClasses['columnHeader--pinnedRight'])] = styles['columnHeader--pinnedRight'], _20),
            (_21 = {}, _21["& .".concat(gridClasses_1.gridClasses['columnHeader--siblingFocused'])] = styles['columnHeader--siblingFocused'], _21),
            (_22 = {}, _22["& .".concat(gridClasses_1.gridClasses['columnHeader--sortable'])] = styles['columnHeader--sortable'], _22),
            (_23 = {}, _23["& .".concat(gridClasses_1.gridClasses['columnHeader--sorted'])] = styles['columnHeader--sorted'], _23),
            (_24 = {}, _24["& .".concat(gridClasses_1.gridClasses['columnHeader--withLeftBorder'])] = styles['columnHeader--withLeftBorder'], _24),
            (_25 = {}, _25["& .".concat(gridClasses_1.gridClasses['columnHeader--withRightBorder'])] = styles['columnHeader--withRightBorder'], _25),
            (_26 = {}, _26["& .".concat(gridClasses_1.gridClasses.columnHeaderCheckbox)] = styles.columnHeaderCheckbox, _26),
            (_27 = {}, _27["& .".concat(gridClasses_1.gridClasses.columnHeaderDraggableContainer)] = styles.columnHeaderDraggableContainer, _27),
            (_28 = {}, _28["& .".concat(gridClasses_1.gridClasses.columnHeaderTitleContainer)] = styles.columnHeaderTitleContainer, _28),
            (_29 = {}, _29["& .".concat(gridClasses_1.gridClasses.columnHeaderTitleContainerContent)] = styles.columnHeaderTitleContainerContent, _29),
            (_30 = {}, _30["& .".concat(gridClasses_1.gridClasses.columnSeparator)] = styles.columnSeparator, _30),
            (_31 = {}, _31["& .".concat(gridClasses_1.gridClasses['columnSeparator--resizable'])] = styles['columnSeparator--resizable'], _31),
            (_32 = {}, _32["& .".concat(gridClasses_1.gridClasses['columnSeparator--resizing'])] = styles['columnSeparator--resizing'], _32),
            (_33 = {}, _33["& .".concat(gridClasses_1.gridClasses['columnSeparator--sideLeft'])] = styles['columnSeparator--sideLeft'], _33),
            (_34 = {}, _34["& .".concat(gridClasses_1.gridClasses['columnSeparator--sideRight'])] = styles['columnSeparator--sideRight'], _34),
            (_35 = {}, _35["& .".concat(gridClasses_1.gridClasses['container--bottom'])] = styles['container--bottom'], _35),
            (_36 = {}, _36["& .".concat(gridClasses_1.gridClasses['container--top'])] = styles['container--top'], _36),
            (_37 = {}, _37["& .".concat(gridClasses_1.gridClasses.detailPanelToggleCell)] = styles.detailPanelToggleCell, _37),
            (_38 = {}, _38["& .".concat(gridClasses_1.gridClasses['detailPanelToggleCell--expanded'])] = styles['detailPanelToggleCell--expanded'], _38),
            (_39 = {}, _39["& .".concat(gridClasses_1.gridClasses.editBooleanCell)] = styles.editBooleanCell, _39),
            (_40 = {}, _40["& .".concat(gridClasses_1.gridClasses.filterIcon)] = styles.filterIcon, _40),
            (_41 = {}, _41["& .".concat(gridClasses_1.gridClasses['filler--borderBottom'])] = styles['filler--borderBottom'], _41),
            (_42 = {}, _42["& .".concat(gridClasses_1.gridClasses['filler--pinnedLeft'])] = styles['filler--pinnedLeft'], _42),
            (_43 = {}, _43["& .".concat(gridClasses_1.gridClasses['filler--pinnedRight'])] = styles['filler--pinnedRight'], _43),
            (_44 = {}, _44["& .".concat(gridClasses_1.gridClasses.groupingCriteriaCell)] = styles.groupingCriteriaCell, _44),
            (_45 = {},
                _45["& .".concat(gridClasses_1.gridClasses.groupingCriteriaCellLoadingContainer)] = styles.groupingCriteriaCellLoadingContainer,
                _45),
            (_46 = {}, _46["& .".concat(gridClasses_1.gridClasses.groupingCriteriaCellToggle)] = styles.groupingCriteriaCellToggle, _46),
            (_47 = {}, _47["& .".concat(gridClasses_1.gridClasses.headerFilterRow)] = styles.headerFilterRow, _47),
            (_48 = {}, _48["& .".concat(gridClasses_1.gridClasses.iconSeparator)] = styles.iconSeparator, _48),
            (_49 = {}, _49["& .".concat(gridClasses_1.gridClasses.menuIcon)] = styles.menuIcon, _49),
            (_50 = {}, _50["& .".concat(gridClasses_1.gridClasses.menuIconButton)] = styles.menuIconButton, _50),
            (_51 = {}, _51["& .".concat(gridClasses_1.gridClasses.menuList)] = styles.menuList, _51),
            (_52 = {}, _52["& .".concat(gridClasses_1.gridClasses.menuOpen)] = styles.menuOpen, _52),
            (_53 = {}, _53["& .".concat(gridClasses_1.gridClasses.overlayWrapperInner)] = styles.overlayWrapperInner, _53),
            (_54 = {}, _54["& .".concat(gridClasses_1.gridClasses.pinnedRows)] = styles.pinnedRows, _54),
            (_55 = {}, _55["& .".concat(gridClasses_1.gridClasses['pinnedRows--bottom'])] = styles['pinnedRows--bottom'], _55),
            (_56 = {}, _56["& .".concat(gridClasses_1.gridClasses['pinnedRows--top'])] = styles['pinnedRows--top'], _56),
            (_57 = {}, _57["& .".concat(gridClasses_1.gridClasses.row)] = styles.row, _57),
            (_58 = {}, _58["& .".concat(gridClasses_1.gridClasses['row--borderBottom'])] = styles['row--borderBottom'], _58),
            (_59 = {}, _59["& .".concat(gridClasses_1.gridClasses['row--detailPanelExpanded'])] = styles['row--detailPanelExpanded'], _59),
            (_60 = {}, _60["& .".concat(gridClasses_1.gridClasses['row--dragging'])] = styles['row--dragging'], _60),
            (_61 = {}, _61["& .".concat(gridClasses_1.gridClasses['row--dynamicHeight'])] = styles['row--dynamicHeight'], _61),
            (_62 = {}, _62["& .".concat(gridClasses_1.gridClasses['row--editable'])] = styles['row--editable'], _62),
            (_63 = {}, _63["& .".concat(gridClasses_1.gridClasses['row--editing'])] = styles['row--editing'], _63),
            (_64 = {}, _64["& .".concat(gridClasses_1.gridClasses['row--firstVisible'])] = styles['row--firstVisible'], _64),
            (_65 = {}, _65["& .".concat(gridClasses_1.gridClasses['row--lastVisible'])] = styles['row--lastVisible'], _65),
            (_66 = {}, _66["& .".concat(gridClasses_1.gridClasses.rowReorderCell)] = styles.rowReorderCell, _66),
            (_67 = {}, _67["& .".concat(gridClasses_1.gridClasses['rowReorderCell--draggable'])] = styles['rowReorderCell--draggable'], _67),
            (_68 = {}, _68["& .".concat(gridClasses_1.gridClasses.rowReorderCellContainer)] = styles.rowReorderCellContainer, _68),
            (_69 = {}, _69["& .".concat(gridClasses_1.gridClasses.rowReorderCellPlaceholder)] = styles.rowReorderCellPlaceholder, _69),
            (_70 = {}, _70["& .".concat(gridClasses_1.gridClasses.rowSkeleton)] = styles.rowSkeleton, _70),
            (_71 = {}, _71["& .".concat(gridClasses_1.gridClasses.scrollbar)] = styles.scrollbar, _71),
            (_72 = {}, _72["& .".concat(gridClasses_1.gridClasses['scrollbar--horizontal'])] = styles['scrollbar--horizontal'], _72),
            (_73 = {}, _73["& .".concat(gridClasses_1.gridClasses['scrollbar--vertical'])] = styles['scrollbar--vertical'], _73),
            (_74 = {}, _74["& .".concat(gridClasses_1.gridClasses.scrollbarFiller)] = styles.scrollbarFiller, _74),
            (_75 = {}, _75["& .".concat(gridClasses_1.gridClasses['scrollbarFiller--borderBottom'])] = styles['scrollbarFiller--borderBottom'], _75),
            (_76 = {}, _76["& .".concat(gridClasses_1.gridClasses['scrollbarFiller--borderTop'])] = styles['scrollbarFiller--borderTop'], _76),
            (_77 = {}, _77["& .".concat(gridClasses_1.gridClasses['scrollbarFiller--header'])] = styles['scrollbarFiller--header'], _77),
            (_78 = {}, _78["& .".concat(gridClasses_1.gridClasses['scrollbarFiller--pinnedRight'])] = styles['scrollbarFiller--pinnedRight'], _78),
            (_79 = {}, _79["& .".concat(gridClasses_1.gridClasses.sortIcon)] = styles.sortIcon, _79),
            (_80 = {}, _80["& .".concat(gridClasses_1.gridClasses.treeDataGroupingCell)] = styles.treeDataGroupingCell, _80),
            (_81 = {},
                _81["& .".concat(gridClasses_1.gridClasses.treeDataGroupingCellLoadingContainer)] = styles.treeDataGroupingCellLoadingContainer,
                _81),
            (_82 = {}, _82["& .".concat(gridClasses_1.gridClasses.treeDataGroupingCellToggle)] = styles.treeDataGroupingCellToggle, _82),
            (_83 = {}, _83["& .".concat(gridClasses_1.gridClasses.withBorderColor)] = styles.withBorderColor, _83),
            (_84 = {}, _84["& .".concat(gridClasses_1.gridClasses['row--dropAbove'])] = styles['row--dropAbove'], _84),
            (_85 = {}, _85["& .".concat(gridClasses_1.gridClasses['row--dropBelow'])] = styles['row--dropBelow'], _85),
            (_86 = {}, _86["& .".concat(gridClasses_1.gridClasses['row--beingDragged'])] = styles['row--beingDragged'], _86),
        ];
    },
})(function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var apiRef = (0, useGridPrivateApiContext_1.useGridPrivateApiContext)();
    var shouldShowBorderTopRightRadius = (0, useGridSelector_1.useGridSelector)(apiRef, shouldShowBorderTopRightRadiusSelector);
    var baseBackground = cssVariables_1.vars.colors.background.base;
    var headerBackground = cssVariables_1.vars.header.background.base;
    var pinnedBackground = cssVariables_1.vars.cell.background.pinned;
    var hoverColor = removeOpacity(cssVariables_1.vars.colors.interactive.hover);
    var hoverOpacity = cssVariables_1.vars.colors.interactive.hoverOpacity;
    var selectedColor = cssVariables_1.vars.colors.interactive.selected;
    var selectedOpacity = cssVariables_1.vars.colors.interactive.selectedOpacity;
    var selectedHoverColor = selectedColor;
    var selectedHoverOpacity = "calc(".concat(selectedOpacity, " + ").concat(hoverOpacity, ")");
    var hoverBackground = mix(baseBackground, hoverColor, hoverOpacity);
    var selectedBackground = mix(baseBackground, selectedColor, selectedOpacity);
    var selectedHoverBackground = mix(baseBackground, selectedHoverColor, selectedHoverOpacity);
    var pinnedHoverBackground = mix(pinnedBackground, hoverColor, hoverOpacity);
    var pinnedSelectedBackground = mix(pinnedBackground, selectedColor, selectedOpacity);
    var pinnedSelectedHoverBackground = mix(pinnedBackground, selectedHoverColor, selectedHoverOpacity);
    var getPinnedBackgroundStyles = function (backgroundColor) {
        var _a;
        return (_a = {},
            _a["& .".concat(gridClasses_1.gridClasses['cell--pinnedLeft'], ", & .").concat(gridClasses_1.gridClasses['cell--pinnedRight'])] = {
                backgroundColor: backgroundColor,
                '&.Mui-selected': {
                    backgroundColor: mix(backgroundColor, selectedBackground, selectedOpacity),
                    '&:hover': {
                        backgroundColor: mix(backgroundColor, selectedHoverBackground, selectedHoverOpacity),
                    },
                },
            },
            _a);
    };
    var pinnedHoverStyles = getPinnedBackgroundStyles(pinnedHoverBackground);
    var pinnedSelectedStyles = getPinnedBackgroundStyles(pinnedSelectedBackground);
    var pinnedSelectedHoverStyles = getPinnedBackgroundStyles(pinnedSelectedHoverBackground);
    var selectedStyles = {
        backgroundColor: selectedBackground,
        '&:hover': {
            backgroundColor: selectedHoverBackground,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: selectedBackground,
            },
        },
    };
    var gridStyle = (_a = {
            '--unstable_DataGrid-radius': cssVariables_1.vars.radius.base,
            '--unstable_DataGrid-headWeight': cssVariables_1.vars.typography.fontWeight.medium,
            '--DataGrid-rowBorderColor': cssVariables_1.vars.colors.border.base,
            '--DataGrid-cellOffsetMultiplier': 2,
            '--DataGrid-width': '0px',
            '--DataGrid-hasScrollX': '0',
            '--DataGrid-hasScrollY': '0',
            '--DataGrid-scrollbarSize': '10px',
            '--DataGrid-rowWidth': '0px',
            '--DataGrid-columnsTotalWidth': '0px',
            '--DataGrid-leftPinnedWidth': '0px',
            '--DataGrid-rightPinnedWidth': '0px',
            '--DataGrid-headerHeight': '0px',
            '--DataGrid-headersTotalHeight': '0px',
            '--DataGrid-topContainerHeight': '0px',
            '--DataGrid-bottomContainerHeight': '0px',
            flex: 1,
            boxSizing: 'border-box',
            position: 'relative',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: cssVariables_1.vars.colors.border.base,
            borderRadius: 'var(--unstable_DataGrid-radius)',
            backgroundColor: cssVariables_1.vars.colors.background.base,
            color: cssVariables_1.vars.colors.foreground.base,
            font: cssVariables_1.vars.typography.font.body,
            outline: 'none',
            height: '100%',
            display: 'flex',
            minWidth: 0, // See https://github.com/mui/mui-x/issues/8547
            minHeight: 0,
            flexDirection: 'column',
            overflow: 'hidden',
            overflowAnchor: 'none', // Keep the same scrolling position
            transform: 'translate(0, 0)'
        }, // Create a stacking context to keep scrollbars from showing on top
        _a[".".concat(gridClasses_1.gridClasses.main, " > *:first-child").concat(ignoreSsrWarning)] = {
            borderTopLeftRadius: 'var(--unstable_DataGrid-radius)',
            borderTopRightRadius: 'var(--unstable_DataGrid-radius)',
        },
        _a["&.".concat(gridClasses_1.gridClasses.autoHeight)] = {
            height: 'auto',
        },
        _a["&.".concat(gridClasses_1.gridClasses.autosizing)] = (_b = {},
            _b["& .".concat(gridClasses_1.gridClasses.columnHeaderTitleContainerContent, " > *")] = {
                overflow: 'visible !important',
            },
            _b['@media (hover: hover)'] = (_c = {},
                _c["& .".concat(gridClasses_1.gridClasses.menuIcon)] = {
                    width: '0 !important',
                    visibility: 'hidden !important',
                },
                _c),
            _b["& .".concat(gridClasses_1.gridClasses.cell)] = {
                overflow: 'visible !important',
                whiteSpace: 'nowrap',
                minWidth: 'max-content !important',
                maxWidth: 'max-content !important',
            },
            _b["& .".concat(gridClasses_1.gridClasses.groupingCriteriaCell)] = {
                width: 'unset',
            },
            _b["& .".concat(gridClasses_1.gridClasses.treeDataGroupingCell)] = {
                width: 'unset',
            },
            _b),
        _a["&.".concat(gridClasses_1.gridClasses.withSidePanel)] = {
            flexDirection: 'row',
        },
        _a["& .".concat(gridClasses_1.gridClasses.mainContent)] = {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: 1,
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeader, ", & .").concat(gridClasses_1.gridClasses.cell)] = {
            WebkitTapHighlightColor: 'transparent',
            padding: '0 10px',
            boxSizing: 'border-box',
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeader, ":focus-within, & .").concat(gridClasses_1.gridClasses.cell, ":focus-within")] = {
            outline: "solid ".concat(setOpacity(cssVariables_1.vars.colors.interactive.focus, 0.5), " ").concat(focusOutlineWidth, "px"),
            outlineOffset: focusOutlineWidth * -1,
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeader, ":focus, & .").concat(gridClasses_1.gridClasses.cell, ":focus")] = {
            outline: "solid ".concat(cssVariables_1.vars.colors.interactive.focus, " ").concat(focusOutlineWidth, "px"),
            outlineOffset: focusOutlineWidth * -1,
        },
        // Hide the column separator when:
        // - the column is focused and has an outline
        // - the next column is focused and has an outline
        // - the column has a left or right border
        // - the next column is pinned right and has a left border
        _a["& .".concat(gridClasses_1.gridClasses.columnHeader, ":focus,\n      & .").concat(gridClasses_1.gridClasses['columnHeader--withLeftBorder'], ",\n      & .").concat(gridClasses_1.gridClasses['columnHeader--withRightBorder'], ",\n      & .").concat(gridClasses_1.gridClasses['columnHeader--siblingFocused'], ",\n      & .").concat(gridClasses_1.gridClasses['virtualScroller--hasScrollX'], " .").concat(gridClasses_1.gridClasses['columnHeader--lastUnpinned'], ",\n      & .").concat(gridClasses_1.gridClasses['virtualScroller--hasScrollX'], " .").concat(gridClasses_1.gridClasses['columnHeader--last'], "\n      ")] = (_d = {},
            _d["& .".concat(gridClasses_1.gridClasses.columnSeparator)] = {
                opacity: 0,
            },
            // Show resizable separators at all times on touch devices
            _d['@media (hover: none)'] = (_e = {},
                _e["& .".concat(gridClasses_1.gridClasses['columnSeparator--resizable'])] = {
                    opacity: 1,
                },
                _e),
            _d["& .".concat(gridClasses_1.gridClasses['columnSeparator--resizable'], ":hover")] = {
                opacity: 1,
            },
            _d),
        _a["&.".concat(gridClasses_1.gridClasses['root--noToolbar'], " [aria-rowindex=\"1\"] [aria-colindex=\"1\"]")] = {
            borderTopLeftRadius: 'calc(var(--unstable_DataGrid-radius) - 1px)',
        },
        _a["&.".concat(gridClasses_1.gridClasses['root--noToolbar'], " [aria-rowindex=\"1\"] .").concat(gridClasses_1.gridClasses['columnHeader--last'])] = {
            borderTopRightRadius: shouldShowBorderTopRightRadius
                ? 'calc(var(--unstable_DataGrid-radius) - 1px)'
                : undefined,
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeaderCheckbox, ", & .").concat(gridClasses_1.gridClasses.cellCheckbox)] = {
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeader)] = {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: headerBackground,
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--filter'])] = {
            paddingTop: 8,
            paddingBottom: 8,
            paddingRight: 5,
            minHeight: 'min-content',
            overflow: 'hidden',
        },
        _a["& .".concat(gridClasses_1.gridClasses['virtualScroller--hasScrollX'], " .").concat(gridClasses_1.gridClasses['columnHeader--last'])] = {
            overflow: 'hidden',
        },
        _a["& .".concat(gridClasses_1.gridClasses['pivotPanelField--sorted'], " .").concat(gridClasses_1.gridClasses.iconButtonContainer, ",\n      & .").concat(gridClasses_1.gridClasses['columnHeader--sorted'], " .").concat(gridClasses_1.gridClasses.iconButtonContainer, ",\n      & .").concat(gridClasses_1.gridClasses['columnHeader--filtered'], " .").concat(gridClasses_1.gridClasses.iconButtonContainer)] = {
            visibility: 'visible',
            width: 'auto',
        },
        _a["& .".concat(gridClasses_1.gridClasses.pivotPanelField, ":not(.").concat(gridClasses_1.gridClasses['pivotPanelField--sorted'], ") .").concat(gridClasses_1.gridClasses.sortButton, ",\n      & .").concat(gridClasses_1.gridClasses.columnHeader, ":not(.").concat(gridClasses_1.gridClasses['columnHeader--sorted'], ") .").concat(gridClasses_1.gridClasses.sortButton)] = {
            opacity: 0,
            transition: cssVariables_1.vars.transition(['opacity'], {
                duration: cssVariables_1.vars.transitions.duration.short,
            }),
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeaderTitleContainer)] = {
            display: 'flex',
            alignItems: 'center',
            gap: cssVariables_1.vars.spacing(0.25),
            minWidth: 0,
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeaderTitleContainerContent)] = {
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--filledGroup'], " .").concat(gridClasses_1.gridClasses.columnHeaderTitleContainer)] = {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            boxSizing: 'border-box',
        },
        _a["& .".concat(gridClasses_1.gridClasses.sortIcon, ", & .").concat(gridClasses_1.gridClasses.filterIcon)] = {
            fontSize: 'inherit',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--sortable'])] = {
            cursor: 'pointer',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--alignCenter'], " .").concat(gridClasses_1.gridClasses.columnHeaderTitleContainer)] = {
            justifyContent: 'center',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--alignRight'], " .").concat(gridClasses_1.gridClasses.columnHeaderDraggableContainer, ", & .").concat(gridClasses_1.gridClasses['columnHeader--alignRight'], " .").concat(gridClasses_1.gridClasses.columnHeaderTitleContainer)] = {
            flexDirection: 'row-reverse',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--alignCenter'], " .").concat(gridClasses_1.gridClasses.menuIcon)] = {
            marginLeft: 'auto',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--alignRight'], " .").concat(gridClasses_1.gridClasses.menuIcon)] = {
            marginRight: 'auto',
            marginLeft: -5,
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--moving'])] = {
            backgroundColor: hoverBackground,
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--pinnedLeft'], ", & .").concat(gridClasses_1.gridClasses['columnHeader--pinnedRight'])] = {
            position: 'sticky',
            zIndex: 40, // Should be above the column separator
            background: cssVariables_1.vars.header.background.base,
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnSeparator)] = {
            position: 'absolute',
            overflow: 'hidden',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: columnSeparatorTargetSize,
            color: cssVariables_1.vars.colors.border.base,
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeaders)] = {
            width: 'var(--DataGrid-rowWidth)',
            backgroundColor: headerBackground,
        },
        _a['@media (hover: hover)'] = (_f = {},
            _f["& .".concat(gridClasses_1.gridClasses.columnHeader, ":hover")] = (_g = {},
                _g["& .".concat(gridClasses_1.gridClasses.menuIcon)] = {
                    width: 'auto',
                    visibility: 'visible',
                },
                _g["& .".concat(gridClasses_1.gridClasses.iconButtonContainer)] = {
                    visibility: 'visible',
                    width: 'auto',
                },
                _g),
            _f["& .".concat(gridClasses_1.gridClasses.columnHeader, ":not(.").concat(gridClasses_1.gridClasses['columnHeader--sorted'], "):hover .").concat(gridClasses_1.gridClasses.sortButton, ",\n        & .").concat(gridClasses_1.gridClasses.pivotPanelField, ":not(.").concat(gridClasses_1.gridClasses['pivotPanelField--sorted'], "):hover .").concat(gridClasses_1.gridClasses.sortButton, ",\n        & .").concat(gridClasses_1.gridClasses.pivotPanelField, ":not(.").concat(gridClasses_1.gridClasses['pivotPanelField--sorted'], ") .").concat(gridClasses_1.gridClasses.sortButton, ":focus-visible")] = {
                opacity: 0.5,
            },
            _f),
        _a['@media (hover: none)'] = (_h = {},
            _h["& .".concat(gridClasses_1.gridClasses.columnHeader, " .").concat(gridClasses_1.gridClasses.menuIcon)] = {
                width: 'auto',
                visibility: 'visible',
            },
            _h["& .".concat(gridClasses_1.gridClasses.columnHeader, ":focus,\n        & .").concat(gridClasses_1.gridClasses['columnHeader--siblingFocused'])] = (_j = {},
                _j[".".concat(gridClasses_1.gridClasses['columnSeparator--resizable'])] = {
                    color: cssVariables_1.vars.colors.foreground.accent,
                },
                _j),
            _h["& .".concat(gridClasses_1.gridClasses.pivotPanelField, ":not(.").concat(gridClasses_1.gridClasses['pivotPanelField--sorted'], ") .").concat(gridClasses_1.gridClasses.sortButton)] = {
                opacity: 0.5,
            },
            _h),
        // Hide the column separator when the column has border and it is not resizable
        // In this case, this column separator may block interaction with the separator from the adjacent column that is resizable
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--withLeftBorder'], " .").concat(gridClasses_1.gridClasses['columnSeparator--sideLeft'], ":not(.").concat(gridClasses_1.gridClasses['columnSeparator--resizable'], "), & .").concat(gridClasses_1.gridClasses['columnHeader--withRightBorder'], " .").concat(gridClasses_1.gridClasses['columnSeparator--sideRight'], ":not(.").concat(gridClasses_1.gridClasses['columnSeparator--resizable'], ")")] = {
            display: 'none',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnSeparator--sideLeft'])] = {
            left: columnSeparatorOffset,
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnSeparator--sideRight'])] = {
            right: columnSeparatorOffset,
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--withRightBorder'], " .").concat(gridClasses_1.gridClasses['columnSeparator--sideLeft'])] = {
            left: columnSeparatorOffset - 0.5,
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--withRightBorder'], " .").concat(gridClasses_1.gridClasses['columnSeparator--sideRight'])] = {
            right: columnSeparatorOffset - 0.5,
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnSeparator--resizable'])] = (_k = {
                cursor: 'col-resize',
                touchAction: 'none'
            },
            _k["&.".concat(gridClasses_1.gridClasses['columnSeparator--resizing'])] = {
                color: cssVariables_1.vars.colors.foreground.accent,
            },
            // Always appear as draggable on touch devices
            _k['@media (hover: none)'] = (_l = {},
                _l["& .".concat(gridClasses_1.gridClasses.iconSeparator, " rect")] = separatorIconDragStyles,
                _l),
            _k['@media (hover: hover)'] = {
                '&:hover': (_m = {
                        color: cssVariables_1.vars.colors.foreground.accent
                    },
                    _m["& .".concat(gridClasses_1.gridClasses.iconSeparator, " rect")] = separatorIconDragStyles,
                    _m),
            },
            _k['& svg'] = {
                pointerEvents: 'none',
            },
            _k),
        _a["& .".concat(gridClasses_1.gridClasses.iconSeparator)] = {
            color: 'inherit',
            transition: cssVariables_1.vars.transition(['color', 'width'], {
                duration: cssVariables_1.vars.transitions.duration.short,
            }),
        },
        _a["& .".concat(gridClasses_1.gridClasses.menuIcon)] = {
            width: 0,
            visibility: 'hidden',
            fontSize: 20,
            marginRight: -5,
            display: 'flex',
            alignItems: 'center',
        },
        _a[".".concat(gridClasses_1.gridClasses.menuOpen)] = {
            visibility: 'visible',
            width: 'auto',
        },
        _a["& .".concat(gridClasses_1.gridClasses.headerFilterRow)] = (_o = {},
            _o["& .".concat(gridClasses_1.gridClasses.columnHeader)] = {
                boxSizing: 'border-box',
                borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
            },
            _o),
        /* Bottom border of the top-container */
        _a["& .".concat(gridClasses_1.gridClasses['row--borderBottom'], " .").concat(gridClasses_1.gridClasses.columnHeader, ",\n      & .").concat(gridClasses_1.gridClasses['row--borderBottom'], " .").concat(gridClasses_1.gridClasses.filler, ",\n      & .").concat(gridClasses_1.gridClasses['row--borderBottom'], " .").concat(gridClasses_1.gridClasses.scrollbarFiller)] = {
            borderBottom: "1px solid var(--DataGrid-rowBorderColor)",
        },
        _a["& .".concat(gridClasses_1.gridClasses['row--borderBottom'], " .").concat(gridClasses_1.gridClasses.cell)] = {
            borderBottom: "1px solid var(--rowBorderColor)",
        },
        /* Row styles */
        _a[".".concat(gridClasses_1.gridClasses.row)] = (_p = {
                display: 'flex',
                width: 'var(--DataGrid-rowWidth)',
                breakInside: 'avoid', // Avoid the row to be broken in two different print pages.
                '--rowBorderColor': 'var(--DataGrid-rowBorderColor)'
            },
            _p["&.".concat(gridClasses_1.gridClasses['row--firstVisible'])] = {
                '--rowBorderColor': 'transparent',
            },
            _p['&:hover'] = {
                backgroundColor: hoverBackground,
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
            _p["&.".concat(gridClasses_1.gridClasses.rowSkeleton, ":hover")] = {
                backgroundColor: 'transparent',
            },
            _p['&.Mui-selected'] = selectedStyles,
            _p),
        /* Cell styles */
        _a["& .".concat(gridClasses_1.gridClasses.cell)] = {
            flex: '0 0 auto',
            height: 'var(--height)',
            width: 'var(--width)',
            lineHeight: 'calc(var(--height) - 1px)', // -1px for the border
            boxSizing: 'border-box',
            borderTop: "1px solid var(--rowBorderColor)",
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            '&.Mui-selected': selectedStyles,
        },
        _a["& .".concat(gridClasses_1.gridClasses['virtualScrollerContent--overflowed'], " .").concat(gridClasses_1.gridClasses['row--lastVisible'], " .").concat(gridClasses_1.gridClasses.cell)] = {
            borderTopColor: 'transparent',
        },
        _a["& .".concat(gridClasses_1.gridClasses.pinnedRows, " .").concat(gridClasses_1.gridClasses.row, ", .").concat(gridClasses_1.gridClasses.aggregationRowOverlayWrapper, " .").concat(gridClasses_1.gridClasses.row)] = {
            backgroundColor: pinnedBackground,
            '&:hover': {
                backgroundColor: pinnedHoverBackground,
            },
        },
        _a["& .".concat(gridClasses_1.gridClasses['pinnedRows--top'], " :first-of-type")] = (_q = {},
            _q["& .".concat(gridClasses_1.gridClasses.cell, ", .").concat(gridClasses_1.gridClasses.scrollbarFiller)] = {
                borderTop: 'none',
            },
            _q),
        _a["&.".concat(gridClasses_1.gridClasses['root--disableUserSelection'])] = {
            userSelect: 'none',
        },
        _a["& .".concat(gridClasses_1.gridClasses['row--dynamicHeight'], " > .").concat(gridClasses_1.gridClasses.cell)] = {
            whiteSpace: 'initial',
            lineHeight: 'inherit',
        },
        _a["& .".concat(gridClasses_1.gridClasses.cellEmpty)] = {
            flex: 1,
            padding: 0,
            height: 'unset',
        },
        _a["& .".concat(gridClasses_1.gridClasses.cell, ".").concat(gridClasses_1.gridClasses['cell--selectionMode'])] = {
            cursor: 'default',
        },
        _a["& .".concat(gridClasses_1.gridClasses.cell, ".").concat(gridClasses_1.gridClasses['cell--editing'])] = {
            padding: 1,
            display: 'flex',
            boxShadow: cssVariables_1.vars.shadows.base,
            backgroundColor: cssVariables_1.vars.colors.background.overlay,
            '&:focus-within': {
                outline: "".concat(focusOutlineWidth, "px solid ").concat(cssVariables_1.vars.colors.interactive.focus),
                outlineOffset: focusOutlineWidth * -1,
            },
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--editing'])] = {
            '& .MuiInputBase-root': {
                height: '100%',
            },
        },
        _a["& .".concat(gridClasses_1.gridClasses['row--editing'])] = {
            boxShadow: cssVariables_1.vars.shadows.base,
        },
        _a["& .".concat(gridClasses_1.gridClasses['row--editing'], " .").concat(gridClasses_1.gridClasses.cell)] = {
            boxShadow: 'none',
            backgroundColor: cssVariables_1.vars.colors.background.overlay,
        },
        _a["& .".concat(gridClasses_1.gridClasses.editBooleanCell)] = {
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        _a["& .".concat(gridClasses_1.gridClasses.booleanCell, "[data-value=\"true\"]")] = {
            color: cssVariables_1.vars.colors.foreground.muted,
        },
        _a["& .".concat(gridClasses_1.gridClasses.booleanCell, "[data-value=\"false\"]")] = {
            color: cssVariables_1.vars.colors.foreground.disabled,
        },
        _a["& .".concat(gridClasses_1.gridClasses.actionsCell)] = {
            display: 'inline-flex',
            alignItems: 'center',
            gridGap: cssVariables_1.vars.spacing(1),
        },
        _a["& .".concat(gridClasses_1.gridClasses.rowReorderCell)] = {
            display: 'inline-flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: cssVariables_1.vars.colors.interactive.disabledOpacity,
        },
        _a["& .".concat(gridClasses_1.gridClasses['rowReorderCell--draggable'])] = {
            cursor: 'grab',
            opacity: 1,
        },
        _a["& .".concat(gridClasses_1.gridClasses.rowReorderCellContainer)] = {
            padding: 0,
            display: 'flex',
            alignItems: 'stretch',
        },
        _a[".".concat(gridClasses_1.gridClasses.withBorderColor)] = {
            borderColor: cssVariables_1.vars.colors.border.base,
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--withLeftBorder'], ", & .").concat(gridClasses_1.gridClasses['columnHeader--withLeftBorder'])] = {
            borderLeftColor: 'var(--DataGrid-rowBorderColor)',
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--withRightBorder'], ", & .").concat(gridClasses_1.gridClasses['columnHeader--withRightBorder'])] = {
            borderRightColor: 'var(--DataGrid-rowBorderColor)',
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--flex'])] = {
            display: 'flex',
            alignItems: 'center',
            lineHeight: 'inherit',
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--textLeft'])] = {
            textAlign: 'left',
            justifyContent: 'flex-start',
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--textRight'])] = {
            textAlign: 'right',
            justifyContent: 'flex-end',
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--textCenter'])] = {
            textAlign: 'center',
            justifyContent: 'center',
        },
        _a["& .".concat(gridClasses_1.gridClasses['cell--pinnedLeft'], ", & .").concat(gridClasses_1.gridClasses['cell--pinnedRight'])] = {
            position: 'sticky',
            zIndex: 30,
            background: cssVariables_1.vars.cell.background.pinned,
            '&.Mui-selected': {
                backgroundColor: pinnedSelectedBackground,
            },
        },
        _a["& .".concat(gridClasses_1.gridClasses.row)] = {
            '&:hover': pinnedHoverStyles,
            '&.Mui-selected': pinnedSelectedStyles,
            '&.Mui-selected:hover': pinnedSelectedHoverStyles,
        },
        _a["& .".concat(gridClasses_1.gridClasses.cellOffsetLeft)] = {
            flex: '0 0 auto',
            display: 'inline-block',
        },
        _a["& .".concat(gridClasses_1.gridClasses.cellSkeleton)] = {
            flex: '0 0 auto',
            height: '100%',
            display: 'inline-flex',
            alignItems: 'center',
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeaderDraggableContainer)] = {
            display: 'flex',
            width: '100%',
            height: '100%',
        },
        _a["& .".concat(gridClasses_1.gridClasses.rowReorderCellPlaceholder)] = {
            display: 'none',
        },
        _a["& .".concat(gridClasses_1.gridClasses['columnHeader--dragging'], ", & .").concat(gridClasses_1.gridClasses['row--dragging'])] = {
            background: cssVariables_1.vars.colors.background.overlay,
            padding: '0 12px',
            borderRadius: 'var(--unstable_DataGrid-radius)',
            opacity: cssVariables_1.vars.colors.interactive.disabledOpacity,
        },
        _a["& .".concat(gridClasses_1.gridClasses['row--dragging'])] = (_r = {
                background: cssVariables_1.vars.colors.background.overlay,
                padding: '0 12px',
                borderRadius: 'var(--unstable_DataGrid-radius)',
                opacity: cssVariables_1.vars.colors.interactive.disabledOpacity
            },
            _r["& .".concat(gridClasses_1.gridClasses.rowReorderCellPlaceholder)] = {
                display: 'flex',
            },
            _r),
        _a["& .".concat(gridClasses_1.gridClasses.treeDataGroupingCell)] = {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        },
        _a["& .".concat(gridClasses_1.gridClasses.treeDataGroupingCellToggle)] = {
            flex: '0 0 28px',
            alignSelf: 'stretch',
            marginRight: cssVariables_1.vars.spacing(2),
        },
        _a["& .".concat(gridClasses_1.gridClasses.treeDataGroupingCellLoadingContainer, ", .").concat(gridClasses_1.gridClasses.groupingCriteriaCellLoadingContainer)] = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        },
        _a["& .".concat(gridClasses_1.gridClasses.groupingCriteriaCell)] = {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        },
        _a["& .".concat(gridClasses_1.gridClasses.groupingCriteriaCellToggle)] = {
            flex: '0 0 28px',
            alignSelf: 'stretch',
            marginRight: cssVariables_1.vars.spacing(2),
        },
        /* ScrollbarFiller styles */
        _a["& .".concat(gridClasses_1.gridClasses.columnHeaders, " .").concat(gridClasses_1.gridClasses.scrollbarFiller)] = {
            backgroundColor: headerBackground,
        },
        _a[".".concat(gridClasses_1.gridClasses.scrollbarFiller)] = (_s = {
                minWidth: 'calc(var(--DataGrid-hasScrollY) * var(--DataGrid-scrollbarSize))',
                alignSelf: 'stretch'
            },
            _s["&.".concat(gridClasses_1.gridClasses['scrollbarFiller--borderTop'])] = {
                borderTop: '1px solid var(--DataGrid-rowBorderColor)',
            },
            _s["&.".concat(gridClasses_1.gridClasses['scrollbarFiller--borderBottom'])] = {
                borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
            },
            _s["&.".concat(gridClasses_1.gridClasses['scrollbarFiller--pinnedRight'])] = {
                backgroundColor: cssVariables_1.vars.cell.background.pinned,
                position: 'sticky',
                zIndex: 40, // Should be above the column separator
                right: 0,
            },
            _s),
        _a["& .".concat(gridClasses_1.gridClasses.filler)] = {
            flex: '1 0 auto',
        },
        _a["& .".concat(gridClasses_1.gridClasses['filler--borderBottom'])] = {
            borderBottom: '1px solid var(--DataGrid-rowBorderColor)',
        },
        _a["& .".concat(gridClasses_1.gridClasses.columnHeaders, " .").concat(gridClasses_1.gridClasses.filler)] = {
            backgroundColor: headerBackground,
        },
        /* Hide grid rows, row filler, and vertical scrollbar. Used when skeleton/no columns overlay is visible */
        _a["& .".concat(gridClasses_1.gridClasses['main--hiddenContent'])] = (_t = {},
            _t["& .".concat(gridClasses_1.gridClasses.virtualScrollerContent)] = {
                // We use visibility hidden so that the virtual scroller content retains its height.
                // Position fixed is used to remove the virtual scroller content from the flow.
                // https://github.com/mui/mui-x/issues/14061
                position: 'fixed',
                visibility: 'hidden',
            },
            _t["& .".concat(gridClasses_1.gridClasses['scrollbar--vertical'], ", & .").concat(gridClasses_1.gridClasses.pinnedRows, ", & .").concat(gridClasses_1.gridClasses.virtualScroller, " > .").concat(gridClasses_1.gridClasses.filler)] = {
                display: 'none',
            },
            _t),
        _a["& .".concat(gridClasses_1.gridClasses['row--dropAbove'])] = {
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                backgroundColor: cssVariables_1.vars.colors.interactive.selected,
            },
        },
        _a["& .".concat(gridClasses_1.gridClasses['row--dropBelow'])] = (_u = {
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: cssVariables_1.vars.colors.interactive.selected,
                }
            },
            _u["&.".concat(gridClasses_1.gridClasses['row--lastVisible'])] = {
                '&::before': {
                    bottom: 'calc(var(--DataGrid-hasScrollY) * 0px + (1 - var(--DataGrid-hasScrollY)) * -2px)',
                },
            },
            _u),
        _a["& .".concat(gridClasses_1.gridClasses['row--beingDragged'])] = {
            backgroundColor: cssVariables_1.vars.colors.background.overlay,
            color: cssVariables_1.vars.colors.foreground.disabled,
        },
        _a);
    return gridStyle;
});
function setOpacity(color, opacity) {
    return "rgba(from ".concat(color, " r g b / ").concat(opacity, ")");
}
function removeOpacity(color) {
    return setOpacity(color, 1);
}
function mix(background, overlay, opacity) {
    return "color-mix(in srgb,".concat(background, ", ").concat(overlay, " calc(").concat(opacity, " * 100%))");
}
