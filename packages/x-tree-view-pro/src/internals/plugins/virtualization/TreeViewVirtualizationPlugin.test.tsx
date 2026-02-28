import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { isJSDOM } from 'test/utils/skipIf';
import { RichTreeViewProStore } from '../../RichTreeViewProStore';

describeTreeView<RichTreeViewProStore<any, any>>(
  'TreeViewVirtualizationPlugin',
  ({ render, treeViewComponentName }) => {
    // Virtualization is only available for RichTreeViewPro
    if (treeViewComponentName !== 'RichTreeViewPro') {
      return;
    }

    describe('itemHeight prop', () => {
      it('should default itemHeight to 32px when virtualization is enabled and itemHeight is not provided', () => {
        const view = render({
          items: [{ id: '1' }],
          virtualization: true,
        });

        const itemRoot = view.getItemRoot('1');
        expect(itemRoot.style.getPropertyValue('--TreeView-itemHeight')).to.equal('32px');
      });

      it('should use provided itemHeight when virtualization is enabled', () => {
        const view = render({
          items: [{ id: '1' }],
          virtualization: true,
          itemHeight: 48,
        });

        const itemRoot = view.getItemRoot('1');
        expect(itemRoot.style.getPropertyValue('--TreeView-itemHeight')).to.equal('48px');
      });
    });

    describe('domStructure', () => {
      it('should use flat DOM structure when virtualization is enabled', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }],
          virtualization: true,
          defaultExpandedItems: ['1'],
        });

        // In flat DOM structure, the parent item does not contain the children
        const itemRoot = view.getItemRoot('1');
        const childItemRoot = view.getItemRoot('1.1');

        // Both items should be siblings (same parent)
        expect(itemRoot.parentElement).to.equal(childItemRoot.parentElement);
      });
    });

    // Virtualization requires actual layout calculations which don't work in JSDOM
    describe.skipIf(isJSDOM)('rendering', () => {
      it('should render items with virtualization enabled', () => {
        const view = render({
          items: [{ id: '1' }, { id: '2' }, { id: '3' }],
          virtualization: true,
        });

        expect(view.getAllTreeItemIds()).to.include('1');
        expect(view.getAllTreeItemIds()).to.include('2');
        expect(view.getAllTreeItemIds()).to.include('3');
      });

      it('should render expanded items with virtualization enabled', () => {
        const view = render({
          items: [{ id: '1', children: [{ id: '1.1' }] }, { id: '2' }],
          virtualization: true,
          defaultExpandedItems: ['1'],
        });

        expect(view.getAllTreeItemIds()).to.include('1');
        expect(view.getAllTreeItemIds()).to.include('1.1');
        expect(view.getAllTreeItemIds()).to.include('2');
      });
    });
  },
);
