import { spy } from 'sinon';
import { fireEvent, act } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { TreeViewAnyStore } from '../../models';

/**
 * All tests related to keyboard navigation (e.g.: selection using "Space")
 * are located in the `useTreeViewKeyboardNavigation.test.tsx` file.
 */
describeTreeView<TreeViewAnyStore>(
  'TreeViewSelectionPlugin',
  ({ render, treeViewComponentName }) => {
    describe('model props (selectedItems, defaultSelectedItems, onSelectedItemsChange)', () => {
      beforeEach(() => {
        clearWarningsCache();
      });

      it('should not select items when no default state and no control state are defined', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
        });

        expect(view.isItemSelected('1')).to.equal(false);
      });

      it('should use the default state when defined', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          defaultSelectedItems: ['1'],
        });

        expect(view.isItemSelected('1')).to.equal(true);
      });

      it('should use the controlled state when defined', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          selectedItems: ['1'],
        });

        expect(view.isItemSelected('1')).to.equal(true);
      });

      it('should use the controlled state instead of the default state when both are defined', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          selectedItems: ['1'],
          defaultSelectedItems: ['2'],
        });

        expect(view.isItemSelected('1')).to.equal(true);
      });

      it('should react to controlled state update', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          selectedItems: [],
        });

        view.setProps({ selectedItems: ['1'] });
        expect(view.isItemSelected('1')).to.equal(true);
      });

      it('should call the onSelectedItemsChange callback when the model is updated (single selection and add selected item)', () => {
        const onSelectedItemsChange = spy();

        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          onSelectedItemsChange,
        });

        fireEvent.click(view.getItemContent('1'));

        expect(onSelectedItemsChange.callCount).to.equal(1);
        expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal('1');
      });

      // TODO: Re-enable this test if we have a way to un-select an item in single selection.
      it.todo(
        'should call onSelectedItemsChange callback when the model is updated (single selection and remove selected item',
        () => {
          const onSelectedItemsChange = spy();

          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            onSelectedItemsChange,
            defaultSelectedItems: ['1'],
          });

          fireEvent.click(view.getItemContent('1'));

          expect(onSelectedItemsChange.callCount).to.equal(1);
          expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal([]);
        },
      );

      it('should call the onSelectedItemsChange callback when the model is updated (multi selection and add selected item to empty list)', () => {
        const onSelectedItemsChange = spy();

        const view = render({
          multiSelect: true,
          items: [{ id: '1' }, { id: '2' }],
          onSelectedItemsChange,
        });

        fireEvent.click(view.getItemContent('1'));

        expect(onSelectedItemsChange.callCount).to.equal(1);
        expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal(['1']);
      });

      it('should call the onSelectedItemsChange callback when the model is updated (multi selection and add selected item to non-empty list)', () => {
        const onSelectedItemsChange = spy();

        const view = render({
          multiSelect: true,
          items: [{ id: '1' }, { id: '2' }],
          onSelectedItemsChange,
          defaultSelectedItems: ['1'],
        });

        fireEvent.click(view.getItemContent('2'), { ctrlKey: true });

        expect(onSelectedItemsChange.callCount).to.equal(1);
        expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal(['2', '1']);
      });

      it('should call the onSelectedItemsChange callback when the model is updated (multi selection and remove selected item)', () => {
        const onSelectedItemsChange = spy();

        const view = render({
          multiSelect: true,
          items: [{ id: '1' }, { id: '2' }],
          onSelectedItemsChange,
          defaultSelectedItems: ['1'],
        });

        fireEvent.click(view.getItemContent('1'), { ctrlKey: true });

        expect(onSelectedItemsChange.callCount).to.equal(1);
        expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal([]);
      });

      it('should warn when switching from controlled to uncontrolled', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          selectedItems: [],
        });

        expect(() => {
          view.setProps({ selectedItems: undefined });
        }).toErrorDev(
          `MUI X Tree View: A component is changing the controlled selectedItems state of ${treeViewComponentName} to be uncontrolled.`,
        );
      });

      it('should warn and not react to update when updating the default state', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          defaultSelectedItems: ['1'],
        });

        expect(() => {
          view.setProps({ defaultSelectedItems: ['2'] });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
        }).toErrorDev(
          `MUI X Tree View: A component is changing the default selectedItems state of an uncontrolled ${treeViewComponentName} after being initialized.`,
        );
      });
    });

    describe('item click interaction', () => {
      describe('single selection', () => {
        it('should select un-selected item when clicking on an item content', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(true);
        });

        it('should not un-select selected item when clicking on an item content', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: '1',
          });

          expect(view.isItemSelected('1')).to.equal(true);

          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(true);
        });

        it('should not select an item when click and disableSelection', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should not select an item when clicking on a disabled item content', () => {
          const view = render({
            items: [{ id: '1', disabled: true }, { id: '2' }],
          });

          expect(view.isItemSelected('1')).to.equal(false);
          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });
      });

      describe('multi selection', () => {
        it('should select un-selected item and remove other selected items when clicking on an item content', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['2'],
          });

          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);

          fireEvent.click(view.getItemContent('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
        });

        it('should not un-select selected item when clicking on an item content', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1'],
          });

          expect(view.isItemSelected('1')).to.equal(true);

          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(true);
        });

        it('should un-select selected item when clicking on its content while holding Ctrl', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1', '2'],
          });

          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
          fireEvent.click(view.getItemContent('1'), { ctrlKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
        });

        it('should un-select selected item when clicking on its content while holding Meta', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1', '2'],
          });

          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);

          fireEvent.click(view.getItemContent('1'), { metaKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
        });

        it('should not select an item when click and disableSelection', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should not select an item when clicking on a disabled item content', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1', disabled: true }, { id: '2' }],
          });

          expect(view.isItemSelected('1')).to.equal(false);
          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should select un-selected item when clicking on its content while holding Ctrl', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }, { id: '3' }],
            defaultSelectedItems: ['1'],
          });

          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

          fireEvent.click(view.getItemContent('3'), { ctrlKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
        });

        it('should do nothing when clicking on an item content on a fresh tree whil holding Shift', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
          });

          fireEvent.click(view.getItemContent('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal([]);
        });

        it('should expand the selection range when clicking on an item content below the last selected item while holding Shift', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
          });

          fireEvent.click(view.getItemContent('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);

          fireEvent.click(view.getItemContent('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
        });

        it('should expand the selection range when clicking on an item content above the last selected item while holding Shift', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
          });

          fireEvent.click(view.getItemContent('3'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['3']);

          fireEvent.click(view.getItemContent('2'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
        });

        it('should expand the selection range when clicking on an item content while holding Shift after un-selecting another item', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
          });

          fireEvent.click(view.getItemContent('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

          fireEvent.click(view.getItemContent('2'), { ctrlKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);

          fireEvent.click(view.getItemContent('2'), { ctrlKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

          fireEvent.click(view.getItemContent('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2', '2.1', '3']);
        });

        it('should not expand the selection range when clicking on a disabled item content then clicking on an item content while holding Shift', () => {
          const view = render({
            multiSelect: true,
            items: [
              { id: '1' },
              { id: '2', disabled: true },
              { id: '2.1' },
              { id: '3' },
              { id: '4' },
            ],
          });

          fireEvent.click(view.getItemContent('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal([]);

          fireEvent.click(view.getItemContent('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal([]);
        });

        it('should not expand the selection range when clicking on an item content then clicking a disabled item content while holding Shift', () => {
          const view = render({
            multiSelect: true,
            items: [
              { id: '1' },
              { id: '2' },
              { id: '2.1' },
              { id: '3', disabled: true },
              { id: '4' },
            ],
          });

          fireEvent.click(view.getItemContent('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);

          fireEvent.click(view.getItemContent('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
        });

        it('should not select disabled items that are part of the selected range', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
          });

          fireEvent.click(view.getItemContent('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

          fireEvent.click(view.getItemContent('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
        });

        it('should not crash when selecting multiple items in a deeply nested tree', () => {
          const view = render({
            multiSelect: true,
            items: [
              { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] },
              { id: '2' },
            ],
            defaultExpandedItems: ['1', '1.1'],
          });

          fireEvent.click(view.getItemContent('1.1.1'));
          fireEvent.click(view.getItemContent('2'), { shiftKey: true });

          expect(view.getSelectedTreeItems()).to.deep.equal(['1.1.1', '2']);
        });
      });
    });

    describe('checkbox interaction', () => {
      describe('render checkbox when needed', () => {
        it('should not render a checkbox when checkboxSelection is not defined', () => {
          const view = render({
            items: [{ id: '1' }],
          });

          expect(view.getItemCheckbox('1')).to.equal(null);
        });

        it('should not render a checkbox when checkboxSelection is false', () => {
          const view = render({
            checkboxSelection: false,
            items: [{ id: '1' }],
          });

          expect(view.getItemCheckbox('1')).to.equal(null);
        });

        it('should render a checkbox when checkboxSelection is true', () => {
          const view = render({
            checkboxSelection: true,
            items: [{ id: '1' }],
          });

          expect(view.getItemCheckbox('1')).not.to.equal(null);
        });
      });

      describe('single selection', () => {
        it('should not change selection when clicking on an item content', () => {
          const view = render({
            checkboxSelection: true,
            items: [{ id: '1' }],
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should select un-selected item when clicking on an item checkbox', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            checkboxSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.isItemSelected('1')).to.equal(true);
        });

        it('should un-select selected item when clicking on an item checkbox', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: '1',
            checkboxSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(true);

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should hide checkbox and not select when disableSelection is true on TreeView', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
            checkboxSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);
          // Checkbox should be hidden when selection is disabled
          expect(view.getItemContent('1').querySelector('input[type="checkbox"]')).to.equal(null);
          // Clicking content should not select
          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should not select an item when clicking on a disabled item checkbox', () => {
          const view = render({
            items: [{ id: '1', disabled: true }, { id: '2' }],
            checkboxSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);
          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });
      });

      describe('multi selection', () => {
        it('should not change selection when clicking on an item content', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }],
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should select un-selected item and keep other items selected when clicking on an item checkbox', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['2'],
          });

          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
        });

        it('should un-select selected item when clicking on an item checkbox', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1'],
          });

          expect(view.isItemSelected('1')).to.equal(true);

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should hide checkbox and not select when disableSelection is true on TreeView', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);
          // Checkbox should be hidden when selection is disabled
          expect(view.getItemContent('1').querySelector('input[type="checkbox"]')).to.equal(null);
          // Clicking content should not select
          fireEvent.click(view.getItemContent('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should not select an item when clicking on a disabled item content', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', disabled: true }, { id: '2' }],
          });

          expect(view.isItemSelected('1')).to.equal(false);
          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should expand the selection range when clicking on an item checkbox below the last selected item while holding Shift', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
          });

          fireEvent.click(view.getItemCheckboxInput('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);

          fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
        });

        it('should expand the selection range when clicking on an item checkbox above the last selected item while holding Shift', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
          });

          fireEvent.click(view.getItemCheckboxInput('3'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['3']);

          fireEvent.click(view.getItemCheckboxInput('2'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2', '2.1', '3']);
        });

        it('should expand the selection range when clicking on an item checkbox while holding Shift after un-selecting another item', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2' }, { id: '2.1' }, { id: '3' }, { id: '4' }],
          });

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

          fireEvent.click(view.getItemCheckboxInput('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);

          fireEvent.click(view.getItemCheckboxInput('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

          fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2', '2.1', '3']);
        });

        it('should not expand the selection range when clicking on a disabled item checkbox then clicking on an item checkbox while holding Shift', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [
              { id: '1' },
              { id: '2', disabled: true },
              { id: '2.1' },
              { id: '3' },
              { id: '4' },
            ],
          });

          fireEvent.click(view.getItemCheckboxInput('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal([]);

          fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal([]);
        });

        it('should not expand the selection range when clicking on an item checkbox then clicking a disabled item checkbox while holding Shift', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [
              { id: '1' },
              { id: '2' },
              { id: '2.1' },
              { id: '3', disabled: true },
              { id: '4' },
            ],
          });

          fireEvent.click(view.getItemCheckboxInput('2'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);

          fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['2']);
        });

        it('should not select disabled items that are part of the selected range', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2', disabled: true }, { id: '3' }],
          });

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

          fireEvent.click(view.getItemCheckboxInput('3'), { shiftKey: true });
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
        });

        it('should not select the parent when selecting all the children', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }, { id: '2' }],
            defaultSelectedItems: ['1.2'],
            defaultExpandedItems: ['1'],
          });

          fireEvent.click(view.getItemCheckboxInput('1.1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1.1', '1.2']);
        });

        it('should set the parent checkbox as indeterminate when some children are selected but the parent is not', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }, { id: '2' }],
            defaultSelectedItems: ['1.1'],
            defaultExpandedItems: ['1'],
          });

          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
        });

        it('should set the parent checkbox indeterminate when all its children are selected but the parent is not', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
            defaultSelectedItems: ['1.1', '1.2'],
            defaultExpandedItems: ['1'],
          });

          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
        });

        it('should set the parent checkbox indeterminate when some of its descendants are selected but the parent is not', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [
              { id: '1', children: [{ id: '1.1' }, { id: '1.2', children: [{ id: '1.2.1' }] }] },
            ],
            defaultSelectedItems: ['1.2.1'],
            defaultExpandedItems: ['1', '1.2'],
          });

          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
        });

        it('should keep the parent checkbox indeterminate after collapsing it and expanding another node', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [
              { id: '1', children: [{ id: '1.1' }, { id: '1.2' }] },
              { id: '2', children: [{ id: '2.1' }] },
            ],
            defaultSelectedItems: ['1.1'],
            defaultExpandedItems: ['1'],
          });

          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');

          fireEvent.click(view.getItemContent('1'));
          fireEvent.click(view.getItemContent('2'));

          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
        });

        it('should keep parent indeterminate (3 levels) after collapsing the parent and expanding a sibling node', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [
              {
                id: '1',
                children: [
                  { id: '1.1', children: [{ id: '1.1.1' }, { id: '1.1.2' }] },
                  { id: '1.2' },
                ],
              },
              { id: '2', children: [{ id: '2.1' }] },
            ],
            defaultSelectedItems: ['1.1.1'],
            defaultExpandedItems: ['1', '1.1'],
          });

          expect(view.getItemCheckboxInput('1.1').dataset.indeterminate).to.equal('true');
          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');

          fireEvent.click(view.getItemContent('1'));
          fireEvent.click(view.getItemContent('2'));

          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('true');
        });

        it('should not set the parent checkbox as indeterminate when no child is selected and the parent is not either', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }, { id: '2' }],
            defaultExpandedItems: ['1'],
          });

          expect(view.getItemCheckboxInput('1').dataset.indeterminate).to.equal('false');
        });

        it('should update the intermediate state of the parent when selecting a child', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }, { id: '2.2' }] }],
            defaultExpandedItems: ['2'],
          });

          expect(view.getItemCheckboxInput('2').dataset.indeterminate).to.equal('false');

          fireEvent.click(view.getItemCheckboxInput('2.1'));
          expect(view.getItemCheckboxInput('2').dataset.indeterminate).to.equal('true');

          fireEvent.click(view.getItemCheckboxInput('2.1'));
          expect(view.getItemCheckboxInput('2').dataset.indeterminate).to.equal('false');
        });
      });

      describe('multi selection with selectionPropagation.descendants = true', () => {
        it('should select all the children when selecting a parent', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
            defaultExpandedItems: ['1'],
            selectionPropagation: { descendants: true },
          });

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '1.1', '1.2']);
        });

        it('should deselect all the children when deselecting a parent', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
            defaultSelectedItems: ['1', '1.1', '1.2'],
            defaultExpandedItems: ['1'],
            selectionPropagation: { descendants: true },
          });

          fireEvent.click(view.getItemCheckboxInput('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal([]);
        });

        it('should not select the parent when selecting all the children', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
            defaultSelectedItems: ['1.2'],
            defaultExpandedItems: ['1'],
            selectionPropagation: { descendants: true },
          });

          fireEvent.click(view.getItemCheckboxInput('1.1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1.1', '1.2']);
        });

        it('should not unselect the parent when unselecting a children', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
            defaultSelectedItems: ['1', '1.1', '1.2'],
            defaultExpandedItems: ['1'],
            selectionPropagation: { descendants: true },
          });

          fireEvent.click(view.getItemCheckboxInput('1.1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '1.2']);
        });

        it('should select all the children when selecting a collapsed parent and then expanding', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }],
            selectionPropagation: { descendants: true },
          });

          fireEvent.click(view.getItemCheckboxInput('1'));
          fireEvent.click(view.getItemContent('1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '1.1', '1.2']);
        });
      });

      describe('multi selection with selectionPropagation.parents = true', () => {
        it('should select all the parents when selecting a child', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] }],
            defaultExpandedItems: ['1', '1.1'],
            selectionPropagation: { parents: true },
          });

          fireEvent.click(view.getItemCheckboxInput('1.1.1'));
          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '1.1', '1.1.1']);
        });

        it('should deselect all the parents when deselecting a child', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }] }] }],
            defaultSelectedItems: ['1', '1.1', '1.1.1'],
            defaultExpandedItems: ['1', '1.1'],
            selectionPropagation: { parents: true },
          });

          fireEvent.click(view.getItemCheckboxInput('1.1.1'));
          expect(view.getSelectedTreeItems()).to.deep.equal([]);
        });
      });
    });

    describe('aria-multiselectable tree attribute', () => {
      it('should have the attribute `aria-multiselectable=false if using single select`', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }],
        });

        expect(view.getRoot()).to.have.attribute('aria-multiselectable', 'false');
      });

      it('should have the attribute `aria-multiselectable=true if using multi select`', () => {
        const view = render({ items: [{ id: '1' }, { id: '2' }], multiSelect: true });

        expect(view.getRoot()).to.have.attribute('aria-multiselectable', 'true');
      });
    });

    // The `aria-checked` attribute is used by the `view.isItemSelected` method.
    // This `describe` only tests basics scenarios, more complex scenarios are tested in this file's other `describe`.
    describe('aria-checked item attribute', () => {
      describe('single selection', () => {
        it('should have the attribute `aria-checked=false` if not selected', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-checked', 'false');
        });

        it('should have the attribute `aria-checked=true` if selected', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: '1',
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-checked', 'true');
        });

        it('should have the attribute `aria-cheded="mixed"` if partially selected', () => {
          const view = render({
            items: [{ id: '1', children: [{ id: '1.1' }, { id: '1.2' }] }, { id: '2' }],
            defaultSelectedItems: '1.1',
            defaultExpandedItems: ['1'],
          });
          expect(view.getItemRoot('1')).to.have.attribute('aria-checked', 'mixed');
        });
      });

      describe('multi selection', () => {
        it('should have the attribute `aria-checked=false` if not selected', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-checked', 'false');
        });

        it('should have the attribute `aria-checked=true` if selected', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1'],
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-checked', 'true');
        });

        it('should not have the attribute `aria-checked=false` if disabledSelection is true', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          expect(view.getItemRoot('1')).not.to.have.attribute('aria-checked');
        });

        it('should not have the attribute `aria-checked=false` if the item is disabled', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1', disabled: true }, { id: '2' }],
          });

          expect(view.getItemRoot('1')).not.to.have.attribute('aria-checked');
        });
      });
    });

    describe('onItemSelectionToggle prop', () => {
      it('should call the onItemSelectionToggle callback when selecting an item', () => {
        const onItemSelectionToggle = spy();

        const view = render({
          multiSelect: true,
          items: [{ id: '1' }, { id: '2' }],
          onItemSelectionToggle,
        });

        fireEvent.click(view.getItemContent('1'));
        expect(onItemSelectionToggle.callCount).to.equal(1);
        expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
        expect(onItemSelectionToggle.lastCall.args[2]).to.equal(true);
      });

      it('should call the onItemSelectionToggle callback when un-selecting an item', () => {
        const onItemSelectionToggle = spy();

        const view = render({
          multiSelect: true,
          items: [{ id: '1' }, { id: '2' }],
          defaultSelectedItems: ['1'],
          onItemSelectionToggle,
        });

        fireEvent.click(view.getItemContent('1'), { ctrlKey: true });
        expect(onItemSelectionToggle.callCount).to.equal(1);
        expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
        expect(onItemSelectionToggle.lastCall.args[2]).to.equal(false);
      });
    });

    describe('setItemSelection() api method', () => {
      describe('single selection', () => {
        it('should select un-selected item when shouldBeSelected is not defined', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
          });

          act(() => {
            view.apiRef.current.setItemSelection({ itemId: '1', event: {} as any });
          });

          expect(view.isItemSelected('1')).to.equal(true);
        });

        it('should un-select selected item when shouldBeSelected is not defined', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1'],
          });

          act(() => {
            view.apiRef.current.setItemSelection({ itemId: '1', event: {} as any });
          });

          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should not select an item when disableSelection is true', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          act(() => {
            view.apiRef.current.setItemSelection({ itemId: '1', event: {} as any });
          });

          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should not un-select an item when disableSelection is true', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1'],
            disableSelection: true,
          });

          act(() => {
            view.apiRef.current.setItemSelection({ itemId: '1', event: {} as any });
          });

          expect(view.isItemSelected('1')).to.equal(true);
        });
      });

      describe('multi selection', () => {
        it('should select un-selected item and remove other selected items when shouldBeSelected is not defined', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['2'],
            multiSelect: true,
          });

          act(() => {
            view.apiRef.current.setItemSelection({ itemId: '1', event: {} as any });
          });

          expect(view.getSelectedTreeItems()).to.deep.equal(['1']);
        });

        it('should select un-selected item and keep other selected items when shouldBeSelected is not defined and keepExistingSelection is true', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['2'],
            multiSelect: true,
          });

          act(() => {
            view.apiRef.current.setItemSelection({
              itemId: '1',
              event: {} as any,
              keepExistingSelection: true,
            });
          });

          expect(view.getSelectedTreeItems()).to.deep.equal(['1', '2']);
        });
      });

      describe('onItemSelectionToggle prop', () => {
        it('should call call onItemSelectionToggle callback when selecting an item', () => {
          const event = {} as any;
          const onItemSelectionToggle = spy();

          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            onItemSelectionToggle,
          });

          act(() => {
            view.apiRef.current.setItemSelection({ itemId: '1', event });
          });

          expect(onItemSelectionToggle.callCount).to.equal(1);
          expect(onItemSelectionToggle.lastCall.args[0]).to.equal(event);
          expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
          expect(onItemSelectionToggle.lastCall.args[2]).to.equal(true);
        });

        it('should call call onItemSelectionToggle callback when un-selecting an item', () => {
          const event = {} as any;
          const onItemSelectionToggle = spy();

          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            onItemSelectionToggle,
            defaultSelectedItems: '1',
          });

          act(() => {
            view.apiRef.current.setItemSelection({ itemId: '1', event });
          });

          expect(onItemSelectionToggle.callCount).to.equal(1);
          expect(onItemSelectionToggle.lastCall.args[0]).to.equal(event);
          expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
          expect(onItemSelectionToggle.lastCall.args[2]).to.equal(false);
        });
      });
    });

    describe('disableSelection item property', () => {
      it('should not select an item when clicking if disableSelection is true', () => {
        const view = render({
          items: [{ id: '1', disableSelection: true }, { id: '2' }],
        });

        expect(view.isItemSelected('1')).to.equal(false);
        fireEvent.click(view.getItemContent('1'));
        expect(view.isItemSelected('1')).to.equal(false);

        expect(view.isItemSelected('2')).to.equal(false);
        fireEvent.click(view.getItemContent('2'));
        expect(view.isItemSelected('2')).to.equal(true);
      });

      it('should hide the checkbox when disableSelection is true', () => {
        const view = render({
          items: [{ id: '1', disableSelection: true }, { id: '2' }],
          checkboxSelection: true,
        });

        expect(view.getItemContent('1').querySelector('input[type="checkbox"]')).to.equal(null);
        expect(view.getItemContent('2').querySelector('input[type="checkbox"]')).not.to.equal(null);
      });

      it('should not have aria-checked attribute when disableSelection is true', () => {
        const view = render({
          items: [{ id: '1', disableSelection: true }, { id: '2' }],
        });

        expect(view.getItemRoot('1')).not.to.have.attribute('aria-checked');
        expect(view.getItemRoot('2')).to.have.attribute('aria-checked', 'false');
      });

      it('should not include items with disableSelection when selecting a range (multi selection)', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2', disableSelection: true }, { id: '3' }],
          multiSelect: true,
        });

        fireEvent.click(view.getItemContent('1'));
        expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

        fireEvent.click(view.getItemContent('3'), { shiftKey: true });
        expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
      });
    });

    // isItemSelectionDisabled is only available on RichTreeView (requires items prop)
    describe.skipIf(treeViewComponentName === 'SimpleTreeView')(
      'isItemSelectionDisabled prop',
      () => {
        describe('isItemSelectionDisabled as a function', () => {
          it('should not select an item when clicking if isItemSelectionDisabled returns true', () => {
            const view = render({
              items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
              isItemSelectionDisabled: (item: any) => !!item.children && item.children.length > 0,
            });

            expect(view.isItemSelected('1')).to.equal(false);
            fireEvent.click(view.getItemContent('1'));
            expect(view.isItemSelected('1')).to.equal(false);

            expect(view.isItemSelected('1.1')).to.equal(false);
            fireEvent.click(view.getItemContent('1.1'));
            expect(view.isItemSelected('1.1')).to.equal(true);
          });

          it('should hide the checkbox when item is not selectable', () => {
            const view = render({
              items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
              checkboxSelection: true,
              defaultExpandedItems: ['1'],
              isItemSelectionDisabled: (item: any) => !!item.children && item.children.length > 0,
            });

            // Parent item should not have a checkbox input
            expect(view.getItemContent('1').querySelector('input[type="checkbox"]')).to.equal(null);
            // Leaf item should have a checkbox input
            expect(view.getItemContent('1.1').querySelector('input[type="checkbox"]')).not.to.equal(
              null,
            );
          });

          it('should not have aria-checked attribute when item is not selectable', () => {
            const view = render({
              items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
              defaultExpandedItems: ['1'],
              isItemSelectionDisabled: (item: any) => !!item.children && item.children.length > 0,
            });

            expect(view.getItemRoot('1')).not.to.have.attribute('aria-checked');
            expect(view.getItemRoot('1.1')).to.have.attribute('aria-checked', 'false');
          });
        });

        describe('with multi selection', () => {
          it('should not include non-selectable items when selecting a range', () => {
            const view = render({
              items: [{ id: '1' }, { id: '2', children: [{ id: '2.1' }] }, { id: '3' }],
              multiSelect: true,
              isItemSelectionDisabled: (item: any) => !!item.children && item.children.length > 0,
            });

            fireEvent.click(view.getItemContent('1'));
            expect(view.getSelectedTreeItems()).to.deep.equal(['1']);

            fireEvent.click(view.getItemContent('3'), { shiftKey: true });
            expect(view.getSelectedTreeItems()).to.deep.equal(['1', '3']);
          });
        });
      },
    );
  },
);
