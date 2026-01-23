import { spy } from 'sinon';
import { act, fireEvent, reactMajor, waitFor } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { TreeItemLabel } from '@mui/x-tree-view/TreeItem';
import { isJSDOM } from 'test/utils/skipIf';
import { TreeViewAnyStore } from '../../models';

describeTreeView<TreeViewAnyStore>(
  'TreeViewItemsPlugin',
  ({ render, renderFromJSX, treeViewComponentName, TreeViewComponent, TreeItemComponent }) => {
    const isRichTreeView = treeViewComponentName.startsWith('RichTreeView');

    // can't catch render errors in the browser for unknown reason
    // tried try-catch + error boundary + window onError preventDefault
    it.skipIf(!isJSDOM)('should throw an error when two items have the same ID', () => {
      if (treeViewComponentName === 'SimpleTreeView') {
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(() =>
          render({ items: [{ id: '1' }, { id: '1' }], withErrorBoundary: true }),
        ).toErrorDev([
          'Encountered two children with the same key, `1`',
          reactMajor >= 19 &&
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
          reactMajor >= 19 &&
            'Alternatively, you can use the `getItemId` prop to specify a custom id for each item',
          reactMajor < 19 && `The above error occurred in the <ForwardRef(TreeItem2)> component`,
          reactMajor < 19 && `The above error occurred in the <ForwardRef(TreeItem2)> component`,
        ]);
      } else {
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(() =>
          render({ items: [{ id: '1' }, { id: '1' }], withErrorBoundary: true }),
        ).toErrorDev([
          reactMajor >= 19 &&
            'MUI X: The Tree View component requires all items to have a unique `id` property.',
          reactMajor < 19 &&
            `The above error occurred in the <ForwardRef(${treeViewComponentName}2)> component`,
        ]);
      }
    });

    // For now, only SimpleTreeView can use custom id attributes
    it.skipIf(isRichTreeView)('should be able to use a custom id attribute', () => {
      const view = render({
        items: [{ id: '1' }],
        slotProps: {
          item: {
            id: 'customId',
          },
        },
      });

      expect(view.getItemRoot('1')).to.have.attribute('id', 'customId');
    });

    describe('items prop / JSX Tree Item', () => {
      it('should support removing an item', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
        });

        view.setItems([{ id: '1' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1']);
      });

      it('should support adding an item at the end', () => {
        const view = render({
          items: [{ id: '1' }],
        });

        view.setItems([{ id: '1' }, { id: '2' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
      });

      it('should support adding an item at the beginning', () => {
        const view = render({
          items: [{ id: '2' }],
        });

        view.setItems([{ id: '1' }, { id: '2' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '2']);
      });

      it('should update indexes when two items are swapped', () => {
        const onSelectedItemsChange = spy();

        const view = render({
          items: [{ id: '1' }, { id: '2' }, { id: '3' }],
          multiSelect: true,
          onSelectedItemsChange,
        });

        view.setItems([{ id: '1' }, { id: '3' }, { id: '2' }]);
        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '3', '2']);

        // Check if the internal state is updated by running a range selection
        fireEvent.click(view.getItemContent('1'));
        fireEvent.click(view.getItemContent('3'), { shiftKey: true });
        expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal(['1', '3']);
      });

      it('should not mark an item as expandable if its children is an empty array', () => {
        const view = render({
          items: [{ id: '1', children: [] }],
          defaultExpandedItems: ['1'],
        });

        expect(view.getItemRoot('1')).not.to.have.attribute('aria-expanded');
      });

      it.skipIf(isRichTreeView)(
        'should mark an item as not expandable if it has only empty conditional arrays',
        () => {
          const view = renderFromJSX(
            <TreeViewComponent defaultExpandedItems={['1']}>
              <TreeItemComponent itemId="1" label="1" data-testid="1">
                {[]}
                {[]}
              </TreeItemComponent>
            </TreeViewComponent>,
          );

          expect(view.isItemExpanded('1')).to.equal(false);
        },
      );

      it.skipIf(isRichTreeView)(
        'should mark an item as expandable if it has two array as children, one of which is empty (SimpleTreeView only)',
        () => {
          const view = renderFromJSX(
            <TreeViewComponent defaultExpandedItems={['1']}>
              <TreeItemComponent itemId="1" label="1" data-testid="1">
                {[]}
                {[<TreeItemComponent key="1.1" itemId="1.1" />]}
              </TreeItemComponent>
            </TreeViewComponent>,
          );

          expect(view.isItemExpanded('1')).to.equal(true);
        },
      );

      it.skipIf(isRichTreeView)(
        'should mark an item as not expandable if it has one array containing an empty array as a children (SimpleTreeView only)',
        () => {
          const view = renderFromJSX(
            <TreeViewComponent defaultExpandedItems={['1']}>
              <TreeItemComponent itemId="1" label="1" data-testid="1">
                {[[]]}
              </TreeItemComponent>
            </TreeViewComponent>,
          );

          expect(view.isItemExpanded('1')).to.equal(false);
        },
      );

      it.skipIf(!isRichTreeView)('should use getItemLabel to render the label', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          getItemLabel: (item) => `Label: ${item.id}`,
        });

        expect(view.getItemContent('1')).to.have.text('Label: 1');
        expect(view.getItemContent('2')).to.have.text('Label: 2');
      });

      it.skipIf(!isRichTreeView)('should use getItemChildren to find children', () => {
        const items = [
          {
            id: '1',
            label: 'Node 1',
            section: [
              { id: '1.1', label: 'Child 1' },
              { id: '1.2', label: 'Child 2' },
            ],
          },
          { id: '2', label: 'Node 2' },
        ];

        const view = render({
          items,
          getItemChildren: (item) => item.section,
          defaultExpandedItems: ['1'],
        });

        expect(view.getAllTreeItemIds()).to.deep.equal(['1', '1.1', '1.2', '2']);
        expect(view.getItemContent('1.1')).to.have.text('Child 1');
        expect(view.getItemContent('1.2')).to.have.text('Child 2');
      });
    });

    describe('disabled prop', () => {
      it('should not have the attribute `aria-disabled` if disabled is not defined', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2', disabled: false }, { id: '3', disabled: true }],
        });

        expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
        expect(view.getItemRoot('2')).not.to.have.attribute('aria-disabled');
        expect(view.getItemRoot('3')).to.have.attribute('aria-disabled');
      });

      it('should disable all descendants of a disabled item', () => {
        const view = render({
          items: [
            { id: '1', disabled: true, children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] },
          ],
          defaultExpandedItems: ['1', '1.1'],
        });

        expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
        expect(view.getItemRoot('1.1')).to.have.attribute('aria-disabled', 'true');
        expect(view.getItemRoot('1.1.1')).to.have.attribute('aria-disabled', 'true');
      });
    });

    describe('onItemClick prop', () => {
      it('should call onItemClick when clicking on the content of an item', () => {
        const onItemClick = spy();

        const view = render({
          items: [{ id: '1' }],
          onItemClick,
        });

        fireEvent.click(view.getItemContent('1'));
        expect(onItemClick.callCount).to.equal(1);
        expect(onItemClick.lastCall.lastArg).to.equal('1');
      });

      it('should not call onItemClick for the ancestors on the clicked item', () => {
        const onItemClick = spy();

        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          onItemClick,
        });

        fireEvent.click(view.getItemContent('1.1'));
        expect(onItemClick.callCount).to.equal(1);
        expect(onItemClick.lastCall.lastArg).to.equal('1.1');
      });
    });

    describe('Memoization (Rich Tree View only)', () => {
      it.skipIf(!isRichTreeView)(
        'should not re-render any children when the Tree View re-renders (flat tree)',
        () => {
          const spyLabel = spy((props) => <TreeItemLabel {...props} />);
          const view = render({
            items: Array.from({ length: 10 }, (_, i) => ({ id: i.toString() })),
            slotProps: { item: { slots: { label: spyLabel } } },
          });

          spyLabel.resetHistory();

          view.setProps({ onClick: () => {} });

          const renders = spyLabel.getCalls().map((call) => call.args[0].children);
          expect(renders).to.deep.equal([]);
        },
      );

      it.skipIf(!isRichTreeView)(
        'should not re-render every children when updating the state on an item (flat tree)',
        () => {
          const spyLabel = spy((props) => <TreeItemLabel {...props} />);
          const view = render({
            items: Array.from({ length: 10 }, (_, i) => ({ id: i.toString() })),
            selectedItems: [],
            slotProps: { item: { slots: { label: spyLabel } } },
          });

          spyLabel.resetHistory();

          view.setProps({ selectedItems: ['1'] });

          const renders = spyLabel.getCalls().map((call) => call.args[0].children);

          // 2 renders of the 1st item to remove to tabIndex={0}
          // 2 renders of the selected item to change its visual state
          expect(renders).to.deep.equal(['0', '0', '1', '1']);
        },
      );

      it.skipIf(!isRichTreeView)(
        'should not re-render any children when the Tree View re-renders (nested tree)',
        () => {
          const spyLabel = spy((props) => <TreeItemLabel {...props} />);
          const view = render({
            items: Array.from({ length: 5 }, (_, i) => ({
              id: i.toString(),
              children: Array.from({ length: 5 }, (_el, j) => ({ id: `${i}.${j}` })),
            })),
            slotProps: { item: { slots: { label: spyLabel } } },
          });

          spyLabel.resetHistory();

          view.setProps({ onClick: () => {} });

          const renders = spyLabel.getCalls().map((call) => call.args[0].children);
          expect(renders).to.deep.equal([]);
        },
      );

      it.skipIf(!isRichTreeView)(
        'should not re-render every children when updating the state on an item (nested tree)',
        () => {
          const spyLabel = spy((props) => <TreeItemLabel {...props} />);
          const view = render({
            items: Array.from({ length: 5 }, (_, i) => ({
              id: i.toString(),
              children: Array.from({ length: 5 }, (_el, j) => ({ id: `${i}.${j}` })),
            })),
            defaultExpandedItems: Array.from({ length: 5 }, (_, i) => i.toString()),
            selectedItems: [],
            slotProps: { item: { slots: { label: spyLabel } } },
          });

          spyLabel.resetHistory();

          view.setProps({ selectedItems: ['1'] });

          const renders = spyLabel.getCalls().map((call) => call.args[0].children);

          // 2 renders of the 1st item to remove to tabIndex={0}
          // 2 renders of the selected item to change its visual state
          expect(renders).to.deep.equal(['0', '0', '1', '1']);
        },
      );
    });

    describe('API methods', () => {
      // This method is only usable with Rich Tree View components
      describe.skipIf(treeViewComponentName === 'SimpleTreeView')('getItem', () => {
        it('should return the tree', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          });

          expect(view.apiRef.current.getItem('1')).to.deep.equal({
            id: '1',
            children: [{ id: '1.1' }],
          });
        });

        it('should have up to date tree when props.items changes', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          });

          view.setItems([{ id: '1' }, { id: '2' }]);

          expect(view.apiRef.current.getItem('1')).to.deep.equal({ id: '1' });
        });

        it('should contain custom item properties', () => {
          const view = render({
            items: [{ id: '1', customProp: 'foo' }],
          });

          expect(view.apiRef.current.getItem('1')).to.deep.equal({
            id: '1',
            customProp: 'foo',
          });
        });
      });

      describe('getItemDOMElement', () => {
        it('should return the DOM element of the item', () => {
          const view = render({
            items: [{ id: '1' }],
          });

          expect(view.apiRef.current.getItemDOMElement('1')).to.equal(view.getItemRoot('1'));
        });

        it("should return the null when the item doesn't exist", () => {
          const view = render({
            items: [{ id: '1' }],
          });

          expect(view.apiRef.current.getItemDOMElement('2')).to.equal(null);
        });
      });

      // This method is only usable with Rich Tree View components
      describe.skipIf(treeViewComponentName === 'SimpleTreeView')(
        'getItemTree with RichTreeView',
        () => {
          it('should return the tree', () => {
            const view = render({
              items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
            });

            expect(view.apiRef.current.getItemTree()).to.deep.equal([
              { id: '1', children: [{ id: '1.1' }] },
              { id: '2' },
            ]);
          });

          it('should have up to date tree when props.items changes', () => {
            const view = render({
              items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
            });

            view.setItems([{ id: '1' }, { id: '2' }]);

            expect(view.apiRef.current.getItemTree()).to.deep.equal([{ id: '1' }, { id: '2' }]);
          });

          it('should contain custom item properties', () => {
            const view = render({
              items: [{ id: '1', customProp: 'foo' }],
            });

            expect(view.apiRef.current.getItemTree()).to.deep.equal([
              { id: '1', customProp: 'foo' },
            ]);
          });
        },
      );

      // This method is only usable with Rich Tree View components
      describe.skipIf(treeViewComponentName === 'SimpleTreeView')(
        'getItemOrderedChildrenIds',
        () => {
          it('should return the children of an item in their rendering order', () => {
            const view = render({
              items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
            });

            expect(view.apiRef.current.getItemOrderedChildrenIds('1')).to.deep.equal([
              '1.1',
              '1.2',
            ]);
          });

          it('should work for the root items', () => {
            const view = render({
              items: [{ id: '1' }, { id: '2' }],
            });

            expect(view.apiRef.current.getItemOrderedChildrenIds(null)).to.deep.equal(['1', '2']);
          });

          it('should have up to date children when props.items changes', () => {
            const view = render({
              items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
            });

            view.setItems([{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }]);

            expect(view.apiRef.current.getItemOrderedChildrenIds('1')).to.deep.equal([
              '1.1',
              '1.2',
            ]);
          });
        },
      );

      describe('setIsItemDisabled API method', () => {
        it('should disable an item when called with shouldBeDisabled=true', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
          });

          expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');

          act(() => {
            view.apiRef.current.setIsItemDisabled({ itemId: '1', shouldBeDisabled: true });
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
          expect(view.getItemRoot('2')).not.to.have.attribute('aria-disabled');
        });

        it('should enable a disabled item when called with shouldBeDisabled=false', () => {
          const view = render({
            items: [
              { id: '1', disabled: true },
              { id: '2', disabled: true },
            ],
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');

          act(() => {
            view.apiRef.current.setIsItemDisabled({ itemId: '1', shouldBeDisabled: false });
          });

          expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
          expect(view.getItemRoot('2')).to.have.attribute('aria-disabled', 'true');
        });

        it('should toggle disabled state when called without shouldBeDisabled parameter', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2', disabled: true }],
          });

          expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
          expect(view.getItemRoot('2')).to.have.attribute('aria-disabled', 'true');

          act(() => {
            view.apiRef.current.setIsItemDisabled({ itemId: '1' });
            view.apiRef.current.setIsItemDisabled({ itemId: '2' });
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-disabled', 'true');
          expect(view.getItemRoot('2')).not.to.have.attribute('aria-disabled');
        });

        it('should do nothing when called with non-existent itemId', () => {
          const view = render({
            items: [{ id: '1' }],
          });

          act(() => {
            view.apiRef.current.setIsItemDisabled({
              itemId: 'non-existent',
              shouldBeDisabled: true,
            });
          });

          expect(view.getItemRoot('1')).not.to.have.attribute('aria-disabled');
        });
      });
    });

    describe('itemHeight prop', () => {
      it('should not set --TreeView-itemHeight CSS variable when itemHeight is not defined', () => {
        const view = render({
          items: [{ id: '1' }],
        });

        const itemRoot = view.getItemRoot('1');
        expect(itemRoot.style.getPropertyValue('--TreeView-itemHeight')).to.equal('');
      });

      it('should set --TreeView-itemHeight CSS variable when itemHeight is defined', () => {
        const view = render({
          items: [{ id: '1' }],
          itemHeight: 24,
        });

        const itemRoot = view.getItemRoot('1');
        expect(itemRoot.style.getPropertyValue('--TreeView-itemHeight')).to.equal('24px');
      });

      it('should apply itemHeight to all items including nested ones', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          defaultExpandedItems: ['1'],
          itemHeight: 32,
        });

        expect(view.getItemRoot('1').style.getPropertyValue('--TreeView-itemHeight')).to.equal(
          '32px',
        );
        expect(view.getItemRoot('1.1').style.getPropertyValue('--TreeView-itemHeight')).to.equal(
          '32px',
        );
      });

      it('should update --TreeView-itemHeight CSS variable when itemHeight prop changes', () => {
        const view = render({
          items: [{ id: '1' }],
          itemHeight: 24,
        });

        expect(view.getItemRoot('1').style.getPropertyValue('--TreeView-itemHeight')).to.equal(
          '24px',
        );

        view.setProps({ itemHeight: 48 });

        expect(view.getItemRoot('1').style.getPropertyValue('--TreeView-itemHeight')).to.equal(
          '48px',
        );
      });
    });

    describe('domStructure prop', () => {
      it.skipIf(!isRichTreeView)(
        'should use nested DOM structure by default (children inside parent)',
        () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }],
            defaultExpandedItems: ['1'],
          });

          const parentRoot = view.getItemRoot('1');
          const childRoot = view.getItemRoot('1.1');

          // In nested DOM structure, the child is a descendant of the parent
          expect(parentRoot.contains(childRoot)).to.equal(true);
        },
      );

      it.skipIf(!isRichTreeView)(
        'should use flat DOM structure when domStructure="flat" (children as siblings)',
        () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }] }],
            defaultExpandedItems: ['1'],
            domStructure: 'flat',
          });

          const parentRoot = view.getItemRoot('1');
          const childRoot = view.getItemRoot('1.1');

          // In flat DOM structure, the child is NOT a descendant of the parent
          expect(parentRoot.contains(childRoot)).to.equal(false);
          // Both items should be siblings (same parent)
          expect(parentRoot.parentElement).to.equal(childRoot.parentElement);
        },
      );

      it.skipIf(!isRichTreeView)(
        'should render deeply nested items correctly with flat DOM structure',
        () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] }],
            defaultExpandedItems: ['1', '1.1'],
            domStructure: 'flat',
          });

          const item1 = view.getItemRoot('1');
          const item11 = view.getItemRoot('1.1');
          const item111 = view.getItemRoot('1.1.1');

          // All items should be siblings in flat structure
          expect(item1.parentElement).to.equal(item11.parentElement);
          expect(item11.parentElement).to.equal(item111.parentElement);
        },
      );
    });

    describe('lazy loading (dataSource)', () => {
      it.skipIf(treeViewComponentName !== 'RichTreeViewPro')(
        'should not reset focus after lazy loading children when checkboxSelection is enabled',
        async () => {
          function MyComponent() {
            const items = [
              { id: '1', label: 'Node 1' },
              { id: '2', label: 'Node with children' },
            ];

            const getChildrenCount = (item) => {
              if (item.subField === 'child') {
                return 0;
              }
              return 1;
            };

            const getTreeItems = () => {
              return [{ id: '2.1', label: 'Child', subField: 'child' }];
            };

            return (
              <TreeViewComponent
                items={items}
                checkboxSelection
                getItemChildren={(item) => item.children || []}
                getItemId={(item) => item.id}
                getItemLabel={(item) => item.label}
                dataSource={{ getChildrenCount, getTreeItems }}
                slotProps={{
                  item: (ownerState) => ({ 'data-testid': ownerState.itemId }),
                }}
              />
            );
          }

          const view = renderFromJSX(<MyComponent />);

          fireEvent.focus(view.getItemRoot('2'));
          expect(view.getFocusedItemId()).to.equal('2');

          const expandIcon = view
            .getItemRoot('2')
            .querySelector('[data-testid="TreeViewExpandIconIcon"]')!;
          fireEvent.click(expandIcon);
          await waitFor(() => {
            expect(view.isItemExpanded('2')).to.equal(true);
          });

          expect(!!view.getItemRoot('2.1')).to.equal(true);
          // expect(view.getFocusedItemId()).to.equal('2');
        },
      );
    });
  },
);
