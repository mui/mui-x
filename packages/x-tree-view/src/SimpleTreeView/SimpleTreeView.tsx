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
  position: 'relative',
});

type SimpleTreeViewComponent = (<Multiple extends boolean | undefined = undefined>(
  props: SimpleTreeViewProps<Multiple> & React.RefAttributes<HTMLUListElement>,
) => React.JSX.Element) & { propTypes?: any };

const EMPTY_ITEMS: any[] = [];

const itemsPropWarning = buildWarning([
  'MUI X: The `SimpleTreeView` component does not support the `items` prop.',
  'If you want to add items, you need to pass them as JSX children.',
  'Check the documentation for more details: https://mui.com/x/react-tree-view/simple-tree-view/items/',
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
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows Tree View manipulation. Can be instantiated with `useTreeViewApiRef()`.
   */
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      focusItem: PropTypes.func.isRequired,
      getItem: PropTypes.func.isRequired,
      setItemExpansion: PropTypes.func.isRequired,
    }),
  }),
  /**
   * If `true`, the tree view renders a checkbox at the left of its label that allows selecting it.
   * @default false
   */
  checkboxSelection: PropTypes.bool,
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
   * Expanded item ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedItems: PropTypes.arrayOf(PropTypes.string),
  /**
   * Selected item ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedItems: PropTypes.any,
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
   * Expanded item ids.
   * Used when the item's expansion is controlled.
   */
  expandedItems: PropTypes.arrayOf(PropTypes.string),
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`,
   * the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures: PropTypes.shape({
    indentationAtItemLevel: PropTypes.bool,
  }),
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id: PropTypes.string,
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * If `true`, `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect: PropTypes.bool,
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange: PropTypes.func,
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle: PropTypes.func,
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
   * @param {string} value of the focused item.
   */
  onItemFocus: PropTypes.func,
  /**
   * Callback fired when a tree item is selected or deselected.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle: PropTypes.func,
  /**
   * Callback fired when tree items are selected/deselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange: PropTypes.func,
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems: PropTypes.any,
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
