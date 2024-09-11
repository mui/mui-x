import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, act } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import {
  UseTreeViewExpansionSignature,
  UseTreeViewSelectionSignature,
} from '@mui/x-tree-view/internals';

/**
 * All tests related to keyboard navigation (e.g.: selection using "Space")
 * are located in the `useTreeViewKeyboardNavigation.test.tsx` file.
 */
describeTreeView<[UseTreeViewSelectionSignature, UseTreeViewExpansionSignature]>(
  'useTreeViewSelection plugin',
  ({ render }) => {
    describe('model props (selectedItems, defaultSelectedItems, onSelectedItemsChange)', () => {
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
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('should call onSelectedItemsChange callback when the model is updated (single selection and remove selected item', () => {
        const onSelectedItemsChange = spy();

        const view = render({
          items: [{ id: '1' }, { id: '2' }],
          onSelectedItemsChange,
          defaultSelectedItems: ['1'],
        });

        fireEvent.click(view.getItemContent('1'));

        expect(onSelectedItemsChange.callCount).to.equal(1);
        expect(onSelectedItemsChange.lastCall.args[1]).to.deep.equal([]);
      });

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
          'MUI X: A component is changing the controlled selectedItems state of TreeView to be uncontrolled.',
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
          'MUI X: A component is changing the default selectedItems state of an uncontrolled TreeView after being initialized. To suppress this warning opt to use a controlled TreeView.',
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

        it('should not select an item when click and disableSelection', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
            checkboxSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemCheckboxInput('1'));
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

        it('should not select an item when click and disableSelection', () => {
          const view = render({
            multiSelect: true,
            checkboxSelection: true,
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          expect(view.isItemSelected('1')).to.equal(false);

          fireEvent.click(view.getItemCheckboxInput('1'));
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

    // The `aria-selected` attribute is used by the `view.isItemSelected` method.
    // This `describe` only tests basics scenarios, more complex scenarios are tested in this file's other `describe`.
    describe('aria-selected item attribute', () => {
      describe('single selection', () => {
        it('should not have the attribute `aria-selected=false` if not selected', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
          });

          expect(view.getItemRoot('1')).not.to.have.attribute('aria-selected');
        });

        it('should have the attribute `aria-selected=true` if selected', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: '1',
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'true');
        });
      });

      describe('multi selection', () => {
        it('should have the attribute `aria-selected=false` if not selected', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'false');
        });

        it('should have the attribute `aria-selected=true` if selected', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1'],
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'true');
        });

        it('should have the attribute `aria-selected=false` if disabledSelection is true', () => {
          const view = render({
            multiSelect: true,
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          expect(view.getItemRoot('1')).to.have.attribute('aria-selected', 'false');
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

    describe('selectItem api method', () => {
      describe('single selection', () => {
        it('should select un-selected item when shouldBeSelected is not defined', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
          });

          act(() => {
            view.apiRef.current.selectItem({ itemId: '1', event: {} as any });
          });

          expect(view.isItemSelected('1')).to.equal(true);
        });

        it('should un-select selected item when shouldBeSelected is not defined', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            defaultSelectedItems: ['1'],
          });

          act(() => {
            view.apiRef.current.selectItem({ itemId: '1', event: {} as any });
          });

          expect(view.isItemSelected('1')).to.equal(false);
        });

        it('should not select an item when disableSelection is true', () => {
          const view = render({
            items: [{ id: '1' }, { id: '2' }],
            disableSelection: true,
          });

          act(() => {
            view.apiRef.current.selectItem({ itemId: '1', event: {} as any });
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
            view.apiRef.current.selectItem({ itemId: '1', event: {} as any });
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
            view.apiRef.current.selectItem({ itemId: '1', event: {} as any });
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
            view.apiRef.current.selectItem({
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
            view.apiRef.current.selectItem({ itemId: '1', event });
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
            view.apiRef.current.selectItem({ itemId: '1', event });
          });

          expect(onItemSelectionToggle.callCount).to.equal(1);
          expect(onItemSelectionToggle.lastCall.args[0]).to.equal(event);
          expect(onItemSelectionToggle.lastCall.args[1]).to.equal('1');
          expect(onItemSelectionToggle.lastCall.args[2]).to.equal(false);
        });
      });
    });
  },
);
