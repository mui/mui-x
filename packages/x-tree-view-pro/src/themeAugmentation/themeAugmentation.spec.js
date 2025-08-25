"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var styles_1 = require("@mui/material/styles");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
var SimpleTreeView_1 = require("@mui/x-tree-view/SimpleTreeView");
var RichTreeViewPro_1 = require("../RichTreeViewPro");
(0, styles_1.createTheme)({
    components: {
        MuiRichTreeViewPro: {
            defaultProps: {
                defaultExpandedItems: ['root'],
                // @ts-expect-error invalid MuiRichTreeViewPro prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_a = {
                        backgroundColor: 'red'
                    },
                    _a[".".concat(RichTreeViewPro_1.richTreeViewProClasses.root)] = {
                        backgroundColor: 'green',
                    },
                    _a),
                // @ts-expect-error invalid MuiRichTreeViewPro class key
                main: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiTreeItem: {
            defaultProps: {
                color: 'primary',
                // @ts-expect-error invalid MuiTreeItem prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_b = {
                        backgroundColor: 'red'
                    },
                    _b[".".concat(TreeItem_1.treeItemClasses.label)] = {
                        backgroundColor: 'green',
                    },
                    _b),
                // @ts-expect-error invalid MuiTreeItem class key
                main: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiSimpleTreeView: {
            defaultProps: {
                defaultValue: '1',
                // @ts-expect-error invalid MuiSimpleTreeView prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_c = {
                        backgroundColor: 'red'
                    },
                    _c[".".concat(SimpleTreeView_1.simpleTreeViewClasses.itemCheckbox)] = {
                        backgroundColor: 'green',
                    },
                    _c),
                // @ts-expect-error invalid MuiSimpleTreeView class key
                main: {
                    backgroundColor: 'blue',
                },
            },
        },
    },
});
