import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useTheme, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/base';
import useControlled from '@mui/utils/useControlled';
import useForkRef from '@mui/utils/useForkRef';
import ownerDocument from '@mui/utils/ownerDocument';
import useId from '@mui/utils/useId';
import { TreeViewContext } from './TreeViewContext';
import { DescendantProvider } from './descendants';
import { getTreeViewUtilityClass } from './treeViewClasses';
import {
  MultiSelectTreeViewProps,
  TreeViewDefaultizedProps,
  TreeViewItemRange,
  TreeViewNode,
  TreeViewProps,
} from './TreeView.types';

const useUtilityClasses = (ownerState: TreeViewDefaultizedProps) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getTreeViewUtilityClass, classes);
};

const TreeViewRoot = styled('ul', {
  name: 'MuiTreeView',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: TreeViewDefaultizedProps }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
});

function isPrintableCharacter(string: string) {
  return string && string.length === 1 && string.match(/\S/);
}

function findNextFirstChar(firstChars: string[], startIndex: number, char: string) {
  for (let i = startIndex; i < firstChars.length; i += 1) {
    if (char === firstChars[i]) {
      return i;
    }
  }
  return -1;
}

function noopSelection() {
  return false;
}

const defaultDefaultExpanded: string[] = [];
const defaultDefaultSelected: string[] = [];

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/material-ui/react-tree-view/)
 *
 * API:
 *
 * - [TreeView API](https://mui.com/material-ui/api/tree-view/)
 */
const TreeView = React.forwardRef(function TreeView(
  inProps: TreeViewProps,
  ref: React.Ref<HTMLUListElement>,
) {
  const themeProps = useThemeProps({ props: inProps, name: 'MuiTreeView' });
  const props: TreeViewDefaultizedProps = {
    ...themeProps,
    disabledItemsFocusable: themeProps.disabledItemsFocusable ?? false,
    disableSelection: themeProps.disableSelection ?? false,
    multiSelect: themeProps.multiSelect ?? false,
    defaultExpanded: themeProps.defaultExpanded ?? defaultDefaultExpanded,
    defaultSelected: themeProps.defaultSelected ?? defaultDefaultSelected,
  };

  const {
    children,
    className,
    defaultCollapseIcon,
    defaultEndIcon,
    defaultExpanded,
    defaultExpandIcon,
    defaultParentIcon,
    defaultSelected,
    disabledItemsFocusable,
    disableSelection,
    expanded: expandedProp,
    id: idProp,
    multiSelect,
    onBlur,
    onFocus,
    onKeyDown,
    onNodeFocus,
    onNodeSelect,
    onNodeToggle,
    selected: selectedProp,
    ...other
  } = props;

  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const classes = useUtilityClasses(props);
  const treeId = useId(idProp);
  const treeRef = React.useRef(null);
  const handleRef = useForkRef(treeRef, ref);

  const [focusedNodeId, setFocusedNodeId] = React.useState<string | null>(null);

  const nodeMap = React.useRef<{ [nodeId: string]: TreeViewNode }>({});

  const firstCharMap = React.useRef<{ [nodeId: string]: string }>({});

  const [expanded, setExpandedState] = useControlled({
    controlled: expandedProp,
    default: defaultExpanded,
    name: 'TreeView',
    state: 'expanded',
  });

  const [selected, setSelectedState] = useControlled({
    controlled: selectedProp,
    default: defaultSelected,
    name: 'TreeView',
    state: 'selected',
  });

  /*
   * Status Helpers
   */
  const isExpanded = React.useCallback(
    (nodeId: string) => (Array.isArray(expanded) ? expanded.indexOf(nodeId) !== -1 : false),
    [expanded],
  );

  const isExpandable = React.useCallback(
    (nodeId: string) => nodeMap.current[nodeId] && nodeMap.current[nodeId].expandable,
    [],
  );

  const isSelected = React.useCallback(
    (nodeId: string) =>
      Array.isArray(selected) ? selected.indexOf(nodeId) !== -1 : selected === nodeId,
    [selected],
  );

  const isDisabled = React.useCallback((nodeId: string | null) => {
    if (nodeId == null) {
      return false;
    }

    let node = nodeMap.current[nodeId];

    // This can be called before the node has been added to the node map.
    if (!node) {
      return false;
    }

    if (node.disabled) {
      return true;
    }

    while (node.parentId != null) {
      node = nodeMap.current[node.parentId];
      if (node.disabled) {
        return true;
      }
    }

    return false;
  }, []);

  const isFocused = (nodeId: string) => focusedNodeId === nodeId;

  /*
   * Child Helpers
   */

  // Using Object.keys -> .map to mimic Object.values we should replace with Object.values() once we stop IE11 support.
  const getChildrenIds = (nodeId: string | null) =>
    Object.keys(nodeMap.current)
      .map((key) => {
        return nodeMap.current[key];
      })
      .filter((node) => node.parentId === nodeId)
      .sort((a, b) => a.index - b.index)
      .map((child) => child.id);

  const getNavigableChildrenIds = (nodeId: string | null) => {
    let childrenIds = getChildrenIds(nodeId);

    if (!disabledItemsFocusable) {
      childrenIds = childrenIds.filter((node) => !isDisabled(node));
    }
    return childrenIds;
  };

  /*
   * Node Helpers
   */

  const getNextNode = (nodeId: string) => {
    // If expanded get first child
    if (isExpanded(nodeId) && getNavigableChildrenIds(nodeId).length > 0) {
      return getNavigableChildrenIds(nodeId)[0];
    }

    let node = nodeMap.current[nodeId];
    while (node != null) {
      // Try to get next sibling
      const siblings = getNavigableChildrenIds(node.parentId);
      const nextSibling = siblings[siblings.indexOf(node.id) + 1];

      if (nextSibling) {
        return nextSibling;
      }

      // If the sibling does not exist, go up a level to the parent and try again.
      node = nodeMap.current[node.parentId!];
    }

    return null;
  };

  const getPreviousNode = (nodeId: string) => {
    const node = nodeMap.current[nodeId];
    const siblings = getNavigableChildrenIds(node.parentId);
    const nodeIndex = siblings.indexOf(nodeId);

    if (nodeIndex === 0) {
      return node.parentId;
    }

    let currentNode: string = siblings[nodeIndex - 1];
    while (isExpanded(currentNode) && getNavigableChildrenIds(currentNode).length > 0) {
      currentNode = getNavigableChildrenIds(currentNode).pop()!;
    }

    return currentNode;
  };

  const getLastNode = () => {
    let lastNode = getNavigableChildrenIds(null).pop()!;

    while (isExpanded(lastNode)) {
      lastNode = getNavigableChildrenIds(lastNode).pop()!;
    }
    return lastNode;
  };
  const getFirstNode = () => getNavigableChildrenIds(null)[0];
  const getParent = (nodeId: string) => nodeMap.current[nodeId].parentId;

  /**
   * This is used to determine the start and end of a selection range so
   * we can get the nodes between the two border nodes.
   *
   * It finds the nodes' common ancestor using
   * a naive implementation of a lowest common ancestor algorithm
   * (https://en.wikipedia.org/wiki/Lowest_common_ancestor).
   * Then compares the ancestor's 2 children that are ancestors of nodeA and NodeB
   * so we can compare their indexes to work out which node comes first in a depth first search.
   * (https://en.wikipedia.org/wiki/Depth-first_search)
   *
   * Another way to put it is which node is shallower in a trémaux tree
   * https://en.wikipedia.org/wiki/Tr%C3%A9maux_tree
   */
  const findOrderInTremauxTree = (nodeAId: string, nodeBId: string) => {
    if (nodeAId === nodeBId) {
      return [nodeAId, nodeBId];
    }

    const nodeA = nodeMap.current[nodeAId];
    const nodeB = nodeMap.current[nodeBId];

    if (nodeA.parentId === nodeB.id || nodeB.parentId === nodeA.id) {
      return nodeB.parentId === nodeA.id ? [nodeA.id, nodeB.id] : [nodeB.id, nodeA.id];
    }

    const aFamily: (string | null)[] = [nodeA.id];
    const bFamily: (string | null)[] = [nodeB.id];

    let aAncestor = nodeA.parentId;
    let bAncestor = nodeB.parentId;

    let aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
    let bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;

    let continueA = true;
    let continueB = true;

    while (!bAncestorIsCommon && !aAncestorIsCommon) {
      if (continueA) {
        aFamily.push(aAncestor);
        aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
        continueA = aAncestor !== null;
        if (!aAncestorIsCommon && continueA) {
          aAncestor = nodeMap.current[aAncestor!].parentId;
        }
      }

      if (continueB && !aAncestorIsCommon) {
        bFamily.push(bAncestor);
        bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
        continueB = bAncestor !== null;
        if (!bAncestorIsCommon && continueB) {
          bAncestor = nodeMap.current[bAncestor!].parentId;
        }
      }
    }

    const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
    const ancestorFamily = getChildrenIds(commonAncestor);

    const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
    const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

    return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!)
      ? [nodeAId, nodeBId]
      : [nodeBId, nodeAId];
  };

  const getNodesInRange = (nodeAId: string, nodeBId: string) => {
    const [first, last] = findOrderInTremauxTree(nodeAId, nodeBId);
    const nodes = [first];

    let current = first;

    while (current !== last) {
      current = getNextNode(current)!;
      nodes.push(current);
    }

    return nodes;
  };

  /*
   * Focus Helpers
   */

  const focus = (event: React.SyntheticEvent, nodeId: string | null) => {
    if (nodeId) {
      setFocusedNodeId(nodeId);

      if (onNodeFocus) {
        onNodeFocus(event, nodeId);
      }
    }
  };

  const focusNextNode = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) =>
    focus(event, getNextNode(nodeId));
  const focusPreviousNode = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) =>
    focus(event, getPreviousNode(nodeId));
  const focusFirstNode = (event: React.KeyboardEvent<HTMLUListElement>) =>
    focus(event, getFirstNode());
  const focusLastNode = (event: React.KeyboardEvent<HTMLUListElement>) =>
    focus(event, getLastNode());

  const focusByFirstCharacter = (
    event: React.KeyboardEvent<HTMLUListElement>,
    nodeId: string,
    firstChar: string,
  ) => {
    let start: number;
    let index: number;
    const lowercaseChar = firstChar.toLowerCase();

    const firstCharIds: string[] = [];
    const firstChars: string[] = [];
    // This really only works since the ids are strings
    Object.keys(firstCharMap.current).forEach((mapNodeId) => {
      const map = nodeMap.current[mapNodeId];
      const visible = map.parentId ? isExpanded(map.parentId) : true;
      const shouldBeSkipped = disabledItemsFocusable ? false : isDisabled(mapNodeId);

      if (visible && !shouldBeSkipped) {
        firstCharIds.push(mapNodeId);
        firstChars.push(firstCharMap.current[mapNodeId]);
      }
    });

    // Get start index for search based on position of currentItem
    start = firstCharIds.indexOf(nodeId) + 1;
    if (start >= firstCharIds.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = findNextFirstChar(firstChars, start, lowercaseChar);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = findNextFirstChar(firstChars, 0, lowercaseChar);
    }

    // If match was found...
    if (index > -1) {
      focus(event, firstCharIds[index]);
    }
  };

  /*
   * Expansion Helpers
   */

  const toggleExpansion = (event: React.SyntheticEvent, value = focusedNodeId) => {
    if (value == null) {
      return;
    }

    let newExpanded: string[];

    if (expanded.indexOf(value!) !== -1) {
      newExpanded = expanded.filter((id) => id !== value);
    } else {
      newExpanded = [value].concat(expanded);
    }

    if (onNodeToggle) {
      onNodeToggle(event, newExpanded);
    }

    setExpandedState(newExpanded);
  };

  const expandAllSiblings = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    const map = nodeMap.current[nodeId];
    const siblings = getChildrenIds(map.parentId);

    const diff = siblings.filter((child) => isExpandable(child) && !isExpanded(child));

    const newExpanded = expanded.concat(diff);

    if (diff.length > 0) {
      setExpandedState(newExpanded);

      if (onNodeToggle) {
        onNodeToggle(event, newExpanded);
      }
    }
  };

  /*
   * Selection Helpers
   */

  const lastSelectedNode = React.useRef<string | null>(null);
  const lastSelectionWasRange = React.useRef(false);
  const currentRangeSelection = React.useRef<string[]>([]);

  const handleRangeArrowSelect = (event: React.SyntheticEvent, nodes: TreeViewItemRange) => {
    let base = (selected as string[]).slice();
    const { start, next, current } = nodes;

    if (!next || !current) {
      return;
    }

    if (currentRangeSelection.current.indexOf(current) === -1) {
      currentRangeSelection.current = [];
    }

    if (lastSelectionWasRange.current) {
      if (currentRangeSelection.current.indexOf(next) !== -1) {
        base = base.filter((id) => id === start || id !== current);
        currentRangeSelection.current = currentRangeSelection.current.filter(
          (id) => id === start || id !== current,
        );
      } else {
        base.push(next);
        currentRangeSelection.current.push(next);
      }
    } else {
      base.push(next);
      currentRangeSelection.current.push(current, next);
    }

    if (onNodeSelect) {
      (onNodeSelect as MultiSelectTreeViewProps['onNodeSelect'])!(event, base);
    }

    setSelectedState(base);
  };

  const handleRangeSelect = (
    event: React.SyntheticEvent,
    nodes: { start: string; end: string },
  ) => {
    let base = (selected as string[]).slice();
    const { start, end } = nodes;
    // If last selection was a range selection ignore nodes that were selected.
    if (lastSelectionWasRange.current) {
      base = base.filter((id) => currentRangeSelection.current.indexOf(id) === -1);
    }

    let range = getNodesInRange(start, end);
    range = range.filter((node) => !isDisabled(node));
    currentRangeSelection.current = range;
    let newSelected = base.concat(range);
    newSelected = newSelected.filter((id, i) => newSelected.indexOf(id) === i);

    if (onNodeSelect) {
      (onNodeSelect as MultiSelectTreeViewProps['onNodeSelect'])!(event, newSelected);
    }

    setSelectedState(newSelected);
  };

  const handleMultipleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    if (!Array.isArray(selected)) {
      return;
    }

    let newSelected: string[];
    if (selected.indexOf(nodeId) !== -1) {
      newSelected = selected.filter((id) => id !== nodeId);
    } else {
      newSelected = [nodeId].concat(selected);
    }

    if (onNodeSelect) {
      (onNodeSelect as MultiSelectTreeViewProps['onNodeSelect'])!(event, newSelected);
    }

    setSelectedState(newSelected);
  };

  const handleSingleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const newSelected = multiSelect ? [nodeId] : nodeId;

    if (onNodeSelect) {
      onNodeSelect(event, newSelected as string & string[]);
    }

    setSelectedState(newSelected);
  };

  const selectNode = (event: React.SyntheticEvent, nodeId: string, multiple = false) => {
    if (nodeId) {
      if (multiple) {
        handleMultipleSelect(event, nodeId);
      } else {
        handleSingleSelect(event, nodeId);
      }
      lastSelectedNode.current = nodeId;
      lastSelectionWasRange.current = false;
      currentRangeSelection.current = [];

      return true;
    }
    return false;
  };

  const selectRange = (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked = false) => {
    const { start = lastSelectedNode.current, end, current } = nodes;
    if (stacked) {
      handleRangeArrowSelect(event, { start, next: end, current });
    } else if (start != null && end != null) {
      handleRangeSelect(event, { start, end });
    }
    lastSelectionWasRange.current = true;
  };

  const rangeSelectToFirst = (event: React.KeyboardEvent<HTMLUListElement>, id: string) => {
    if (!lastSelectedNode.current) {
      lastSelectedNode.current = id;
    }

    const start = lastSelectionWasRange.current ? lastSelectedNode.current : id;

    selectRange(event, {
      start,
      end: getFirstNode(),
    });
  };

  const rangeSelectToLast = (event: React.KeyboardEvent<HTMLUListElement>, id: string) => {
    if (!lastSelectedNode.current) {
      lastSelectedNode.current = id;
    }

    const start = lastSelectionWasRange.current ? lastSelectedNode.current : id;

    selectRange(event, {
      start,
      end: getLastNode(),
    });
  };

  const selectNextNode = (event: React.KeyboardEvent<HTMLUListElement>, id: string) => {
    if (!isDisabled(getNextNode(id))) {
      selectRange(
        event,
        {
          end: getNextNode(id),
          current: id,
        },
        true,
      );
    }
  };

  const selectPreviousNode = (event: React.KeyboardEvent<HTMLUListElement>, id: string) => {
    if (!isDisabled(getPreviousNode(id))) {
      selectRange(
        event,
        {
          end: getPreviousNode(id)!,
          current: id,
        },
        true,
      );
    }
  };

  const selectAllNodes = (event: React.KeyboardEvent<HTMLUListElement>) => {
    selectRange(event, { start: getFirstNode(), end: getLastNode() });
  };

  /*
   * Mapping Helpers
   */
  const registerNode = React.useCallback((node: TreeViewNode) => {
    const { id, index, parentId, expandable, idAttribute, disabled } = node;

    nodeMap.current[id] = { id, index, parentId, expandable, idAttribute, disabled };
  }, []);

  const unregisterNode = React.useCallback((nodeId: string) => {
    const newMap = { ...nodeMap.current };
    delete newMap[nodeId];
    nodeMap.current = newMap;

    setFocusedNodeId((oldFocusedNodeId) => {
      if (
        oldFocusedNodeId === nodeId &&
        treeRef.current === ownerDocument(treeRef.current).activeElement
      ) {
        return getChildrenIds(null)[0];
      }
      return oldFocusedNodeId;
    });
  }, []);

  const mapFirstChar = React.useCallback((nodeId: string, firstChar: string) => {
    firstCharMap.current[nodeId] = firstChar;
  }, []);

  const unMapFirstChar = React.useCallback((nodeId: string) => {
    const newMap = { ...firstCharMap.current };
    delete newMap[nodeId];
    firstCharMap.current = newMap;
  }, []);

  /**
   * Event handlers and Navigation
   */

  const handleNextArrow = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (focusedNodeId != null && isExpandable(focusedNodeId)) {
      if (isExpanded(focusedNodeId)) {
        focusNextNode(event, focusedNodeId);
      } else if (!isDisabled(focusedNodeId)) {
        toggleExpansion(event);
      }
    }
    return true;
  };

  const handlePreviousArrow = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (focusedNodeId == null) {
      return false;
    }

    if (isExpanded(focusedNodeId) && !isDisabled(focusedNodeId)) {
      toggleExpansion(event, focusedNodeId!);
      return true;
    }

    const parent = getParent(focusedNodeId);
    if (parent) {
      focus(event, parent);
      return true;
    }
    return false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    let flag = false;
    const key = event.key;

    // If the tree is empty there will be no focused node
    if (event.altKey || event.currentTarget !== event.target || !focusedNodeId) {
      return;
    }

    const ctrlPressed = event.ctrlKey || event.metaKey;
    switch (key) {
      case ' ':
        if (!disableSelection && focusedNodeId != null && !isDisabled(focusedNodeId)) {
          if (multiSelect && event.shiftKey) {
            selectRange(event, { end: focusedNodeId });
            flag = true;
          } else if (multiSelect) {
            flag = selectNode(event, focusedNodeId, true);
          } else {
            flag = selectNode(event, focusedNodeId);
          }
        }
        event.stopPropagation();
        break;
      case 'Enter':
        if (!isDisabled(focusedNodeId)) {
          if (isExpandable(focusedNodeId)) {
            toggleExpansion(event);
            flag = true;
          } else if (multiSelect) {
            flag = selectNode(event, focusedNodeId, true);
          } else {
            flag = selectNode(event, focusedNodeId);
          }
        }
        event.stopPropagation();
        break;
      case 'ArrowDown':
        if (multiSelect && event.shiftKey && !disableSelection) {
          selectNextNode(event, focusedNodeId);
        }
        focusNextNode(event, focusedNodeId);
        flag = true;
        break;
      case 'ArrowUp':
        if (multiSelect && event.shiftKey && !disableSelection) {
          selectPreviousNode(event, focusedNodeId);
        }
        focusPreviousNode(event, focusedNodeId);
        flag = true;
        break;
      case 'ArrowRight':
        if (isRtl) {
          flag = handlePreviousArrow(event);
        } else {
          flag = handleNextArrow(event);
        }
        break;
      case 'ArrowLeft':
        if (isRtl) {
          flag = handleNextArrow(event);
        } else {
          flag = handlePreviousArrow(event);
        }
        break;
      case 'Home':
        if (
          multiSelect &&
          ctrlPressed &&
          event.shiftKey &&
          !disableSelection &&
          !isDisabled(focusedNodeId)
        ) {
          rangeSelectToFirst(event, focusedNodeId);
        }
        focusFirstNode(event);
        flag = true;
        break;
      case 'End':
        if (
          multiSelect &&
          ctrlPressed &&
          event.shiftKey &&
          !disableSelection &&
          !isDisabled(focusedNodeId)
        ) {
          rangeSelectToLast(event, focusedNodeId);
        }
        focusLastNode(event);
        flag = true;
        break;
      default:
        if (key === '*') {
          expandAllSiblings(event, focusedNodeId);
          flag = true;
        } else if (multiSelect && ctrlPressed && key.toLowerCase() === 'a' && !disableSelection) {
          selectAllNodes(event);
          flag = true;
        } else if (!ctrlPressed && !event.shiftKey && isPrintableCharacter(key)) {
          focusByFirstCharacter(event, focusedNodeId, key);
          flag = true;
        }
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLUListElement>) => {
    // if the event bubbled (which is React specific) we don't want to steal focus
    if (event.target === event.currentTarget) {
      const firstSelected = Array.isArray(selected) ? selected[0] : selected;
      focus(event, firstSelected || getNavigableChildrenIds(null)[0]);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    setFocusedNodeId(null);

    if (onBlur) {
      onBlur(event);
    }
  };

  const activeDescendant = nodeMap.current[focusedNodeId!]
    ? nodeMap.current[focusedNodeId!].idAttribute
    : null;

  return (
    <TreeViewContext.Provider
      // TODO: fix this lint error
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        icons: { defaultCollapseIcon, defaultExpandIcon, defaultParentIcon, defaultEndIcon },
        focus,
        toggleExpansion,
        isExpanded,
        isExpandable,
        isFocused,
        isSelected,
        isDisabled,
        selectNode: disableSelection ? noopSelection : selectNode,
        selectRange: disableSelection ? noopSelection : selectRange,
        multiSelect,
        disabledItemsFocusable,
        mapFirstChar,
        unMapFirstChar,
        registerNode,
        unregisterNode,
        treeId,
      }}
    >
      <DescendantProvider>
        <TreeViewRoot
          role="tree"
          id={treeId}
          aria-activedescendant={activeDescendant ?? undefined}
          aria-multiselectable={multiSelect}
          className={clsx(classes.root, className)}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ownerState={props}
          {...other}
          ref={handleRef}
        >
          {children}
        </TreeViewRoot>
      </DescendantProvider>
    </TreeViewContext.Provider>
  );
});

TreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * className applied to the root element.
   */
  className: PropTypes.string,
  /**
   * The default icon used to collapse the node.
   */
  defaultCollapseIcon: PropTypes.node,
  /**
   * The default icon displayed next to a end node. This is applied to all
   * tree nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultEndIcon: PropTypes.node,
  /**
   * Expanded node ids.
   * Used when the item's expansion are not controlled.
   * @default []
   */
  defaultExpanded: PropTypes.arrayOf(PropTypes.string),
  /**
   * The default icon used to expand the node.
   */
  defaultExpandIcon: PropTypes.node,
  /**
   * The default icon displayed next to a parent node. This is applied to all
   * parent nodes and can be overridden by the TreeItem `icon` prop.
   */
  defaultParentIcon: PropTypes.node,
  /**
   * Selected node ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelected: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable: PropTypes.bool,
  /**
   * If `true` selection is disabled.
   * @default false
   */
  disableSelection: PropTypes.bool,
  /**
   * Expanded node ids.
   * Used when the item's expansion are controlled.
   */
  expanded: PropTypes.arrayOf(PropTypes.string),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * If true `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: PropTypes.bool,
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onNodeFocus: PropTypes.func,
  /**
   * Callback fired when tree items are selected/unselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} nodeIds Ids of the selected nodes. When `multiSelect` is true
   * this is an array of strings; when false (default) a string.
   */
  onNodeSelect: PropTypes.func,
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeIds The ids of the expanded nodes.
   */
  onNodeToggle: PropTypes.func,
  /**
   * Selected node ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selected: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { TreeView };
