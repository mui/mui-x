import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { act, createRenderer, ErrorBoundary, fireEvent, screen } from '@mui-internal/test-utils';
import Portal from '@mui/material/Portal';
import { SimpleTreeView, simpleTreeViewClasses as classes } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { describeConformance } from 'test/utils/describeConformance';
import { useTreeViewApiRef } from '../hooks';
import { SimpleTreeViewApiRef } from './SimpleTreeView.types';

describe('<SimpleTreeView />', () => {
  const { render } = createRenderer();

  describeConformance(<SimpleTreeView />, () => ({
    classes,
    inheritComponent: 'ul',
    render,
    refInstanceof: window.HTMLUListElement,
    muiName: 'MuiSimpleTreeView',
    skip: ['componentProp', 'componentsProp', 'themeVariants'],
  }));

  describe('warnings', () => {
    it('should warn when switching from controlled to uncontrolled of the expandedItems prop', () => {
      const { setProps } = render(
        <SimpleTreeView expandedItems={[]}>
          <TreeItem itemId="1" label="one" />
        </SimpleTreeView>,
      );

      expect(() => {
        setProps({ expandedItems: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled expandedItems state of TreeView to be uncontrolled.',
      );
    });

    it('should warn when switching from controlled to uncontrolled of the selectedItems prop', () => {
      const { setProps } = render(
        <SimpleTreeView selectedItems={null}>
          <TreeItem itemId="1" label="one" />
        </SimpleTreeView>,
      );

      expect(() => {
        setProps({ selectedItems: undefined });
      }).toErrorDev(
        'MUI X: A component is changing the controlled selectedItems state of TreeView to be uncontrolled.',
      );
    });

    it('should not crash when shift clicking a clean tree', () => {
      render(
        <SimpleTreeView multiSelect>
          <TreeItem itemId="one" label="one" />
          <TreeItem itemId="two" label="two" />
        </SimpleTreeView>,
      );

      fireEvent.click(screen.getByText('one'), { shiftKey: true });
    });

    it('should not crash when selecting multiple items in a deeply nested tree', () => {
      render(
        <SimpleTreeView multiSelect defaultExpandedItems={['1', '1.1', '2']}>
          <TreeItem itemId="1" label="Item 1">
            <TreeItem itemId="1.1" label="Item 1.1">
              <TreeItem itemId="1.1.1" data-testid="item-1.1.1" label="Item 1.1.1" />
            </TreeItem>
          </TreeItem>
          <TreeItem itemId="2" data-testid="item-2" label="Item 2" />
        </SimpleTreeView>,
      );
      fireEvent.click(screen.getByText('Item 1.1.1'));
      fireEvent.click(screen.getByText('Item 2'), { shiftKey: true });

      expect(screen.getByTestId('item-1.1.1')).to.have.attribute('aria-selected', 'true');
      expect(screen.getByTestId('item-2')).to.have.attribute('aria-selected', 'true');
    });

    it('should not crash when unmounting with duplicate ids', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function CustomTreeItem(props: any) {
        return <TreeItem itemId="iojerogj" />;
      }
      function App() {
        const [isVisible, hideTreeView] = React.useReducer(() => false, true);

        return (
          <React.Fragment>
            <button onClick={hideTreeView} type="button">
              Toggle
            </button>
            {isVisible && (
              <SimpleTreeView>
                <TreeItem itemId="a" label="b">
                  <CustomTreeItem itemId="a" />
                </TreeItem>
              </SimpleTreeView>
            )}
          </React.Fragment>
        );
      }
      const errorRef = React.createRef<ErrorBoundary>();
      render(
        <ErrorBoundary ref={errorRef}>
          <App />
        </ErrorBoundary>,
      );

      expect(() => {
        act(() => {
          screen.getByRole('button').click();
        });
      }).not.toErrorDev();
    });
  });

  it('should call onKeyDown when a key is pressed', () => {
    const handleTreeViewKeyDown = spy();
    const handleTreeItemKeyDown = spy();

    const { getByTestId } = render(
      <SimpleTreeView onKeyDown={handleTreeViewKeyDown}>
        <TreeItem itemId="one" data-testid="one" onKeyDown={handleTreeItemKeyDown} />
      </SimpleTreeView>,
    );

    const itemOne = getByTestId('one');
    act(() => {
      itemOne.focus();
    });

    fireEvent.keyDown(itemOne, { key: 'Enter' });
    fireEvent.keyDown(itemOne, { key: 'A' });
    fireEvent.keyDown(itemOne, { key: ']' });

    expect(handleTreeViewKeyDown.callCount).to.equal(3);
    expect(handleTreeItemKeyDown.callCount).to.equal(3);
  });

  it('should select item when Enter key is pressed ', () => {
    const handleKeyDown = spy();

    const { getByTestId } = render(
      <SimpleTreeView onKeyDown={handleKeyDown}>
        <TreeItem itemId="one" data-testid="one" />
      </SimpleTreeView>,
    );
    act(() => {
      getByTestId('one').focus();
    });

    expect(getByTestId('one')).not.to.have.attribute('aria-selected');

    fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });

    expect(getByTestId('one')).to.have.attribute('aria-selected');
  });

  it('should be able to be controlled with the expandedItems prop', () => {
    function MyComponent() {
      const [expandedState, setExpandedState] = React.useState([]);
      const onExpandedItemsChange = (event, items) => {
        setExpandedState(items);
      };
      return (
        <SimpleTreeView expandedItems={expandedState} onExpandedItemsChange={onExpandedItemsChange}>
          <TreeItem itemId="one" label="one" data-testid="one">
            <TreeItem itemId="two" />
          </TreeItem>
        </SimpleTreeView>
      );
    }

    const { getByTestId, getByText } = render(<MyComponent />);

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

    fireEvent.click(getByText('one'));
    act(() => {
      getByTestId('one').focus();
    });

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

    fireEvent.click(getByText('one'));

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

    fireEvent.keyDown(getByTestId('one'), { key: '*' });

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
  });

  it('should be able to be controlled with the selectedItems prop and singleSelect', () => {
    function MyComponent() {
      const [selectedState, setSelectedState] = React.useState(null);
      const onSelectedItemsChange = (event, items) => {
        setSelectedState(items);
      };
      return (
        <SimpleTreeView selectedItems={selectedState} onSelectedItemsChange={onSelectedItemsChange}>
          <TreeItem itemId="1" label="one" data-testid="one" />
          <TreeItem itemId="2" label="two" data-testid="two" />
        </SimpleTreeView>
      );
    }

    const { getByTestId, getByText } = render(<MyComponent />);

    expect(getByTestId('one')).not.to.have.attribute('aria-selected');
    expect(getByTestId('two')).not.to.have.attribute('aria-selected');

    fireEvent.click(getByText('one'));

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
    expect(getByTestId('two')).not.to.have.attribute('aria-selected');

    fireEvent.click(getByText('two'));

    expect(getByTestId('one')).not.to.have.attribute('aria-selected');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
  });

  it('should be able to be controlled with the selectedItems prop and multiSelect', () => {
    function MyComponent() {
      const [selectedState, setSelectedState] = React.useState([]);
      const onSelectedItemsChange = (event, items) => {
        setSelectedState(items);
      };
      return (
        <SimpleTreeView
          selectedItems={selectedState}
          onSelectedItemsChange={onSelectedItemsChange}
          multiSelect
        >
          <TreeItem itemId="1" label="one" data-testid="one" />
          <TreeItem itemId="2" label="two" data-testid="two" />
        </SimpleTreeView>
      );
    }

    const { getByTestId, getByText } = render(<MyComponent />);

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

    fireEvent.click(getByText('one'));

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

    fireEvent.click(getByText('two'), { ctrlKey: true });

    expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
    expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
  });

  it('should not error when component state changes', () => {
    function MyComponent() {
      const [, setState] = React.useState(1);

      return (
        <SimpleTreeView
          defaultExpandedItems={['one']}
          onItemFocus={() => {
            setState(Math.random);
          }}
        >
          <TreeItem itemId="one" data-testid="one">
            <TreeItem itemId="two" data-testid="two" />
          </TreeItem>
        </SimpleTreeView>
      );
    }

    const { getByTestId } = render(<MyComponent />);

    fireEvent.focus(getByTestId('one'));
    fireEvent.focus(getByTestId('one'));
    expect(getByTestId('one')).toHaveFocus();

    fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveFocus();

    fireEvent.keyDown(getByTestId('two'), { key: 'ArrowUp' });

    expect(getByTestId('one')).toHaveFocus();

    fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveFocus();
  });

  it('should support conditional rendered tree items', () => {
    function TestComponent() {
      const [hide, setState] = React.useState(false);

      return (
        <React.Fragment>
          <button type="button" onClick={() => setState(true)}>
            Hide
          </button>
          <SimpleTreeView>{!hide && <TreeItem itemId="test" label="test" />}</SimpleTreeView>
        </React.Fragment>
      );
    }

    const { getByText, queryByText } = render(<TestComponent />);

    expect(getByText('test')).not.to.equal(null);
    fireEvent.click(getByText('Hide'));
    expect(queryByText('test')).to.equal(null);
  });

  it('should work in a portal', () => {
    const { getByTestId } = render(
      <Portal>
        <SimpleTreeView>
          <TreeItem itemId="one" data-testid="one" />
          <TreeItem itemId="two" data-testid="two" />
          <TreeItem itemId="three" data-testid="three" />
          <TreeItem itemId="four" data-testid="four" />
        </SimpleTreeView>
      </Portal>,
    );

    act(() => {
      getByTestId('one').focus();
    });
    fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveFocus();

    fireEvent.keyDown(getByTestId('two'), { key: 'ArrowDown' });

    expect(getByTestId('three')).toHaveFocus();

    fireEvent.keyDown(getByTestId('three'), { key: 'ArrowDown' });

    expect(getByTestId('four')).toHaveFocus();
  });

  describe('onItemFocus', () => {
    it('should be called when an item is focused', () => {
      const onFocus = spy();
      const { getByTestId } = render(
        <SimpleTreeView onItemFocus={onFocus}>
          <TreeItem itemId="one" data-testid="one" />
        </SimpleTreeView>,
      );

      act(() => {
        getByTestId('one').focus();
      });

      expect(onFocus.callCount).to.equal(1);
      expect(onFocus.args[0][1]).to.equal('one');
    });
  });

  describe('onExpandedItemsChange', () => {
    it('should be called when a parent item label is clicked', () => {
      const onExpandedItemsChange = spy();

      const { getByText } = render(
        <SimpleTreeView onExpandedItemsChange={onExpandedItemsChange}>
          <TreeItem itemId="1" label="outer">
            <TreeItem itemId="2" label="inner" />
          </TreeItem>
        </SimpleTreeView>,
      );

      fireEvent.click(getByText('outer'));

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.args[0][1]).to.deep.equal(['1']);
    });

    it('should be called when a parent item icon is clicked', () => {
      const onExpandedItemsChange = spy();

      const { getByTestId } = render(
        <SimpleTreeView onExpandedItemsChange={onExpandedItemsChange}>
          <TreeItem slots={{ icon: () => <div data-testid="icon" /> }} itemId="1" label="outer">
            <TreeItem itemId="2" label="inner" />
          </TreeItem>
        </SimpleTreeView>,
      );

      fireEvent.click(getByTestId('icon'));

      expect(onExpandedItemsChange.callCount).to.equal(1);
      expect(onExpandedItemsChange.args[0][1]).to.deep.equal(['1']);
    });
  });

  describe('useTreeViewFocus', () => {
    it('should set tabIndex={0} on the selected item', () => {
      const { getByTestId } = render(
        <SimpleTreeView selectedItems="one">
          <TreeItem itemId="one" data-testid="one" />
          <TreeItem itemId="two" data-testid="two" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('two').tabIndex).to.equal(-1);
    });

    it('should set tabIndex={0} on the selected item (multi select)', () => {
      const { getByTestId } = render(
        <SimpleTreeView multiSelect selectedItems={['one']}>
          <TreeItem itemId="one" data-testid="one" />
          <TreeItem itemId="two" data-testid="two" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('two').tabIndex).to.equal(-1);
    });

    it('should set tabIndex={0} on the first visible selected item (multi select)', () => {
      const { getByTestId } = render(
        <SimpleTreeView multiSelect selectedItems={['two', 'three']}>
          <TreeItem itemId="one" data-testid="one">
            <TreeItem itemId="two" data-testid="two" />
          </TreeItem>
          <TreeItem itemId="three" data-testid="three" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(-1);
      expect(getByTestId('three').tabIndex).to.equal(0);
    });

    it('should set tabIndex={0} on the first item if the selected item is not visible', () => {
      const { getByTestId } = render(
        <SimpleTreeView selectedItems="two">
          <TreeItem itemId="one" data-testid="one">
            <TreeItem itemId="two" data-testid="two" />
          </TreeItem>
          <TreeItem itemId="three" data-testid="three" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('three').tabIndex).to.equal(-1);
    });

    it('should set tabIndex={0} on the first item if no selected item is visible (multi select)', () => {
      const { getByTestId } = render(
        <SimpleTreeView multiSelect selectedItems={['two']}>
          <TreeItem itemId="one" data-testid="one">
            <TreeItem itemId="two" data-testid="two" />
          </TreeItem>
          <TreeItem itemId="three" data-testid="three" />
        </SimpleTreeView>,
      );

      expect(getByTestId('one').tabIndex).to.equal(0);
      expect(getByTestId('three').tabIndex).to.equal(-1);
    });

    it('should focus specific item using `apiRef`', () => {
      let apiRef: SimpleTreeViewApiRef;
      const onItemFocus = spy();

      function TestCase() {
        apiRef = useTreeViewApiRef();
        return (
          <SimpleTreeView apiRef={apiRef} onItemFocus={onItemFocus}>
            <TreeItem itemId="one" data-testid="one">
              <TreeItem itemId="two" data-testid="two" />
            </TreeItem>
            <TreeItem itemId="three" data-testid="three" />
          </SimpleTreeView>
        );
      }

      const { getByTestId } = render(<TestCase />);

      act(() => {
        apiRef.current?.focusItem({} as React.SyntheticEvent, 'three');
      });

      expect(getByTestId('three')).toHaveFocus();
      expect(onItemFocus.lastCall.lastArg).to.equal('three');
    });

    it('should not focus item if parent is collapsed', () => {
      let apiRef: SimpleTreeViewApiRef;
      const onItemFocus = spy();

      function TestCase() {
        apiRef = useTreeViewApiRef();
        return (
          <SimpleTreeView apiRef={apiRef} onItemFocus={onItemFocus}>
            <TreeItem itemId="1" label="1">
              <TreeItem itemId="1.1" label="1.1" />
            </TreeItem>
            <TreeItem itemId="2" label="2" />
          </SimpleTreeView>
        );
      }

      const { getByRole } = render(<TestCase />);

      act(() => {
        apiRef.current?.focusItem({} as React.SyntheticEvent, '1.1');
      });

      expect(getByRole('tree')).not.toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('(TreeView) should have the role `tree`', () => {
      const { getByRole } = render(<SimpleTreeView />);

      expect(getByRole('tree')).not.to.equal(null);
    });

    it('(TreeView) should have the attribute `aria-multiselectable=false if using single select`', () => {
      const { getByRole } = render(<SimpleTreeView />);

      expect(getByRole('tree')).to.have.attribute('aria-multiselectable', 'false');
    });

    it('(TreeView) should have the attribute `aria-multiselectable=true if using multi select`', () => {
      const { getByRole } = render(<SimpleTreeView multiSelect />);

      expect(getByRole('tree')).to.have.attribute('aria-multiselectable', 'true');
    });
  });
});
