"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameImports_1 = require("../../../util/renameImports");
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
        wrapColumn: 40,
    };
    (0, renameImports_1.renameImports)({
        j: j,
        root: root,
        packageNames: ['@mui/x-tree-view', '@mui/x-tree-view-pro'],
        imports: [
            {
                oldEndpoint: 'TreeItem2',
                newEndpoint: 'TreeItem',
                importsMapping: {
                    TreeItem2: 'TreeItem',
                    TreeItem2Root: 'TreeItemRoot',
                    TreeItem2Content: 'TreeItemContent',
                    TreeItem2IconContainer: 'TreeItemIconContainer',
                    TreeItem2GroupTransition: 'TreeItemGroupTransition',
                    TreeItem2Checkbox: 'TreeItemCheckbox',
                    TreeItem2Label: 'TreeItemLabel',
                    TreeItem2Props: 'TreeItemProps',
                    TreeItem2Slots: 'TreeItemSlots',
                    TreeItem2SlotProps: 'TreeItemSlotProps',
                },
            },
            {
                oldEndpoint: 'useTreeItem2',
                newEndpoint: 'useTreeItem',
                importsMapping: {
                    useTreeItem2: 'useTreeItem',
                    unstable_useTreeItem2: 'useTreeItem',
                    UseTreeItem2Parameters: 'UseTreeItemParameters',
                    UseTreeItem2ReturnValue: 'UseTreeItemReturnValue',
                    UseTreeItem2Status: 'UseTreeItemStatus',
                    UseTreeItem2RootSlotOwnProps: 'UseTreeItemRootSlotOwnProps',
                    UseTreeItem2ContentSlotOwnProps: 'UseTreeItemContentSlotOwnProps',
                    UseTreeItem2LabelInputSlotOwnProps: 'UseTreeItemLabelInputSlotOwnProps',
                    UseTreeItem2LabelSlotOwnProps: 'UseTreeItemLabelSlotOwnProps',
                    UseTreeItem2CheckboxSlotOwnProps: 'UseTreeItemCheckboxSlotOwnProps',
                    UseTreeItem2IconContainerSlotOwnProps: 'UseTreeItemIconContainerSlotOwnProps',
                    UseTreeItem2GroupTransitionSlotOwnProps: 'UseTreeItemGroupTransitionSlotOwnProps',
                    UseTreeItem2DragAndDropOverlaySlotOwnProps: 'UseTreeItemDragAndDropOverlaySlotOwnProps',
                },
            },
            {
                oldEndpoint: 'TreeItem2Provider',
                newEndpoint: 'TreeItemProvider',
                importsMapping: {
                    TreeItem2Provider: 'TreeItemProvider',
                    TreeItem2ProviderProps: 'TreeItemProviderProps',
                },
            },
            {
                oldEndpoint: 'TreeItem2Icon',
                newEndpoint: 'TreeItemIcon',
                importsMapping: {
                    TreeItem2Icon: 'TreeItemIcon',
                    TreeItem2IconProps: 'TreeItemIconProps',
                    TreeItem2IconSlots: 'TreeItemIconSlots',
                    TreeItem2IconSlotProps: 'TreeItemIconSlotProps',
                },
            },
            {
                oldEndpoint: 'TreeItem2DragAndDropOverlay',
                newEndpoint: 'TreeItemDragAndDropOverlay',
                importsMapping: {
                    TreeItem2DragAndDropOverlay: 'TreeItemDragAndDropOverlay',
                    TreeItem2DragAndDropOverlayProps: 'TreeItemDragAndDropOverlayProps',
                },
            },
            {
                oldEndpoint: 'TreeItem2LabelInput',
                newEndpoint: 'TreeItemLabelInput',
                importsMapping: {
                    TreeItem2LabelInput: 'TreeItemLabelInput',
                    TreeItem2LabelInputProps: 'TreeItemLabelInputProps',
                },
            },
            {
                oldEndpoint: 'hooks',
                importsMapping: {
                    useTreeItem2Utils: 'useTreeItemUtils',
                },
            },
        ],
    });
    return root.toSource(printOptions);
}
