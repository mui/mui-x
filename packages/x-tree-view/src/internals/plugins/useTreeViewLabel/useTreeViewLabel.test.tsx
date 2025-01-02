import { expect } from 'chai';
import { act, fireEvent } from '@mui/internal-test-utils';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { UseTreeViewLabelSignature } from '@mui/x-tree-view/internals';
import { describeSkipIf } from 'test/utils/skipIf';

describeTreeView<[UseTreeViewLabelSignature]>(
  'useTreeViewLabel plugin',
  ({ render, treeViewComponentName }) => {
    const isSimpleTreeView = treeViewComponentName.startsWith('SimpleTreeView');

    describeSkipIf(isSimpleTreeView)('interaction', () => {
      describe('render labelInput when needed', () => {
        // This test is not relevant for the TreeItem component or the SimpleTreeView.
        it('should not render labelInput when double clicked if item is not editable', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', editable: false }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));

          expect(view.getItemLabelInput('1')).to.equal(null);
        });

        it('should render labelInput when double clicked if item is editable', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));

          expect(view.getItemLabelInput('1')).not.to.equal(null);
        });

        it('should not render label when double clicked if item is editable', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));

          expect(view.getItemLabel('1')).to.equal(null);
        });

        it('should not render labelInput on Enter if item is not editable', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', editable: false }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });

          expect(view.getItemLabelInput('1')).to.equal(null);
          expect(view.getItemLabel('1')).not.to.equal(null);
        });

        it('should render labelInput on Enter if item is editable', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.keyDown(view.getItemRoot('1'), { key: 'Enter' });

          expect(view.getItemLabelInput('1')).not.to.equal(null);
        });

        it('should unmount labelInput after save', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', label: 'test', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));
          fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Enter' });

          expect(view.getItemLabelInput('1')).to.equal(null);
          expect(view.getItemLabel('1')).not.to.equal(null);
        });

        it('should unmount labelInput after cancel', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', label: 'test', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));
          fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Escape' });

          expect(view.getItemLabelInput('1')).to.equal(null);
          expect(view.getItemLabel('1')).not.to.equal(null);
        });
      });

      describe('labelInput value', () => {
        it('should equal label value on first render', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', label: 'test', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));

          expect(view.getItemLabelInput('1').value).to.equal('test');
        });

        it('should save new value on Enter', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', label: 'test', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));
          fireEvent.change(view.getItemLabelInput('1'), { target: { value: 'new value' } });
          fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Enter' });

          expect(view.getItemLabel('1').textContent).to.equal('new value');
        });

        it('should hold new value on render after save', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', label: 'test', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));
          fireEvent.change(view.getItemLabelInput('1'), { target: { value: 'new value' } });
          fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Enter' });
          fireEvent.doubleClick(view.getItemLabel('1'));

          expect(view.getItemLabelInput('1').value).to.equal('new value');
        });

        it('should hold initial value on render after cancel', () => {
          const view = render({
            experimentalFeatures: { labelEditing: true },
            items: [{ id: '1', label: 'test', editable: true }],
            isItemEditable: (item) => item.editable,
          });
          act(() => {
            view.getItemRoot('1').focus();
          });
          fireEvent.doubleClick(view.getItemLabel('1'));
          fireEvent.change(view.getItemLabelInput('1'), { target: { value: 'new value' } });
          fireEvent.keyDown(view.getItemLabelInput('1'), { key: 'Escape' });
          expect(view.getItemLabel('1').textContent).to.equal('test');

          fireEvent.doubleClick(view.getItemLabel('1'));
          expect(view.getItemLabelInput('1').value).to.equal('test');
        });
      });
    });
    describeSkipIf(isSimpleTreeView)('updateItemLabel api method', () => {
      it('should change the label value', () => {
        const view = render({
          items: [{ id: '1', label: 'test' }],
        });

        act(() => {
          view.apiRef.current.updateItemLabel('1', 'new value');
        });

        expect(view.getItemLabel('1').textContent).to.equal('new value');
      });
    });
  },
);
