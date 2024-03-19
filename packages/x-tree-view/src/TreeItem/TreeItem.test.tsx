import * as React from 'react';
import { expect } from 'chai';
import PropTypes from 'prop-types';
import { spy } from 'sinon';
import { act, createEvent, createRenderer, fireEvent } from '@mui-internal/test-utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { SimpleTreeViewPlugins } from '@mui/x-tree-view/SimpleTreeView/SimpleTreeView.plugins';
import { TreeItem, treeItemClasses as classes } from '@mui/x-tree-view/TreeItem';
import { TreeViewContextValue } from '@mui/x-tree-view/internals/TreeViewProvider';
import { TreeViewContext } from '@mui/x-tree-view/internals/TreeViewProvider/TreeViewContext';
import { describeConformance } from 'test/utils/describeConformance';

const TEST_TREE_VIEW_CONTEXT_VALUE: TreeViewContextValue<SimpleTreeViewPlugins> = {
  instance: {
    isNodeExpandable: () => false,
    isNodeExpanded: () => false,
    isNodeFocused: () => false,
    isNodeSelected: () => false,
    isNodeDisabled: (itemId: string | null): itemId is string => !!itemId,
    getTreeItemId: () => '',
    mapFirstCharFromJSX: () => () => {},
    canItemBeTabbed: () => false,
  } as any,
  publicAPI: {
    focusItem: () => {},
    getItem: () => ({}),
  },
  runItemPlugins: () => ({ rootRef: null, contentRef: null }),
  wrapItem: ({ children }) => children,
  disabledItemsFocusable: false,
  icons: {
    slots: {},
    slotProps: {},
  },
  selection: {
    multiSelect: false,
  },
};

describe('<TreeItem />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeItem itemId="one" label="one" />, () => ({
    classes,
    inheritComponent: 'li',
    wrapMount: (mount) => (node: React.ReactNode) => {
      const wrapper = mount(
        <TreeViewContext.Provider value={TEST_TREE_VIEW_CONTEXT_VALUE}>
          {node}
        </TreeViewContext.Provider>,
      );
      return wrapper.childAt(0);
    },
    render: (node) => {
      return render(
        <TreeViewContext.Provider value={TEST_TREE_VIEW_CONTEXT_VALUE}>
          {node}
        </TreeViewContext.Provider>,
      );
    },
    muiName: 'MuiTreeItem',
    refInstanceof: window.HTMLLIElement,
    skip: ['reactTestRenderer', 'componentProp', 'componentsProp', 'themeVariants'],
  }));

  describe('warnings', () => {
    beforeEach(() => {
      PropTypes.resetWarningCache();
    });

    it('should warn if an onFocus callback is supplied', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          TreeItem.propTypes,
          { itemId: 'one', onFocus: () => {} },
          'prop',
          'TreeItem',
        );
      }).toErrorDev('Failed prop type: The prop `onFocus` is not supported.');
    });

    it('should warn if an `ContentComponent` that does not hold a ref is used', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          TreeItem.propTypes,
          { itemId: 'one', ContentComponent: () => {} },
          'prop',
          'TreeItem',
        );
      }).toErrorDev('Expected an element type that can hold a ref.');
    });
  });

  it('should call onClick when clicked', () => {
    const handleClick = spy();

    const { getByText } = render(
      <SimpleTreeView>
        <TreeItem itemId="test" label="test" onClick={handleClick} />
      </SimpleTreeView>,
    );

    fireEvent.click(getByText('test'));

    expect(handleClick.callCount).to.equal(1);
  });

  it('should display the right icons', () => {
    const { getByTestId } = render(
      <SimpleTreeView
        slots={{
          expandIcon: () => <div data-test="defaultExpandIcon" />,
          collapseIcon: () => <div data-test="defaultCollapseIcon" />,
          endIcon: () => <div data-test="defaultEndIcon" />,
        }}
        defaultExpandedItems={['1']}
      >
        <TreeItem itemId="1" label="1" data-testid="1">
          <TreeItem itemId="2" label="2" data-testid="2" />
          <TreeItem
            itemId="5"
            label="5"
            data-testid="5"
            slots={{ icon: () => <div data-test="icon" /> }}
          />
          <TreeItem
            itemId="6"
            label="6"
            data-testid="6"
            slots={{ endIcon: () => <div data-test="endIcon" /> }}
          />
        </TreeItem>
        <TreeItem itemId="3" label="3" data-testid="3">
          <TreeItem itemId="4" label="4" data-testid="4" />
        </TreeItem>
      </SimpleTreeView>,
    );

    const getIcon = (testId) => getByTestId(testId).querySelector(`.${classes.iconContainer} div`);

    expect(getIcon('1')).attribute('data-test').to.equal('defaultCollapseIcon');
    expect(getIcon('2')).attribute('data-test').to.equal('defaultEndIcon');
    expect(getIcon('3')).attribute('data-test').to.equal('defaultExpandIcon');
    expect(getIcon('5')).attribute('data-test').to.equal('icon');
    expect(getIcon('6')).attribute('data-test').to.equal('endIcon');
  });

  it('should allow conditional child', () => {
    function TestComponent() {
      const [hide, setState] = React.useState(false);

      return (
        <React.Fragment>
          <button data-testid="button" type="button" onClick={() => setState(true)}>
            Hide
          </button>
          <SimpleTreeView defaultExpandedItems={['1']}>
            <TreeItem itemId="1" data-testid="1">
              {!hide && <TreeItem itemId="2" data-testid="2" />}
            </TreeItem>
          </SimpleTreeView>
        </React.Fragment>
      );
    }
    const { getByTestId, queryByTestId } = render(<TestComponent />);

    expect(getByTestId('1')).to.have.attribute('aria-expanded', 'true');
    expect(getByTestId('2')).not.to.equal(null);
    fireEvent.click(getByTestId('button'));
    expect(getByTestId('1')).not.to.have.attribute('aria-expanded');
    expect(queryByTestId('2')).to.equal(null);
  });

  it('should treat an empty array equally to no children', () => {
    const { getByTestId } = render(
      <SimpleTreeView defaultExpandedItems={['1']}>
        <TreeItem itemId="1" label="1" data-testid="1">
          <TreeItem itemId="2" label="2" data-testid="2">
            {[]}
          </TreeItem>
        </TreeItem>
      </SimpleTreeView>,
    );

    expect(getByTestId('2')).not.to.have.attribute('aria-expanded');
  });

  it('should treat multiple empty conditional arrays as empty', () => {
    const { getByTestId } = render(
      <SimpleTreeView defaultExpandedItems={['1']}>
        <TreeItem itemId="1" label="1" data-testid="1">
          <TreeItem itemId="2" label="2" data-testid="2">
            {[].map((_, index) => (
              <React.Fragment key={index}>a child</React.Fragment>
            ))}
            {[].map((_, index) => (
              <React.Fragment key={index}>a child</React.Fragment>
            ))}
          </TreeItem>
        </TreeItem>
      </SimpleTreeView>,
    );

    expect(getByTestId('2')).not.to.have.attribute('aria-expanded');
  });

  it('should treat one conditional empty and one conditional with results as expandable', () => {
    const { getByTestId } = render(
      <SimpleTreeView defaultExpandedItems={['1', '2']}>
        <TreeItem itemId="1" label="1" data-testid="1">
          <TreeItem itemId="2" label="2" data-testid="2">
            {[]}
            {[1].map((_, index) => (
              <React.Fragment key={index}>a child</React.Fragment>
            ))}
          </TreeItem>
        </TreeItem>
      </SimpleTreeView>,
    );

    expect(getByTestId('2')).to.have.attribute('aria-expanded', 'true');
  });

  it('should handle edge case of nested array of array', () => {
    const { getByTestId } = render(
      <SimpleTreeView defaultExpandedItems={['1', '2']}>
        <TreeItem itemId="1" label="1" data-testid="1">
          <TreeItem itemId="2" label="2" data-testid="2">
            {[[]]}
          </TreeItem>
        </TreeItem>
      </SimpleTreeView>,
    );

    expect(getByTestId('2')).not.to.have.attribute('aria-expanded');
  });

  it('should not call onClick when children are clicked', () => {
    const handleClick = spy();

    const { getByText } = render(
      <SimpleTreeView defaultExpandedItems={['one']}>
        <TreeItem itemId="one" label="one" onClick={handleClick}>
          <TreeItem itemId="two" label="two" />
        </TreeItem>
      </SimpleTreeView>,
    );

    fireEvent.click(getByText('two'));

    expect(handleClick.callCount).to.equal(0);
  });

  it('should be able to use a custom id', () => {
    const { getByRole, getByTestId } = render(
      <SimpleTreeView>
        <TreeItem id="customId" itemId="one" data-testid="one" />
      </SimpleTreeView>,
    );

    act(() => {
      getByTestId('one').focus();
    });

    expect(getByRole('tree')).to.have.attribute('aria-activedescendant', 'customId');
  });

  describe('Accessibility', () => {
    it('should have the role `treeitem`', () => {
      const { getByTestId } = render(
        <SimpleTreeView>
          <TreeItem itemId="test" label="test" data-testid="test" />
        </SimpleTreeView>,
      );

      expect(getByTestId('test')).to.have.attribute('role', 'treeitem');
    });

    it('should add the role `group` to a component containing children', () => {
      const { getByRole, getByText } = render(
        <SimpleTreeView defaultExpandedItems={['test']}>
          <TreeItem itemId="test" label="test">
            <TreeItem itemId="test2" label="test2" />
          </TreeItem>
        </SimpleTreeView>,
      );

      expect(getByRole('group')).to.contain(getByText('test2'));
    });

    describe('aria-expanded', () => {
      it('should have the attribute `aria-expanded=false` if collapsed', () => {
        const { getByTestId } = render(
          <SimpleTreeView>
            <TreeItem itemId="test" label="test" data-testid="test">
              <TreeItem itemId="test2" label="test2" />
            </TreeItem>
          </SimpleTreeView>,
        );

        expect(getByTestId('test')).to.have.attribute('aria-expanded', 'false');
      });

      it('should have the attribute `aria-expanded={true}` if expanded', () => {
        const { getByTestId } = render(
          <SimpleTreeView defaultExpandedItems={['test']}>
            <TreeItem itemId="test" label="test" data-testid="test">
              <TreeItem itemId="test2" label="test2" />
            </TreeItem>
          </SimpleTreeView>,
        );

        expect(getByTestId('test')).to.have.attribute('aria-expanded', 'true');
      });

      it('should not have the attribute `aria-expanded` if no children are present', () => {
        const { getByTestId } = render(
          <SimpleTreeView>
            <TreeItem itemId="test" label="test" data-testid="test" />
          </SimpleTreeView>,
        );

        expect(getByTestId('test')).not.to.have.attribute('aria-expanded');
      });
    });

    describe('aria-disabled', () => {
      it('should not have the attribute `aria-disabled` if disabled is false', () => {
        const { getByTestId } = render(
          <SimpleTreeView>
            <TreeItem itemId="one" label="one" data-testid="one" />
          </SimpleTreeView>,
        );

        expect(getByTestId('one')).not.to.have.attribute('aria-disabled');
      });

      it('should have the attribute `aria-disabled={true}` if disabled', () => {
        const { getByTestId } = render(
          <SimpleTreeView>
            <TreeItem itemId="one" label="one" disabled data-testid="one" />
          </SimpleTreeView>,
        );

        expect(getByTestId('one')).to.have.attribute('aria-disabled', 'true');
      });
    });

    describe('aria-selected', () => {
      describe('single-select', () => {
        it('should not have the attribute `aria-selected` if not selected', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="test" label="test" data-testid="test" />
            </SimpleTreeView>,
          );

          expect(getByTestId('test')).not.to.have.attribute('aria-selected');
        });

        it('should have the attribute `aria-selected={true}` if selected', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultSelectedItems={'test'}>
              <TreeItem itemId="test" label="test" data-testid="test" />
            </SimpleTreeView>,
          );

          expect(getByTestId('test')).to.have.attribute('aria-selected', 'true');
        });
      });

      describe('multi-select', () => {
        it('should have the attribute `aria-selected=false` if not selected', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="test" label="test" data-testid="test" />
            </SimpleTreeView>,
          );

          expect(getByTestId('test')).to.have.attribute('aria-selected', 'false');
        });

        it('should have the attribute `aria-selected={true}` if selected', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect defaultSelectedItems={['test']}>
              <TreeItem itemId="test" label="test" data-testid="test" />
            </SimpleTreeView>,
          );

          expect(getByTestId('test')).to.have.attribute('aria-selected', 'true');
        });

        it('should have the attribute `aria-selected` if disableSelection is true', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect disableSelection>
              <TreeItem itemId="test" label="test" data-testid="test" />
            </SimpleTreeView>,
          );

          expect(getByTestId('test')).to.have.attribute('aria-selected', 'false');
        });
      });
    });

    describe('when an item receives focus', () => {
      it('should focus the first node if none of the nodes are selected before the tree receives focus', () => {
        const { getByTestId, queryAllByRole } = render(
          <SimpleTreeView>
            <TreeItem itemId="1" label="one" data-testid="one" />
            <TreeItem itemId="2" label="two" />
            <TreeItem itemId="3" label="three" />
          </SimpleTreeView>,
        );

        expect(queryAllByRole('treeitem', { selected: true })).to.have.length(0);

        act(() => {
          getByTestId('one').focus();
        });

        expect(getByTestId('one')).toHaveFocus();
      });

      it('should work with programmatic focus', () => {
        const { getByTestId } = render(
          <SimpleTreeView>
            <TreeItem itemId="one" data-testid="one" />
            <TreeItem itemId="two" data-testid="two" />
          </SimpleTreeView>,
        );

        act(() => {
          getByTestId('one').focus();
        });

        expect(getByTestId('one')).toHaveFocus();

        act(() => {
          getByTestId('two').focus();
        });
        expect(getByTestId('two')).toHaveFocus();
      });

      it('should work when focused node is removed', () => {
        let removeActiveItem;
        // a TreeItem which can remove from the tree by calling `removeActiveItem`
        function ControlledTreeItem(props) {
          const [mounted, setMounted] = React.useReducer(() => false, true);
          removeActiveItem = setMounted;

          if (!mounted) {
            return null;
          }
          return <TreeItem {...props} />;
        }

        const { getByTestId } = render(
          <SimpleTreeView defaultExpandedItems={['one']}>
            <TreeItem itemId="one" data-testid="one">
              <TreeItem itemId="two" data-testid="two" />
              <ControlledTreeItem itemId="three" data-testid="three" />
            </TreeItem>
          </SimpleTreeView>,
        );

        act(() => {
          getByTestId('three').focus();
        });
        expect(getByTestId('three')).toHaveFocus();

        // generic action that removes an item.
        // Could be promise based, or timeout, or another user interaction
        act(() => {
          removeActiveItem();
        });

        expect(getByTestId('one')).toHaveFocus();
      });
    });

    describe('Navigation', () => {
      describe('right arrow interaction', () => {
        it('should open the node and not move the focus if focus is on a closed node', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowRight' });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
          expect(getByTestId('one')).toHaveFocus();
        });

        it('should move focus to the first child if focus is on an open node', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowRight' });

          expect(getByTestId('two')).toHaveFocus();
        });

        it('should do nothing if focus is on an end item', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('two').focus();
          });

          expect(getByTestId('two')).toHaveFocus();
          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowRight' });

          expect(getByTestId('two')).toHaveFocus();
        });
      });

      describe('left arrow interaction', () => {
        it('should close the item if focus is on an open item', () => {
          const { getByTestId, getByText } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowLeft' });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');
          expect(getByTestId('one')).toHaveFocus();
        });

        it("should move focus to the item's parent item if focus is on a child node that is an end item", () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          act(() => {
            getByTestId('two').focus();
          });

          expect(getByTestId('two')).toHaveFocus();
          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowLeft' });

          expect(getByTestId('one')).toHaveFocus();
          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
        });

        it("should move focus to the node's parent node if focus is on a child node that is closed", () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two">
                  <TreeItem itemId="three" label="three" />
                </TreeItem>
              </TreeItem>
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          act(() => {
            getByTestId('two').focus();
          });

          expect(getByTestId('two')).toHaveFocus();

          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowLeft' });

          expect(getByTestId('one')).toHaveFocus();
          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
        });

        it('should do nothing if focus is on a root node that is closed', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowLeft' });
          expect(getByTestId('one')).toHaveFocus();
        });

        it('should do nothing if focus is on a root node that is an end node', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowLeft' });

          expect(getByTestId('one')).toHaveFocus();
        });
      });

      describe('down arrow interaction', () => {
        it('moves focus to a sibling node', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

          expect(getByTestId('two')).toHaveFocus();
        });

        it('moves focus to a child item', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

          expect(getByTestId('two')).toHaveFocus();
        });

        it('moves focus to a child item works with a dynamic tree', () => {
          function TestComponent() {
            const [hide, setState] = React.useState(false);

            return (
              <React.Fragment>
                <button
                  data-testid="button"
                  type="button"
                  onClick={() => setState((value) => !value)}
                >
                  Toggle Hide
                </button>
                <SimpleTreeView defaultExpandedItems={['one']}>
                  {!hide && (
                    <TreeItem itemId="one" label="one" data-testid="one">
                      <TreeItem itemId="two" label="two" data-testid="two" />
                    </TreeItem>
                  )}
                  <TreeItem itemId="three" label="three" />
                </SimpleTreeView>
              </React.Fragment>
            );
          }

          const { queryByTestId, getByTestId, getByText } = render(<TestComponent />);

          expect(getByTestId('one')).not.to.equal(null);
          fireEvent.click(getByText('Toggle Hide'));
          expect(queryByTestId('one')).to.equal(null);
          fireEvent.click(getByText('Toggle Hide'));
          expect(getByTestId('one')).not.to.equal(null);

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });

          expect(getByTestId('two')).toHaveFocus();
        });

        it("moves focus to a parent's sibling", () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
              <TreeItem itemId="three" label="three" data-testid="three" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          act(() => {
            getByTestId('two').focus();
          });

          expect(getByTestId('two')).toHaveFocus();

          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowDown' });

          expect(getByTestId('three')).toHaveFocus();
        });
      });

      describe('up arrow interaction', () => {
        it('moves focus to a sibling node', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('two').focus();
          });

          expect(getByTestId('two')).toHaveFocus();

          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowUp' });

          expect(getByTestId('one')).toHaveFocus();
        });

        it('moves focus to a parent', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          act(() => {
            getByTestId('two').focus();
          });

          expect(getByTestId('two')).toHaveFocus();

          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowUp' });

          expect(getByTestId('one')).toHaveFocus();
        });

        it("moves focus to a sibling's child", () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
              <TreeItem itemId="three" label="three" data-testid="three" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          act(() => {
            getByTestId('three').focus();
          });

          expect(getByTestId('three')).toHaveFocus();

          fireEvent.keyDown(getByTestId('three'), { key: 'ArrowUp' });

          expect(getByTestId('two')).toHaveFocus();
        });
      });

      describe('home key interaction', () => {
        it('moves focus to the first node in the tree', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('four').focus();
          });

          expect(getByTestId('four')).toHaveFocus();

          fireEvent.keyDown(getByTestId('four'), { key: 'Home' });

          expect(getByTestId('one')).toHaveFocus();
        });
      });

      describe('end key interaction', () => {
        it('moves focus to the last node in the tree without expanded items', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 'End' });

          expect(getByTestId('four')).toHaveFocus();
        });

        it('moves focus to the last node in the tree with expanded items', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['four', 'five']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four">
                <TreeItem itemId="five" label="five" data-testid="five">
                  <TreeItem itemId="six" label="six" data-testid="six" />
                </TreeItem>
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 'End' });

          expect(getByTestId('six')).toHaveFocus();
        });
      });

      describe('type-ahead functionality', () => {
        it('moves focus to the next node with a name that starts with the typed character', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label={<span>two</span>} data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 't' });

          expect(getByTestId('two')).toHaveFocus();

          fireEvent.keyDown(getByTestId('two'), { key: 'f' });

          expect(getByTestId('four')).toHaveFocus();

          fireEvent.keyDown(getByTestId('four'), { key: 'o' });

          expect(getByTestId('one')).toHaveFocus();
        });

        it('moves focus to the next node with the same starting character', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 't' });

          expect(getByTestId('two')).toHaveFocus();

          fireEvent.keyDown(getByTestId('two'), { key: 't' });

          expect(getByTestId('three')).toHaveFocus();

          fireEvent.keyDown(getByTestId('three'), { key: 't' });

          expect(getByTestId('two')).toHaveFocus();
        });

        it('should not move focus when pressing a modifier key + letter', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" data-testid="one" />
              <TreeItem itemId="two" data-testid="two" />
              <TreeItem itemId="three" data-testid="three" />
              <TreeItem itemId="four" data-testid="four" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 'f', ctrlKey: true });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 'f', metaKey: true });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 'f', shiftKey: true });

          expect(getByTestId('one')).toHaveFocus();
        });

        it('should not throw when an item is removed', () => {
          function TestComponent() {
            const [hide, setState] = React.useState(false);
            return (
              <React.Fragment>
                <button type="button" onClick={() => setState(true)}>
                  Hide
                </button>
                <SimpleTreeView>
                  {!hide && <TreeItem itemId="hide" label="ab" />}
                  <TreeItem itemId="keyDown" label="keyDown" data-testid="keyDown" />
                  <TreeItem itemId="navTo" label="ac" data-testid="navTo" />
                </SimpleTreeView>
              </React.Fragment>
            );
          }

          const { getByText, getByTestId } = render(<TestComponent />);
          fireEvent.click(getByText('Hide'));
          expect(getByTestId('navTo')).not.toHaveFocus();

          expect(() => {
            act(() => {
              getByTestId('keyDown').focus();
            });

            expect(getByTestId('keyDown')).toHaveFocus();

            fireEvent.keyDown(getByTestId('keyDown'), { key: 'a' });
          }).not.to.throw();

          expect(getByTestId('navTo')).toHaveFocus();
        });
      });

      describe('asterisk key interaction', () => {
        it('expands all siblings that are at the same level as the current item', () => {
          const onExpandedItemsChange = spy();

          const { getByTestId } = render(
            <SimpleTreeView onExpandedItemsChange={onExpandedItemsChange}>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
              <TreeItem itemId="three" label="three" data-testid="three">
                <TreeItem itemId="four" label="four" data-testid="four" />
              </TreeItem>
              <TreeItem itemId="five" label="five" data-testid="five">
                <TreeItem itemId="six" label="six" data-testid="six">
                  <TreeItem itemId="seven" label="seven" data-testid="seven" />
                </TreeItem>
              </TreeItem>
              <TreeItem itemId="eight" label="eight" data-testid="eight" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');
          expect(getByTestId('three')).to.have.attribute('aria-expanded', 'false');
          expect(getByTestId('five')).to.have.attribute('aria-expanded', 'false');

          fireEvent.keyDown(getByTestId('one'), { key: '*' });

          expect(onExpandedItemsChange.args[0][1]).to.have.length(3);

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-expanded', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-expanded', 'true');
          expect(getByTestId('six')).to.have.attribute('aria-expanded', 'false');
          expect(getByTestId('eight')).not.to.have.attribute('aria-expanded');
        });
      });
    });

    describe('Expansion', () => {
      describe('enter key interaction', () => {
        it('expands a node with children', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

          fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');
        });

        it('collapses a node with children', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one">
                <TreeItem itemId="two" label="two" data-testid="two" />
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');

          fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });
          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'true');

          fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });
          expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');
        });
      });
    });

    describe('Single Selection', () => {
      describe('keyboard', () => {
        it('should select a node when space is pressed', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).not.to.have.attribute('aria-selected');

          fireEvent.keyDown(getByTestId('one'), { key: ' ' });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
        });

        it('should not deselect a node when space is pressed on a selected node', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultSelectedItems="one">
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');

          fireEvent.keyDown(getByTestId('one'), { key: ' ' });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
        });

        it('should not select a node when space is pressed and disableSelection', () => {
          const { getByTestId } = render(
            <SimpleTreeView disableSelection>
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: ' ' });

          expect(getByTestId('one')).not.to.have.attribute('aria-selected');
        });

        it('should select a node when Enter is pressed and the node is not selected', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });

          expect(getByTestId('one')).to.have.attribute('aria-selected');
        });

        it('should not un-select a node when Enter is pressed and the node is selected', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultSelectedItems="one">
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          fireEvent.keyDown(getByTestId('one'), { key: 'Enter' });

          expect(getByTestId('one')).to.have.attribute('aria-selected');
        });
      });

      describe('mouse', () => {
        it('should select a node when click', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).not.to.have.attribute('aria-selected');
          fireEvent.click(getByText('one'));
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
        });

        it('should not deselect a node when clicking a selected node', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView defaultSelectedItems="one">
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          fireEvent.click(getByText('one'));
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
        });

        it('should not select a node when click and disableSelection', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView disableSelection>
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          expect(getByTestId('one')).not.to.have.attribute('aria-selected');
        });
      });
    });

    describe('Multi Selection', () => {
      describe('deselection', () => {
        describe('mouse behavior when multiple nodes are selected', () => {
          it('clicking a selected node holding ctrl should deselect the node', () => {
            const { getByText, getByTestId } = render(
              <SimpleTreeView multiSelect defaultSelectedItems={['one', 'two']}>
                <TreeItem itemId="one" label="one" data-testid="one" />
                <TreeItem itemId="two" label="two" data-testid="two" />
              </SimpleTreeView>,
            );

            expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
            fireEvent.click(getByText('one'), { ctrlKey: true });
            expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          });

          it('clicking a selected node holding meta should deselect the node', () => {
            const { getByText, getByTestId } = render(
              <SimpleTreeView multiSelect defaultSelectedItems={['one', 'two']}>
                <TreeItem itemId="one" label="one" data-testid="one" />
                <TreeItem itemId="two" label="two" data-testid="two" />
              </SimpleTreeView>,
            );

            expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
            fireEvent.click(getByText('one'), { metaKey: true });
            expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          });
        });

        describe('mouse behavior when one node is selected', () => {
          it('clicking a selected node shout not deselect the node', () => {
            const { getByText, getByTestId } = render(
              <SimpleTreeView multiSelect defaultSelectedItems={['one']}>
                <TreeItem itemId="one" label="one" data-testid="one" />
                <TreeItem itemId="two" label="two" data-testid="two" />
              </SimpleTreeView>,
            );

            expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
            fireEvent.click(getByText('one'));
            expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          });
        });

        it('should deselect the item when pressing space on a selected item', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect defaultSelectedItems={['one']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          fireEvent.keyDown(getByTestId('one'), { key: ' ' });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
        });
      });

      describe('range selection', () => {
        it('keyboard arrow', () => {
          const { getByTestId, queryAllByRole, getByText } = render(
            <SimpleTreeView multiSelect defaultExpandedItems={['two']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('three'));
          act(() => {
            getByTestId('three').focus();
          });

          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');

          fireEvent.keyDown(getByTestId('three'), { key: 'ArrowDown', shiftKey: true });

          expect(getByTestId('four')).toHaveFocus();
          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(2);

          fireEvent.keyDown(getByTestId('four'), { key: 'ArrowDown', shiftKey: true });

          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(3);

          fireEvent.keyDown(getByTestId('five'), { key: 'ArrowUp', shiftKey: true });

          expect(getByTestId('four')).toHaveFocus();
          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(2);

          fireEvent.keyDown(getByTestId('four'), { key: 'ArrowUp', shiftKey: true });

          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(1);

          fireEvent.keyDown(getByTestId('three'), { key: 'ArrowUp', shiftKey: true });

          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(2);

          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowUp', shiftKey: true });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'false');
          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(3);
        });

        it('keyboard arrow does not select when selectionDisabled', () => {
          const { getByTestId, queryAllByRole } = render(
            <SimpleTreeView disableSelection multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown', shiftKey: true });

          expect(getByTestId('two')).toHaveFocus();
          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(0);

          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowUp', shiftKey: true });

          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(0);
        });

        it('keyboard arrow merge', () => {
          const { getByTestId, getByText, queryAllByRole } = render(
            <SimpleTreeView multiSelect defaultExpandedItems={['two']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
              <TreeItem itemId="six" label="six" data-testid="six" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('three'));
          act(() => {
            getByTestId('three').focus();
          });

          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');

          fireEvent.keyDown(getByTestId('three'), { key: 'ArrowUp', shiftKey: true });
          fireEvent.click(getByText('six'), { ctrlKey: true });
          fireEvent.keyDown(getByTestId('six'), { key: 'ArrowUp', shiftKey: true });
          fireEvent.keyDown(getByTestId('five'), { key: 'ArrowUp', shiftKey: true });
          fireEvent.keyDown(getByTestId('four'), { key: 'ArrowUp', shiftKey: true });
          fireEvent.keyDown(getByTestId('three'), { key: 'ArrowUp', shiftKey: true });

          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(5);

          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowDown', shiftKey: true });
          fireEvent.keyDown(getByTestId('three'), { key: 'ArrowDown', shiftKey: true });

          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(3);
        });

        it('keyboard space', () => {
          const { getByTestId, getByText } = render(
            <SimpleTreeView multiSelect defaultExpandedItems={['two']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two">
                <TreeItem itemId="three" label="three" data-testid="three" />
                <TreeItem itemId="four" label="four" data-testid="four" />
              </TreeItem>
              <TreeItem itemId="five" label="five" data-testid="five">
                <TreeItem itemId="six" label="six" data-testid="six" />
                <TreeItem itemId="seven" label="seven" data-testid="seven" />
              </TreeItem>
              <TreeItem itemId="eight" label="eight" data-testid="eight" />
              <TreeItem itemId="nine" label="nine" data-testid="nine" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('five'));
          act(() => {
            getByTestId('five').focus();
          });

          fireEvent.keyDown(getByTestId('five'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('six'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('seven'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('eight'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('nine'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('nine'), { key: ' ', shiftKey: true });

          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('six')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('seven')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('eight')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('nine')).to.have.attribute('aria-selected', 'true');

          fireEvent.keyDown(getByTestId('nine'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('eight'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('seven'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('six'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('five'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('four'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('three'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowUp' });
          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowUp' });

          fireEvent.keyDown(getByTestId('one'), { key: ' ', shiftKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('six')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('seven')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('eight')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('nine')).to.have.attribute('aria-selected', 'false');
        });

        it('keyboard home and end', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect defaultExpandedItems={['two', 'five']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two">
                <TreeItem itemId="three" label="three" data-testid="three" />
                <TreeItem itemId="four" label="four" data-testid="four" />
              </TreeItem>
              <TreeItem itemId="five" label="five" data-testid="five">
                <TreeItem itemId="six" label="six" data-testid="six" />
                <TreeItem itemId="seven" label="seven" data-testid="seven" />
              </TreeItem>
              <TreeItem itemId="eight" label="eight" data-testid="eight" />
              <TreeItem itemId="nine" label="nine" data-testid="nine" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('five').focus();
          });

          fireEvent.keyDown(getByTestId('five'), {
            key: 'End',
            shiftKey: true,
            ctrlKey: true,
          });

          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('six')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('seven')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('eight')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('nine')).to.have.attribute('aria-selected', 'true');

          fireEvent.keyDown(getByTestId('nine'), {
            key: 'Home',
            shiftKey: true,
            ctrlKey: true,
          });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('six')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('seven')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('eight')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('nine')).to.have.attribute('aria-selected', 'false');
        });

        it('keyboard home and end do not select when selectionDisabled', () => {
          const { getByTestId, getByText, queryAllByRole } = render(
            <SimpleTreeView disableSelection multiSelect defaultExpandedItems={['two', 'five']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two">
                <TreeItem itemId="three" label="three" data-testid="three" />
                <TreeItem itemId="four" label="four" data-testid="four" />
              </TreeItem>
              <TreeItem itemId="five" label="five" data-testid="five">
                <TreeItem itemId="six" label="six" data-testid="six" />
                <TreeItem itemId="seven" label="seven" data-testid="seven" />
              </TreeItem>
              <TreeItem itemId="eight" label="eight" data-testid="eight" />
              <TreeItem itemId="nine" label="nine" data-testid="nine" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('five'));
          act(() => {
            getByTestId('five').focus();
          });
          fireEvent.keyDown(getByTestId('five'), {
            key: 'End',
            shiftKey: true,
            ctrlKey: true,
          });

          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(0);

          fireEvent.keyDown(getByTestId('nine'), {
            key: 'Home',
            shiftKey: true,
            ctrlKey: true,
          });

          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(0);
        });

        it('mouse', () => {
          const { getByTestId, getByText } = render(
            <SimpleTreeView multiSelect defaultExpandedItems={['two']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two">
                <TreeItem itemId="three" label="three" data-testid="three" />
                <TreeItem itemId="four" label="four" data-testid="four" />
              </TreeItem>
              <TreeItem itemId="five" label="five" data-testid="five">
                <TreeItem itemId="six" label="six" data-testid="six" />
                <TreeItem itemId="seven" label="seven" data-testid="seven" />
              </TreeItem>
              <TreeItem itemId="eight" label="eight" data-testid="eight" />
              <TreeItem itemId="nine" label="nine" data-testid="nine" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('five'));
          fireEvent.click(getByText('nine'), { shiftKey: true });
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('six')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('seven')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('eight')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('nine')).to.have.attribute('aria-selected', 'true');
          fireEvent.click(getByText('one'), { shiftKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
        });

        it('mouse behavior after deselection', () => {
          const { getByTestId, getByText } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          fireEvent.click(getByText('two'), { ctrlKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          fireEvent.click(getByText('two'), { ctrlKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

          fireEvent.click(getByText('five'), { shiftKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
          fireEvent.click(getByText('one'), { shiftKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'false');
        });

        it('mouse does not range select when selectionDisabled', () => {
          const { getByText, queryAllByRole } = render(
            <SimpleTreeView disableSelection multiSelect defaultExpandedItems={['two']}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two">
                <TreeItem itemId="three" label="three" data-testid="three" />
                <TreeItem itemId="four" label="four" data-testid="four" />
              </TreeItem>
              <TreeItem itemId="five" label="five" data-testid="five">
                <TreeItem itemId="six" label="six" data-testid="six" />
                <TreeItem itemId="seven" label="seven" data-testid="seven" />
              </TreeItem>
              <TreeItem itemId="eight" label="eight" data-testid="eight" />
              <TreeItem itemId="nine" label="nine" data-testid="nine" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('five'));
          fireEvent.click(getByText('nine'), { shiftKey: true });
          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(0);
        });
      });

      describe('multi selection', () => {
        it('keyboard', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

          fireEvent.keyDown(getByTestId('one'), { key: ' ' });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('two'), { key: ' ' });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
        });

        it('keyboard holding ctrl', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

          fireEvent.keyDown(getByTestId('one'), { key: ' ' });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('two'), { key: ' ', ctrlKey: true });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
        });

        it('mouse', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

          fireEvent.click(getByText('one'));

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');

          fireEvent.click(getByText('two'));

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
        });

        it('mouse using ctrl', () => {
          const { getByTestId, getByText } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          fireEvent.click(getByText('one'));
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          fireEvent.click(getByText('two'), { ctrlKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
        });

        it('mouse using meta', () => {
          const { getByTestId, getByText } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          fireEvent.click(getByText('one'));
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          fireEvent.click(getByText('two'), { metaKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
        });
      });

      it('ctrl + a selects all', () => {
        const { getByTestId, queryAllByRole } = render(
          <SimpleTreeView multiSelect>
            <TreeItem itemId="one" label="one" data-testid="one" />
            <TreeItem itemId="two" label="two" data-testid="two" />
            <TreeItem itemId="three" label="three" data-testid="three" />
            <TreeItem itemId="four" label="four" data-testid="four" />
            <TreeItem itemId="five" label="five" data-testid="five" />
          </SimpleTreeView>,
        );

        act(() => {
          getByTestId('one').focus();
        });
        fireEvent.keyDown(getByTestId('one'), { key: 'a', ctrlKey: true });

        expect(queryAllByRole('treeitem', { selected: true })).to.have.length(5);
      });

      it('ctrl + a does not select all when disableSelection', () => {
        const { getByTestId, queryAllByRole } = render(
          <SimpleTreeView disableSelection multiSelect>
            <TreeItem itemId="one" label="one" data-testid="one" />
            <TreeItem itemId="two" label="two" data-testid="two" />
            <TreeItem itemId="three" label="three" data-testid="three" />
            <TreeItem itemId="four" label="four" data-testid="four" />
            <TreeItem itemId="five" label="five" data-testid="five" />
          </SimpleTreeView>,
        );

        act(() => {
          getByTestId('one').focus();
        });
        fireEvent.keyDown(getByTestId('one'), { key: 'a', ctrlKey: true });

        expect(queryAllByRole('treeitem', { selected: true })).to.have.length(0);
      });
    });
  });

  describe('prop: disabled', () => {
    describe('selection', () => {
      describe('mouse', () => {
        it('should prevent selection by mouse', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" disabled data-testid="one" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          expect(getByTestId('one')).not.to.have.attribute('aria-selected');
        });

        it('should prevent node triggering start of range selection', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" disabled data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          fireEvent.click(getByText('four'), { shiftKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'false');
        });

        it('should prevent node being selected as part of range selection', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          fireEvent.click(getByText('four'), { shiftKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
        });

        it('should prevent node triggering end of range selection', () => {
          const { getByText, getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
              <TreeItem itemId="four" label="four" disabled data-testid="four" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          fireEvent.click(getByText('four'), { shiftKey: true });
          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'false');
        });
      });

      describe('keyboard', () => {
        describe('`disabledItemsFocusable={true}`', () => {
          it('should prevent selection by keyboard', () => {
            const { getByTestId } = render(
              <SimpleTreeView disabledItemsFocusable>
                <TreeItem itemId="one" label="one" disabled data-testid="one" />
              </SimpleTreeView>,
            );

            act(() => {
              getByTestId('one').focus();
            });
            expect(getByTestId('one')).toHaveFocus();
            fireEvent.keyDown(getByTestId('one'), { key: ' ' });
            expect(getByTestId('one')).not.to.have.attribute('aria-selected');
          });

          it('should not prevent next node being range selected by keyboard', () => {
            const { getByTestId } = render(
              <SimpleTreeView multiSelect disabledItemsFocusable>
                <TreeItem itemId="one" label="one" disabled data-testid="one" />
                <TreeItem itemId="two" label="two" data-testid="two" />
                <TreeItem itemId="three" label="three" data-testid="three" />
                <TreeItem itemId="four" label="four" data-testid="four" />
              </SimpleTreeView>,
            );

            act(() => {
              getByTestId('one').focus();
            });
            expect(getByTestId('one')).toHaveFocus();
            fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown', shiftKey: true });
            expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
            expect(getByTestId('two')).toHaveFocus();
          });

          it('should prevent range selection by keyboard + arrow down', () => {
            const { getByTestId } = render(
              <SimpleTreeView multiSelect disabledItemsFocusable>
                <TreeItem itemId="one" label="one" data-testid="one" />
                <TreeItem itemId="two" label="two" disabled data-testid="two" />
              </SimpleTreeView>,
            );

            act(() => {
              getByTestId('one').focus();
            });
            expect(getByTestId('one')).toHaveFocus();
            fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown', shiftKey: true });
            expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('two')).toHaveFocus();
          });
        });

        describe('`disabledItemsFocusable={false}`', () => {
          it('should select the next non disabled node by keyboard + arrow down', () => {
            const { getByTestId } = render(
              <SimpleTreeView multiSelect>
                <TreeItem itemId="one" label="one" data-testid="one" />
                <TreeItem itemId="two" label="two" disabled data-testid="two" />
                <TreeItem itemId="three" label="three" data-testid="three" />
              </SimpleTreeView>,
            );

            act(() => {
              getByTestId('one').focus();
            });
            expect(getByTestId('one')).toHaveFocus();
            fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown', shiftKey: true });
            expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('three')).toHaveFocus();
            expect(getByTestId('one')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('two')).to.have.attribute('aria-selected', 'false');
            expect(getByTestId('three')).to.have.attribute('aria-selected', 'true');
          });
        });

        it('should prevent range selection by keyboard + space', () => {
          const { getByTestId, getByText } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" disabled data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('one'));
          act(() => {
            getByTestId('one').focus();
          });

          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowDown' });
          fireEvent.keyDown(getByTestId('four'), { key: 'ArrowDown' });

          fireEvent.keyDown(getByTestId('five'), { key: ' ', shiftKey: true });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
        });

        it('should prevent selection by ctrl + a', () => {
          const { getByTestId, queryAllByRole } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" disabled data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          fireEvent.keyDown(getByTestId('one'), { key: 'a', ctrlKey: true });
          expect(queryAllByRole('treeitem', { selected: true })).to.have.length(4);
        });

        it('should prevent selection by keyboard end', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" disabled data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          expect(getByTestId('one')).toHaveFocus();
          fireEvent.keyDown(getByTestId('one'), {
            key: 'End',
            shiftKey: true,
            ctrlKey: true,
          });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
        });

        it('should prevent selection by keyboard home', () => {
          const { getByTestId } = render(
            <SimpleTreeView multiSelect>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
              <TreeItem itemId="three" label="three" disabled data-testid="three" />
              <TreeItem itemId="four" label="four" data-testid="four" />
              <TreeItem itemId="five" label="five" data-testid="five" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('five').focus();
          });
          expect(getByTestId('five')).toHaveFocus();
          fireEvent.keyDown(getByTestId('five'), {
            key: 'Home',
            shiftKey: true,
            ctrlKey: true,
          });

          expect(getByTestId('one')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('two')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('three')).to.have.attribute('aria-selected', 'false');
          expect(getByTestId('four')).to.have.attribute('aria-selected', 'true');
          expect(getByTestId('five')).to.have.attribute('aria-selected', 'true');
        });
      });
    });

    describe('focus', () => {
      describe('`disabledItemsFocusable={true}`', () => {
        it('should prevent focus by mouse', () => {
          const onItemFocus = spy();
          const { getByText } = render(
            <SimpleTreeView disabledItemsFocusable onItemFocus={onItemFocus}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('two'));
          expect(onItemFocus.callCount).to.equal(0);
        });

        it('should not prevent programmatic focus', () => {
          const { getByTestId } = render(
            <SimpleTreeView disabledItemsFocusable>
              <TreeItem itemId="one" label="one" disabled data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          expect(getByTestId('one')).toHaveFocus();
        });

        it('should not prevent focus by type-ahead', () => {
          const { getByTestId } = render(
            <SimpleTreeView disabledItemsFocusable>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          expect(getByTestId('one')).toHaveFocus();
          fireEvent.keyDown(getByTestId('one'), { key: 't' });
          expect(getByTestId('two')).toHaveFocus();
        });

        it('should not prevent focus by arrow keys', () => {
          const { getByTestId } = render(
            <SimpleTreeView disabledItemsFocusable>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });
          expect(getByTestId('two')).toHaveFocus();
        });
      });

      describe('`disabledItemsFocusable=false`', () => {
        it('should prevent focus by mouse', () => {
          const onItemFocus = spy();
          const { getByText } = render(
            <SimpleTreeView onItemFocus={onItemFocus}>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two" />
            </SimpleTreeView>,
          );

          fireEvent.click(getByText('two'));
          expect(onItemFocus.callCount).to.equal(0);
        });

        it('should prevent focus when clicking', () => {
          const handleMouseDown = spy();

          const { getByText } = render(
            <SimpleTreeView>
              <TreeItem
                itemId="one"
                label="one"
                disabled
                data-testid="one"
                ContentProps={{ onMouseDown: handleMouseDown }}
              />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          fireEvent.mouseDown(getByText('one'));
          expect(handleMouseDown.lastCall.firstArg.defaultPrevented).to.equal(true);
        });

        it('should prevent focus by type-ahead', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });
          expect(getByTestId('one')).toHaveFocus();
          fireEvent.keyDown(getByTestId('one'), { key: 't' });
          expect(getByTestId('one')).toHaveFocus();
        });

        it('should be skipped on navigation with arrow keys', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" data-testid="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two" />
              <TreeItem itemId="three" label="three" data-testid="three" />
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('one').focus();
          });

          expect(getByTestId('one')).toHaveFocus();

          fireEvent.keyDown(getByTestId('one'), { key: 'ArrowDown' });
          expect(getByTestId('three')).toHaveFocus();
        });

        it('should set tabIndex={-1} and tabIndex={0} on next item', () => {
          const { getByTestId } = render(
            <SimpleTreeView>
              <TreeItem itemId="one" label="one" disabled data-testid="one" />
              <TreeItem itemId="two" label="two" data-testid="two" />
            </SimpleTreeView>,
          );

          expect(getByTestId('one').tabIndex).to.equal(-1);
          expect(getByTestId('two').tabIndex).to.equal(0);
        });
      });
    });

    describe('expansion', () => {
      describe('`disabledItemsFocusable={true}`', () => {
        it('should prevent expansion on Enter', () => {
          const { getByTestId } = render(
            <SimpleTreeView disabledItemsFocusable>
              <TreeItem itemId="one" label="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two">
                <TreeItem itemId="three" label="three" />
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('two').focus();
          });
          expect(getByTestId('two')).toHaveFocus();
          expect(getByTestId('two')).to.have.attribute('aria-expanded', 'false');
          fireEvent.keyDown(getByTestId('two'), { key: 'Enter' });
          expect(getByTestId('two')).to.have.attribute('aria-expanded', 'false');
        });

        it('should prevent expansion on right arrow', () => {
          const { getByTestId } = render(
            <SimpleTreeView disabledItemsFocusable>
              <TreeItem itemId="one" label="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two">
                <TreeItem itemId="three" label="three" />
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('two').focus();
          });
          expect(getByTestId('two')).toHaveFocus();
          expect(getByTestId('two')).to.have.attribute('aria-expanded', 'false');
          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowRight' });
          expect(getByTestId('two')).to.have.attribute('aria-expanded', 'false');
        });

        it('should prevent collapse on left arrow', () => {
          const { getByTestId } = render(
            <SimpleTreeView defaultExpandedItems={['two']} disabledItemsFocusable>
              <TreeItem itemId="one" label="one" />
              <TreeItem itemId="two" label="two" disabled data-testid="two">
                <TreeItem itemId="three" label="three" />
              </TreeItem>
            </SimpleTreeView>,
          );

          act(() => {
            getByTestId('two').focus();
          });
          expect(getByTestId('two')).toHaveFocus();
          expect(getByTestId('two')).to.have.attribute('aria-expanded', 'true');
          fireEvent.keyDown(getByTestId('two'), { key: 'ArrowLeft' });
          expect(getByTestId('two')).to.have.attribute('aria-expanded', 'true');
        });
      });

      it('should prevent expansion on click', () => {
        const { getByText, getByTestId } = render(
          <SimpleTreeView>
            <TreeItem itemId="one" label="one" disabled data-testid="one">
              <TreeItem itemId="two" label="two" />
            </TreeItem>
          </SimpleTreeView>,
        );

        fireEvent.click(getByText('one'));
        expect(getByTestId('one')).to.have.attribute('aria-expanded', 'false');
      });
    });

    describe('event bindings', () => {
      it('should not prevent onClick being fired', () => {
        const handleClick = spy();

        const { getByText } = render(
          <SimpleTreeView>
            <TreeItem itemId="test" label="test" disabled onClick={handleClick} />
          </SimpleTreeView>,
        );

        fireEvent.click(getByText('test'));

        expect(handleClick.callCount).to.equal(1);
      });
    });

    it('should disable child items when parent item is disabled', () => {
      const { getByTestId } = render(
        <SimpleTreeView defaultExpandedItems={['one']}>
          <TreeItem itemId="one" label="one" disabled data-testid="one">
            <TreeItem itemId="two" label="two" data-testid="two" />
            <TreeItem itemId="three" label="three" data-testid="three" />
          </TreeItem>
        </SimpleTreeView>,
      );

      expect(getByTestId('one')).to.have.attribute('aria-disabled', 'true');
      expect(getByTestId('two')).to.have.attribute('aria-disabled', 'true');
      expect(getByTestId('three')).to.have.attribute('aria-disabled', 'true');
    });
  });

  describe('content customisation', () => {
    it('should allow a custom ContentComponent', () => {
      const mockContent = React.forwardRef((props: {}, ref: React.Ref<HTMLDivElement>) => (
        <div ref={ref}>MOCK CONTENT COMPONENT</div>
      ));
      const { container } = render(
        <SimpleTreeView>
          <TreeItem itemId="one" ContentComponent={mockContent as any} />
        </SimpleTreeView>,
      );
      expect(container.textContent).to.equal('MOCK CONTENT COMPONENT');
    });

    it('should allow props to be passed to a custom ContentComponent', () => {
      const mockContent = React.forwardRef((props: any, ref: React.Ref<HTMLDivElement>) => (
        <div ref={ref}>{props.customProp}</div>
      ));
      const { container } = render(
        <SimpleTreeView>
          <TreeItem
            itemId="one"
            ContentComponent={mockContent as any}
            ContentProps={{ customProp: 'ABCDEF' } as any}
          />
        </SimpleTreeView>,
      );
      expect(container.textContent).to.equal('ABCDEF');
    });
  });

  it('should be able to type in an child input', () => {
    const { getByRole } = render(
      <SimpleTreeView defaultExpandedItems={['one']}>
        <TreeItem itemId="one" label="one" data-testid="one">
          <TreeItem
            itemId="two"
            label={
              <div>
                <input type="text" />
              </div>
            }
            data-testid="two"
          />
        </TreeItem>
      </SimpleTreeView>,
    );
    const input = getByRole('textbox');
    const keydownEvent = createEvent.keyDown(input, {
      key: 'a',
    });

    const handlePreventDefault = spy();
    keydownEvent.preventDefault = handlePreventDefault;
    fireEvent(input, keydownEvent);
    expect(handlePreventDefault.callCount).to.equal(0);
  });

  it('should not focus steal', () => {
    let setActiveItemMounted;
    // a TreeItem whose mounted state we can control with `setActiveItemMounted`
    function ControlledTreeItem(props) {
      const [mounted, setMounted] = React.useState(true);
      setActiveItemMounted = setMounted;

      if (!mounted) {
        return null;
      }
      return <TreeItem {...props} />;
    }
    const { getByText, getByTestId, getByRole } = render(
      <React.Fragment>
        <button type="button">Some focusable element</button>
        <SimpleTreeView>
          <TreeItem itemId="one" label="one" data-testid="one" />
          <ControlledTreeItem itemId="two" label="two" data-testid="two" />
        </SimpleTreeView>
      </React.Fragment>,
    );

    fireEvent.click(getByText('two'));
    act(() => {
      getByTestId('two').focus();
    });

    expect(getByTestId('two')).toHaveFocus();

    act(() => {
      getByRole('button').focus();
    });

    expect(getByRole('button')).toHaveFocus();

    act(() => {
      setActiveItemMounted(false);
    });
    act(() => {
      setActiveItemMounted(true);
    });

    expect(getByRole('button')).toHaveFocus();
  });
});
