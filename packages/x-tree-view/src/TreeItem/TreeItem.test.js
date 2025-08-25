"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var SimpleTreeView_1 = require("@mui/x-tree-view/SimpleTreeView");
var TreeItem_1 = require("@mui/x-tree-view/TreeItem");
var describeConformance_1 = require("test/utils/describeConformance");
var fakeContextValue_1 = require("test/utils/tree-view/fakeContextValue");
var describeSlotsConformance_1 = require("test/utils/describeSlotsConformance");
// It's not publicly exported, so, using a relative import
var TreeViewContext_1 = require("../internals/TreeViewProvider/TreeViewContext");
describe('<TreeItem />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)(<TreeItem_1.TreeItem itemId="one" label="one"/>, function () { return ({
        classes: TreeItem_1.treeItemClasses,
        inheritComponent: 'li',
        render: function (item) {
            return render(<TreeViewContext_1.TreeViewContext.Provider value={(0, fakeContextValue_1.getFakeContextValue)()}>{item}</TreeViewContext_1.TreeViewContext.Provider>);
        },
        muiName: 'MuiTreeItem',
        refInstanceof: window.HTMLLIElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
    (0, describeSlotsConformance_1.describeSlotsConformance)({
        render: render,
        getElement: function (_a) {
            var props = _a.props, slotName = _a.slotName;
            return (<SimpleTreeView_1.SimpleTreeView checkboxSelection={slotName === 'checkbox'}>
        <TreeItem_1.TreeItem itemId="one" label="one" {...props}/>
      </SimpleTreeView_1.SimpleTreeView>);
        },
        slots: {
            label: { className: TreeItem_1.treeItemClasses.label },
            iconContainer: { className: TreeItem_1.treeItemClasses.iconContainer },
            content: { className: TreeItem_1.treeItemClasses.content },
            checkbox: { className: TreeItem_1.treeItemClasses.checkbox },
        },
    });
});
