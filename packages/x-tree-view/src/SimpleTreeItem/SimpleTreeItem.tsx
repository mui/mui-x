import * as React from 'react';
import PropTypes from 'prop-types';
import useForkRef from '@mui/utils/useForkRef';
import unsupportedProp from '@mui/utils/unsupportedProp';
import elementTypeAcceptingRef from '@mui/utils/elementTypeAcceptingRef';
import {
  DescendantProvider,
  TreeItemDescendant,
  useDescendant,
} from '../internals/TreeViewProvider/DescendantProvider';
import { SimpleTreeItemProps } from './SimpleTreeItem.types';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { SimpleTreeViewPlugins } from '../SimpleTreeView/SimpleTreeView.plugins';
import { TreeItem } from '../TreeItem';

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [TreeItem API](https://mui.com/x/api/tree-view/tree-item/)
 */
export const SimpleTreeItem = React.forwardRef(function SimpleTreeItem(
  props: SimpleTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    children,
    disabled = false,
    label,
    nodeId,
    id,
    ContentProps: inContentProps,
    ...other
  } = props;

  const { instance } = useTreeViewContext<SimpleTreeViewPlugins>();

  const expandable = Boolean(Array.isArray(children) ? children.length : children);

  const [treeItemElement, setTreeItemElement] = React.useState<HTMLLIElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(setTreeItemElement, ref);

  const descendant = React.useMemo<TreeItemDescendant>(
    () => ({
      element: treeItemElement!,
      id: nodeId,
    }),
    [nodeId, treeItemElement],
  );

  const { index, parentId } = useDescendant(descendant);

  React.useEffect(() => {
    // On the first render a node's index will be -1. We want to wait for the real index.
    if (instance && index !== -1) {
      instance.insertJSXNode({
        id: nodeId,
        idAttribute: id,
        index,
        parentId,
        expandable,
        disabled,
      });

      return () => instance.removeJSXNode(nodeId);
    }

    return undefined;
  }, [instance, parentId, index, nodeId, expandable, disabled, id]);

  React.useEffect(() => {
    if (instance && label) {
      return instance.mapFirstCharFromJSX(
        nodeId,
        (contentRef.current?.textContent ?? '').substring(0, 1).toLowerCase(),
      );
    }
    return undefined;
  }, [instance, nodeId, label]);

  const ContentProps = {
    ...inContentProps,
    ref: contentRef,
  };

  return (
    <DescendantProvider id={nodeId}>
      <TreeItem
        {...other}
        ref={handleRef}
        ContentProps={ContentProps}
        label={label}
        nodeId={nodeId}
        id={id}
      >
        {children}
      </TreeItem>
    </DescendantProvider>
  );
});

SimpleTreeItem.propTypes = {
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
   * The icon used to collapse the node.
   */
  collapseIcon: PropTypes.node,
  /**
   * The component used for the content node.
   * @default TreeItemContent
   */
  ContentComponent: elementTypeAcceptingRef,
  /**
   * Props applied to ContentComponent.
   */
  ContentProps: PropTypes.object,
  /**
   * If `true`, the node is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * The icon displayed next to an end node.
   */
  endIcon: PropTypes.node,
  /**
   * The icon used to expand the node.
   */
  expandIcon: PropTypes.node,
  /**
   * The icon to display next to the tree node's label.
   */
  icon: PropTypes.node,
  /**
   * The tree node label.
   */
  label: PropTypes.node,
  /**
   * The id of the node.
   */
  nodeId: PropTypes.any.isRequired,
  /**
   * This prop isn't supported.
   * Use the `onNodeFocus` callback on the tree if you need to monitor a node's focus.
   */
  onFocus: unsupportedProp,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The component used for the transition.
   * [Follow this guide](/material-ui/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   * @default Collapse
   */
  TransitionComponent: PropTypes.elementType,
  /**
   * Props applied to the transition element.
   * By default, the element is based on this [`Transition`](http://reactcommunity.org/react-transition-group/transition/) component.
   */
  TransitionProps: PropTypes.object,
} as any;
