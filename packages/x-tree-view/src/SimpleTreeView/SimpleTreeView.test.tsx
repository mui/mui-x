import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  act,
  createRenderer,
  ErrorBoundary,
  fireEvent,
  screen,
  describeConformance,
} from '@mui-internal/test-utils';
import Portal from '@mui/material/Portal';
import { SimpleTreeView, simpleTreeViewClasses as classes } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeItem } from '@mui/x-tree-view/SimpleTreeItem';

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
    it('should warn when switching from controlled to uncontrolled of the expanded prop', () => {
      const { setProps } = render(
        <SimpleTreeView expanded={[]}>
          <SimpleTreeItem nodeId="1" label="one" />
        </SimpleTreeView>,
      );

      expect(() => {
        setProps({ expanded: undefined });
      }).toErrorDev(
        'MUI: A component is changing the controlled expanded state of TreeView to be uncontrolled.',
      );
    });

    it('should warn when switching from controlled to uncontrolled of the selected prop', () => {
      const { setProps } = render(
        <SimpleTreeView selected={null}>
          <SimpleTreeItem nodeId="1" label="one" />
        </SimpleTreeView>,
      );

      expect(() => {
        setProps({ selected: undefined });
      }).toErrorDev(
        'MUI: A component is changing the controlled selected state of TreeView to be uncontrolled.',
      );
    });

    it('should not crash when shift clicking a clean tree', () => {
      render(
        <SimpleTreeView multiSelect>
          <SimpleTreeItem nodeId="one" label="one" />
          <SimpleTreeItem nodeId="two" label="two" />
        </SimpleTreeView>,
      );

      fireEvent.click(screen.getByText('one'), { shiftKey: true });
    });

    it('should not crash when selecting multiple items in a deeply nested tree', () => {
      render(
        <SimpleTreeView multiSelect defaultExpanded={['1', '1.1', '2']}>
          <SimpleTreeItem nodeId="1" label="Item 1">
            <SimpleTreeItem nodeId="1.1" label="Item 1.1">
              <SimpleTreeItem nodeId="1.1.1" data-testid="item-1.1.1" label="Item 1.1.1" />
            </SimpleTreeItem>
          </SimpleTreeItem>
          <SimpleTreeItem nodeId="2" data-testid="item-2" label="Item 2" />
        </SimpleTreeView>,
      );
      fireEvent.click(screen.getByText('Item 1.1.1'));
      fireEvent.click(screen.getByText('Item 2'), { shiftKey: true });

      expect(screen.getByTestId('item-1.1.1')).to.have.attribute('aria-selected', 'true');
      expect(screen.getByTestId('item-2')).to.have.attribute('aria-selected', 'true');
    });

    it('should not crash on keydown on an empty tree', () => {
      render(<SimpleTreeView />);

      act(() => {
        screen.getByRole('tree').focus();
      });

      fireEvent.keyDown(screen.getByRole('tree'), { key: ' ' });
    });

    it('should not crash when unmounting with duplicate ids', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function CustomTreeItem(props: any) {
        return <SimpleTreeItem nodeId="iojerogj" />;
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
                <SimpleTreeItem nodeId="a" label="b">
                  <CustomTreeItem nodeId="a" />
                </SimpleTreeItem>
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
    const handleKeyDown = spy();

    const { getByRole } = render(
      <SimpleTreeView onKeyDown={handleKeyDown}>
        <SimpleTreeItem nodeId="test" label="test" data-testid="test" />
      </SimpleTreeView>,
    );
    act(() => {
      getByRole('tree').focus();
    });

    fireEvent.keyDown(getByRole('tree'), { key: 'Enter' });
    fireEvent.keyDown(getByRole('tree'), { key: 'A' });
    fireEvent.keyDown(getByRole('tree'), { key: ']' });

    expect(handleKeyDown.callCount).to.equal(3);
  });

  it('should select node when Enter key is pressed ', () => {
    const handleKeyDown = spy();

    const { getByRole, getByTestId } = render(
      <SimpleTreeView onKeyDown={handleKeyDown}>
        <SimpleTreeItem nodeId="one" label="test" data-testid="one" />
      </SimpleTreeView>,
    );
    act(() => {
      getByRole('tree').focus();
    });

    expect(getByTestId('one')).not.to.have.attribute('aria-selected');

    fireEvent.keyDown(getByRole('tree'), { key: 'Enter' });

    expect(getByTestId('one')).to.have.attribute('aria-selected');
  });

  it('should call onFocus when tree is focused', () => {
    const handleFocus = spy();
    const { getByRole } = render(
      <SimpleTreeView onFocus={handleFocus}>
        <SimpleTreeItem nodeId="test" label="test" data-testid="test" />
      </SimpleTreeView>,
    );

    act(() => {
      getByRole('tree').focus();
    });

    expect(handleFocus.callCount).to.equal(1);
  });

  it('should call onBlur when tree is blurred', () => {
    const handleBlur = spy();
    const { getByRole } = render(
      <SimpleTreeView onBlur={handleBlur}>
        <SimpleTreeItem nodeId="test" label="test" data-testid="test" />
      </SimpleTreeView>,
    );

    act(() => {
      getByRole('tree').focus();
    });
    act(() => {
      getByRole('tree').blur();
    });

    expect(handleBlur.callCount).to.equal(1);
  });

  it('should be able to be controlled with the expanded prop', () => {
    function MyComponent() {
      const [expandedState, setExpandedState] = React.useState([]);
      const handleNodeToggle = (event, nodes) => {
        setExpandedState(nodes);
      };
      return (
        <SimpleTreeView expanded={expandedState} onNodeToggle={handleNodeToggle}>
          <SimpleTreeItem nodeId="1" label="one" data-testid="one">
            <SimpleTreeItem nodeId="2" label="two" />
          </SimpleTreeItem>
        </SimpleTreeView>
      );
    }

    const { getByRole, getByTestId, getByText } = render(<MyComponent />);

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

    fireEvent.click(getByText('one'));
    act(() => {
      getByRole('tree').focus();
    });

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

    fireEvent.click(getByText('one'));

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

    fireEvent.keyDown(getByRole('tree'), { key: '*' });

    expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
  });

  it('should be able to be controlled with the selected prop and singleSelect', () => {
    function MyComponent() {
      const [selectedState, setSelectedState] = React.useState(null);
      const handleNodeSelect = (event, nodes) => {
        setSelectedState(nodes);
      };
      return (
        <SimpleTreeView selected={selectedState} onNodeSelect={handleNodeSelect}>
          <SimpleTreeItem nodeId="1" label="one" data-testid="one" />
          <SimpleTreeItem nodeId="2" label="two" data-testid="two" />
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

  it('should be able to be controlled with the selected prop and multiSelect', () => {
    function MyComponent() {
      const [selectedState, setSelectedState] = React.useState([]);
      const handleNodeSelect = (event, nodes) => {
        setSelectedState(nodes);
      };
      return (
        <SimpleTreeView selected={selectedState} onNodeSelect={handleNodeSelect} multiSelect>
          <SimpleTreeItem nodeId="1" label="one" data-testid="one" />
          <SimpleTreeItem nodeId="2" label="two" data-testid="two" />
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
          onFocus={() => {
            setState(Math.random);
          }}
          id="tree"
        >
          <SimpleTreeItem nodeId="one" label="one" data-testid="one">
            <SimpleTreeItem nodeId="two" label="two" data-testid="two" />
          </SimpleTreeItem>
        </SimpleTreeView>
      );
    }

    const { getByRole, getByText, getByTestId } = render(<MyComponent />);

    fireEvent.click(getByText('one'));
    // Clicks would normally focus tree
    act(() => {
      getByRole('tree').focus();
    });

    expect(getByTestId('one')).toHaveVirtualFocus();

    fireEvent.keyDown(getByRole('tree'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveVirtualFocus();

    fireEvent.keyDown(getByRole('tree'), { key: 'ArrowUp' });

    expect(getByTestId('one')).toHaveVirtualFocus();

    fireEvent.keyDown(getByRole('tree'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveVirtualFocus();
  });

  it('should support conditional rendered tree items', () => {
    function TestComponent() {
      const [hide, setState] = React.useState(false);

      return (
        <React.Fragment>
          <button type="button" onClick={() => setState(true)}>
            Hide
          </button>
          <SimpleTreeView>{!hide && <SimpleTreeItem nodeId="test" label="test" />}</SimpleTreeView>
        </React.Fragment>
      );
    }

    const { getByText, queryByText } = render(<TestComponent />);

    expect(getByText('test')).not.to.equal(null);
    fireEvent.click(getByText('Hide'));
    expect(queryByText('test')).to.equal(null);
  });

  it('should work in a portal', () => {
    const { getByRole, getByTestId } = render(
      <Portal>
        <SimpleTreeView id="tree">
          <SimpleTreeItem nodeId="one" label="one" data-testid="one" />
          <SimpleTreeItem nodeId="two" label="two" data-testid="two" />
          <SimpleTreeItem nodeId="three" label="three" data-testid="three" />
          <SimpleTreeItem nodeId="four" label="four" data-testid="four" />
        </SimpleTreeView>
      </Portal>,
    );

    act(() => {
      getByRole('tree').focus();
    });
    fireEvent.keyDown(getByRole('tree'), { key: 'ArrowDown' });

    expect(getByTestId('two')).toHaveVirtualFocus();

    fireEvent.keyDown(getByRole('tree'), { key: 'ArrowDown' });

    expect(getByTestId('three')).toHaveVirtualFocus();

    fireEvent.keyDown(getByRole('tree'), { key: 'ArrowDown' });

    expect(getByTestId('four')).toHaveVirtualFocus();
  });

  describe('onNodeFocus', () => {
    it('should be called when node is focused', () => {
      const focusSpy = spy();
      const { getByRole } = render(
        <SimpleTreeView onNodeFocus={focusSpy}>
          <SimpleTreeItem nodeId="1" label="one" />
        </SimpleTreeView>,
      );

      // First node receives focus when tree focused
      act(() => {
        getByRole('tree').focus();
      });

      expect(focusSpy.callCount).to.equal(1);
      expect(focusSpy.args[0][1]).to.equal('1');
    });
  });

  describe('onNodeToggle', () => {
    it('should be called when a parent node label is clicked', () => {
      const handleNodeToggle = spy();

      const { getByText } = render(
        <SimpleTreeView onNodeToggle={handleNodeToggle}>
          <SimpleTreeItem nodeId="1" label="outer">
            <SimpleTreeItem nodeId="2" label="inner" />
          </SimpleTreeItem>
        </SimpleTreeView>,
      );

      fireEvent.click(getByText('outer'));

      expect(handleNodeToggle.callCount).to.equal(1);
      expect(handleNodeToggle.args[0][1]).to.deep.equal(['1']);
    });

    it('should be called when a parent node icon is clicked', () => {
      const handleNodeToggle = spy();

      const { getByTestId } = render(
        <SimpleTreeView onNodeToggle={handleNodeToggle}>
          <SimpleTreeItem icon={<div data-testid="icon" />} nodeId="1" label="outer">
            <SimpleTreeItem nodeId="2" label="inner" />
          </SimpleTreeItem>
        </SimpleTreeView>,
      );

      fireEvent.click(getByTestId('icon'));

      expect(handleNodeToggle.callCount).to.equal(1);
      expect(handleNodeToggle.args[0][1]).to.deep.equal(['1']);
    });
  });

  describe('useTreeViewFocus', () => {
    it('should focus the selected item when the tree is focused', () => {
      const onNodeFocus = spy();

      const { getByRole } = render(
        <SimpleTreeView selected={'2'} onNodeFocus={onNodeFocus}>
          <SimpleTreeItem nodeId="1" label="1" />
          <SimpleTreeItem nodeId="2" label="2" />
        </SimpleTreeView>,
      );

      act(() => {
        getByRole('tree').focus();
      });

      expect(onNodeFocus.lastCall.lastArg).to.equal('2');
    });

    it('should focus the selected item when the tree is focused (multi select)', () => {
      const onNodeFocus = spy();

      const { getByRole } = render(
        <SimpleTreeView multiSelect selected={['2']} onNodeFocus={onNodeFocus}>
          <SimpleTreeItem nodeId="1" label="1" />
          <SimpleTreeItem nodeId="2" label="2" />
        </SimpleTreeView>,
      );

      act(() => {
        getByRole('tree').focus();
      });

      expect(onNodeFocus.lastCall.lastArg).to.equal('2');
    });

    it('should focus the first visible selected item when the tree is focused (multi select)', () => {
      const onNodeFocus = spy();

      const { getByRole } = render(
        <SimpleTreeView multiSelect selected={['1.1', '2']} onNodeFocus={onNodeFocus}>
          <SimpleTreeItem nodeId="1" label="1">
            <SimpleTreeItem nodeId="1.1" label="1.1" />
          </SimpleTreeItem>
          <SimpleTreeItem nodeId="2" label="2" />
        </SimpleTreeView>,
      );

      act(() => {
        getByRole('tree').focus();
      });

      expect(onNodeFocus.lastCall.lastArg).to.equal('2');
    });

    it('should focus the first item if the selected item is not visible', () => {
      const onNodeFocus = spy();

      const { getByRole } = render(
        <SimpleTreeView selected="1.1" onNodeFocus={onNodeFocus}>
          <SimpleTreeItem nodeId="1" label="1">
            <SimpleTreeItem nodeId="1.1" label="1.1" />
          </SimpleTreeItem>
          <SimpleTreeItem nodeId="2" label="2" />
        </SimpleTreeView>,
      );

      act(() => {
        getByRole('tree').focus();
      });

      expect(onNodeFocus.lastCall.lastArg).to.equal('1');
    });

    it('should focus the first item if no selected item is visible (multi select)', () => {
      const onNodeFocus = spy();

      const { getByRole } = render(
        <SimpleTreeView multiSelect selected={['1.1']} onNodeFocus={onNodeFocus}>
          <SimpleTreeItem nodeId="1" label="1">
            <SimpleTreeItem nodeId="1.1" label="1.1" />
          </SimpleTreeItem>
          <SimpleTreeItem nodeId="2" label="2" />
        </SimpleTreeView>,
      );

      act(() => {
        getByRole('tree').focus();
      });

      expect(onNodeFocus.lastCall.lastArg).to.equal('1');
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
