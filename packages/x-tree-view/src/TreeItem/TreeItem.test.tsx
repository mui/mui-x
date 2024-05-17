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
    isItemExpandable: () => false,
    isItemExpanded: () => false,
    isItemFocused: () => false,
    isItemSelected: () => false,
    isItemDisabled: (itemId: string | null): itemId is string => !!itemId,
    getTreeItemIdAttribute: () => '',
    mapFirstCharFromJSX: () => () => {},
    canItemBeTabbed: () => false,
  } as any,
  publicAPI: {
    focusItem: () => {},
    getItem: () => ({}),
    setItemExpansion: () => {},
  },
  runItemPlugins: () => ({ rootRef: null, contentRef: null }),
  wrapItem: ({ children }) => children,
  wrapRoot: ({ children }) => children,
  disabledItemsFocusable: false,
  icons: {
    slots: {},
    slotProps: {},
  },
  selection: {
    multiSelect: false,
    checkboxSelection: false,
    disableSelection: false,
  },
  rootRef: {
    current: null,
  },
};

describe('<TreeItem />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeItem itemId="one" label="one" />, () => ({
    classes,
    inheritComponent: 'li',
    wrapMount: (mount) => (item: React.ReactNode) => {
      const wrapper = mount(
        <TreeViewContext.Provider value={TEST_TREE_VIEW_CONTEXT_VALUE}>
          {item}
        </TreeViewContext.Provider>,
      );
      return wrapper.childAt(0);
    },
    render: (item) => {
      return render(
        <TreeViewContext.Provider value={TEST_TREE_VIEW_CONTEXT_VALUE}>
          {item}
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
  });

  describe('prop: disabled', () => {
    describe('selection', () => {
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

          it('should not prevent next item being range selected by keyboard', () => {
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
          it('should select the next non disabled item by keyboard + arrow down', () => {
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
