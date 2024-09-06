import * as React from 'react';
import { expect } from 'chai';
import { fireEvent, act } from '@mui/internal-test-utils';
import {
  describeTreeView,
  DescribeTreeViewRendererUtils,
} from 'test/utils/tree-view/describeTreeView';

describeTreeView<[]>(
  'useTreeView hook',
  ({ render, renderFromJSX, treeViewComponentName, TreeViewComponent, TreeItemComponent }) => {
    it('should have the role="tree" on the root slot', () => {
      const view = render({ items: [{ id: '1' }] });

      expect(view.getRoot()).to.have.attribute('role', 'tree');
    });

    it('should work inside a Portal', () => {
      let response: DescribeTreeViewRendererUtils;
      if (treeViewComponentName === 'SimpleTreeView') {
        response = renderFromJSX(
          <React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent>
              <TreeItemComponent itemId="1" label="1" data-testid="1" />
              <TreeItemComponent itemId="2" label="2" data-testid="2" />
              <TreeItemComponent itemId="3" label="3" data-testid="3" />
              <TreeItemComponent itemId="4" label="4" data-testid="4" />
            </TreeViewComponent>
          </React.Fragment>,
        );
      } else {
        response = renderFromJSX(
          <React.Fragment>
            <button type="button">Some focusable element</button>
            <TreeViewComponent
              items={[{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]}
              slots={{
                item: TreeItemComponent,
              }}
              slotProps={{
                item: (ownerState) => ({ 'data-testid': ownerState.itemId }) as any,
              }}
              getItemLabel={(item) => item.id}
            />
          </React.Fragment>,
        );
      }

      act(() => {
        response.getItemRoot('1').focus();
      });

      fireEvent.keyDown(response.getItemRoot('1'), { key: 'ArrowDown' });
      expect(response.getFocusedItemId()).to.equal('2');

      fireEvent.keyDown(response.getItemRoot('2'), { key: 'ArrowDown' });
      expect(response.getFocusedItemId()).to.equal('3');

      fireEvent.keyDown(response.getItemRoot('3'), { key: 'ArrowDown' });
      expect(response.getFocusedItemId()).to.equal('4');
    });
  },
);
