import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { RichTreeView, richTreeViewClasses as classes } from '@mui/x-tree-view/RichTreeView';
import { describeConformance } from 'test/utils/describeConformance';
import { describe, it, expect } from 'vitest';

describe('<RichTreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<RichTreeView items={[]} />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiRichTreeView',
    skip: ['componentProp', 'themeVariants'],
  }));

  it('should pass the id prop to the root element', () => {
    render(<RichTreeView id="test-id" items={[{ id: '1', label: 'Item 1' }]} />);

    expect(screen.getByRole('tree')).to.have.attribute('id', 'test-id');
  });

  it('should not render an item that is no longer in the items prop', () => {
    const renderedItemIds: string[] = [];

    function TestCase() {
      const [items, setItems] = React.useState([
        { id: '1', label: 'Item 1', children: [{ id: '1.1', label: 'Item 1.1' }] },
      ]);

      return (
        <React.Fragment>
          <button onClick={() => setItems([{ id: '1', label: 'Item 1', children: [] }])}>
            remove
          </button>
          <RichTreeView
            items={items}
            defaultExpandedItems={['1']}
            slotProps={{
              item: (ownerState) => {
                renderedItemIds.push(ownerState.itemId);
                return {};
              },
            }}
          />
        </React.Fragment>
      );
    }

    render(<TestCase />);
    renderedItemIds.length = 0;
    fireEvent.click(screen.getByText('remove'));

    expect(renderedItemIds).not.to.contain('1.1');
  });
});
