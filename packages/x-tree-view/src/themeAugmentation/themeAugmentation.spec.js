"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var styles_1 = require("@mui/material/styles");
var TreeItem_1 = require("../TreeItem");
var RichTreeView_1 = require("../RichTreeView");
var SimpleTreeView_1 = require("../SimpleTreeView");
(0, styles_1.createTheme)({
    components: {
        MuiSimpleTreeView: {
            defaultProps: {
                defaultExpandedItems: ['root'],
                // @ts-expect-error invalid MuiSimpleTreeView prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_a = {
                        backgroundColor: 'red'
                    },
                    _a[".".concat(SimpleTreeView_1.simpleTreeViewClasses.root)] = {
                        backgroundColor: 'green',
                    },
                    _a),
                // @ts-expect-error invalid MuiSimpleTreeView class key
                main: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiRichTreeView: {
            defaultProps: {
                defaultExpandedItems: ['root'],
                // @ts-expect-error invalid MuiRichTreeView prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_b = {
                        backgroundColor: 'red'
                    },
                    _b[".".concat(RichTreeView_1.richTreeViewClasses.root)] = {
                        backgroundColor: 'green',
                    },
                    _b),
                // @ts-expect-error invalid MuiRichTreeView class key
                main: {
                    backgroundColor: 'blue',
                },
            },
        },
        MuiTreeItem: {
            defaultProps: {
                itemId: '1',
                // @ts-expect-error invalid MuiTreeItem prop
                someRandomProp: true,
            },
            styleOverrides: {
                root: (_c = {
                        backgroundColor: 'red'
                    },
                    _c[".".concat(TreeItem_1.treeItemClasses.content)] = {
                        backgroundColor: 'green',
                    },
                    _c),
                // @ts-expect-error invalid MuiTreeItem class key
                main: {
                    backgroundColor: 'blue',
                },
            },
        },
    },
});
