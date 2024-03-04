import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import { getSimpleTreeViewUtilityClass } from './simpleTreeViewClasses';
import {
  SimpleTreeViewProps,
  SimpleTreeViewSlotProps,
  SimpleTreeViewSlots,
} from './SimpleTreeView.types';
import { useTreeView } from '../internals/useTreeView';
import { TreeViewProvider } from '../internals/TreeViewProvider';
import { SIMPLE_TREE_VIEW_PLUGINS } from './SimpleTreeView.plugins';
import { buildWarning } from '../internals/utils/warning';
import { extractPluginParamsFromProps } from '../internals/utils/extractPluginParamsFromProps';

const useUtilityClasses = <Multiple extends boolean | undefined>(
  ownerState: SimpleTreeViewProps<Multiple>,
) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getSimpleTreeViewUtilityClass, classes);
};

export const SimpleTreeViewRoot = styled('ul', {
  name: 'MuiSimpleTreeView',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: SimpleTreeViewProps<any> }>({
  padding: 0,
  margin: 0,
  listStyle: 'none',
  outline: 0,
});

type SimpleTreeViewComponent = (<Multiple extends boolean | undefined = undefined>(
  props: SimpleTreeViewProps<Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

const EMPTY_ITEMS: any[] = [];

const itemsPropWarning = buildWarning([
  'MUI X: The `SimpleTreeView` component does not support the `items` prop.',
  'If you want to add items, you need to pass them as JSX children.',
  'Check the documentation for more details: https://next.mui.com/x/react-tree-view/simple-tree-view/items/',
]);

/**
 *
 * Demos:
 *
 * - [Tree View](https://mui.com/x/react-tree-view/)
 *
 * API:
 *
 * - [SimpleTreeView API](https://mui.com/x/api/tree-view/simple-tree-view/)
 */
const SimpleTreeView = React.forwardRef(function SimpleTreeView<
  Multiple extends boolean | undefined = undefined,
>(inProps: SimpleTreeViewProps<Multiple>, ref: React.Ref<HTMLUListElement>) {
  const props = useThemeProps({ props: inProps, name: 'MuiSimpleTreeView' });
  const ownerState = props as SimpleTreeViewProps<any>;

  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).items != null) {
      itemsPropWarning();
    }
  }

  const { pluginParams, slots, slotProps, otherProps } = extractPluginParamsFromProps<
    typeof SIMPLE_TREE_VIEW_PLUGINS,
    SimpleTreeViewSlots,
    SimpleTreeViewSlotProps,
    SimpleTreeViewProps<Multiple> & { items: any }
  >({
    props: { ...props, items: EMPTY_ITEMS },
    plugins: SIMPLE_TREE_VIEW_PLUGINS,
    rootRef: ref,
  });

  const { getRootProps, contextValue } = useTreeView(pluginParams);

  const classes = useUtilityClasses(props);

  const Root = slots?.root ?? SimpleTreeViewRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: otherProps,
    className: classes.root,
    getSlotProps: getRootProps,
    ownerState,
  });

  return (
    <TreeViewProvider value={contextValue}>
      <Root {...rootProps} />
    </TreeViewProvider>
  );
}) as SimpleTreeViewComponent;

SimpleTreeView.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      focusNode: PropTypes.func.isRequired,
      getItem: PropTypes.func.isRequired,
    }),
  }),
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Expanded node ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedNodes: PropTypes.arrayOf(PropTypes.string),
  /**
   * Selected node ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedNodes: PropTypes.any,
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
   * Used when the item's expansion is controlled.
   */
  expandedNodes: PropTypes.arrayOf(PropTypes.string),
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
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeIds The ids of the expanded nodes.
   */
  onExpandedNodesChange: PropTypes.func,
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeId The nodeId of the modified node.
   * @param {array} isExpanded `true` if the node has just been expanded, `false` if it has just been collapsed.
   */
  onNodeExpansionToggle: PropTypes.func,
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onNodeFocus: PropTypes.func,
  /**
   * Callback fired when a tree item is selected or deselected.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeId The nodeId of the modified node.
   * @param {array} isSelected `true` if the node has just been selected, `false` if it has just been deselected.
   */
  onNodeSelectionToggle: PropTypes.func,
  /**
   * Callback fired when tree items are selected/deselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} nodeIds The ids of the selected nodes.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedNodesChange: PropTypes.func,
  /**
   * Selected node ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedNodes: PropTypes.any,
  /**
   * The props used for each component slot.
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { SimpleTreeView };
