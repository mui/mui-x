import { describeTreeView } from 'test/utils/tree-view/describeTreeView';

describeTreeView.only('useTreeViewExpansion plugin', ({ renderNodes }) => {
  it('test', () => {
    renderNodes({
      items: [{ id: '1', label: '1' }],
    });
  });
});
