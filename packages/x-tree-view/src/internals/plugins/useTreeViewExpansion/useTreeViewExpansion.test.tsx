import { expect } from 'chai';
import { describeTreeView } from 'test/utils/tree-view/describeTreeView';
import { UseTreeViewExpansionSignature } from '@mui/x-tree-view/internals';

describeTreeView<UseTreeViewExpansionSignature>(
  'useTreeViewExpansion plugin',
  ({ renderItems }) => {
    it('test', () => {
      renderItems({
        items: [{ id: '1', label: '1' }],
      });
    });

    it('should warn when switching from controlled to uncontrolled of the expandedNodes prop', () => {
      const { setProps } = renderItems({
        items: [{ id: '1' }],
        expandedNodes: [],
      });

      expect(() => {
        setProps({ expandedNodes: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled expandedNodes state of TreeView to be uncontrolled.',
      );
    });
  },
);
