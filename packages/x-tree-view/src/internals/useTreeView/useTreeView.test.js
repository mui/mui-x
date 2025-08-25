"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeTreeView_1 = require("test/utils/tree-view/describeTreeView");
(0, describeTreeView_1.describeTreeView)('useTreeView hook', function (_a) {
    var render = _a.render, renderFromJSX = _a.renderFromJSX, treeViewComponentName = _a.treeViewComponentName, TreeViewComponent = _a.TreeViewComponent, TreeItemComponent = _a.TreeItemComponent;
    it('should have the role="tree" on the root slot', function () {
        var view = render({ items: [{ id: '1' }] });
        expect(view.getRoot()).to.have.attribute('role', 'tree');
    });
    it('should work inside a Portal', function () {
        var response;
        if (treeViewComponentName === 'SimpleTreeView') {
            response = renderFromJSX(<React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent>
              <TreeItemComponent itemId="1" label="1" data-testid="1"/>
              <TreeItemComponent itemId="2" label="2" data-testid="2"/>
              <TreeItemComponent itemId="3" label="3" data-testid="3"/>
              <TreeItemComponent itemId="4" label="4" data-testid="4"/>
            </TreeViewComponent>
          </React.Fragment>);
        }
        else {
            response = renderFromJSX(<React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent items={[{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]} slots={{
                    item: TreeItemComponent,
                }} slotProps={{
                    item: function (ownerState) { return ({ 'data-testid': ownerState.itemId }); },
                }} getItemLabel={function (item) { return item.id; }}/>
          </React.Fragment>);
        }
        (0, internal_test_utils_1.act)(function () {
            response.getItemRoot('1').focus();
        });
        internal_test_utils_1.fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowDown' });
        expect(response.getFocusedItemId()).to.equal('2');
        internal_test_utils_1.fireEvent.keyDown(response.getItemRoot('2'), { key: 'ArrowDown' });
        expect(response.getFocusedItemId()).to.equal('3');
        internal_test_utils_1.fireEvent.keyDown(response.getItemRoot('3'), { key: 'ArrowDown' });
        expect(response.getFocusedItemId()).to.equal('4');
    });
});
