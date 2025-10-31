import { TreeViewItemId, TreeViewSelectionPropagation, TreeViewValidItem } from '../../models';
import { TreeViewItemMeta } from '../models';

export interface MinimalTreeViewState<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> {
  /**
   * If `true`, will allow focus on disabled items.
   * Always equal to `props.disabledItemsFocusable` (or `false` if not provided).
   */
  disabledItemsFocusable: boolean;
  /**
   * Model of each item as provided by `props.items` or by imperative items updates.
   * It is not updated when properties derived from the model are updated:
   * - when the label of an item is updated, `itemMetaLookup` is updated, not `itemModelLookup`.
   * - when the children of an item are updated, `itemOrderedChildrenIdsLookup` and `itemChildrenIndexesLookup` are updated, not `itemModelLookup`.
   * This means that the `children`, `label` or `id` properties of an item model should never be used directly, always use the structured sub-states instead.
   */
  itemModelLookup: { [itemId: string]: R };
  /**
   * Meta data of each item.
   */
  itemMetaLookup: { [itemId: string]: TreeViewItemMeta };
  /**
   * Ordered children ids of each item.
   */
  itemOrderedChildrenIdsLookup: { [parentItemId: string]: TreeViewItemId[] };
  /**
   * Index of each child in the ordered children ids of its parent.
   */
  itemChildrenIndexesLookup: { [parentItemId: string]: { [itemId: string]: number } };
  /**
   * When equal to 'flat', the tree is rendered as a flat list (children are rendered as siblings of their parents).
   * When equal to 'nested', the tree is rendered with nested children (children are rendered inside the groupTransition slot of their children).
   * Nested DOM structure is not compatible with collapse / expansion animations.
   */
  domStructure: 'flat' | 'nested';
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   */
  itemChildrenIndentation: string | number;
  /**
   * The id of the Tree View as provided by the `id` parameter.
   */
  providedTreeId: string | undefined;
  /**
   * The id of the Tree View used for accessibility attributes.
   */
  treeId: string | undefined;
  /**
   * The ids of the items currently expanded.
   */
  expandedItems: TreeViewItemId[];
  /**
   * The slot that triggers the item's expansion when clicked.
   */
  expansionTrigger: 'content' | 'iconContainer';

  selectedItems: TreeViewSelectionValue<Multiple>;
  /**
   * Whether selection is disabled.
   */
  disableSelection: boolean;
  /**
   * Whether multi-selection is enabled.
   */
  multiSelect: boolean;
  /**
   * Whether the Tree View renders a checkbox at the left of its label that allows selecting it.
   */
  checkboxSelection: boolean;
  /**
   * The selection propagation behavior.
   */
  selectionPropagation: TreeViewSelectionPropagation;
  /**
   * The id of the currently focused item.
   */
  focusedItemId: string | null;
}

export interface MinimalTreeViewParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> {
  /**
   * Whether the layout is right-to-left.
   */
  isRtl: boolean;
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable?: boolean;
  items: readonly R[];
  /**
   * Used to determine if a given item should be disabled.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item should be disabled.
   */
  isItemDisabled?: (item: R) => boolean;
  /**
   * Used to determine the string label for a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The label of the item.
   * @default (item) => item.label
   */
  getItemLabel?: (item: R) => string;
  /**
   * Used to determine the children of a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {R[]} The children of the item.
   * @default (item) => item.children
   */
  getItemChildren?: (item: R) => R[] | undefined;
  /**
   * Used to determine the id of a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The id of the item.
   * @default (item) => item.id
   */
  getItemId?: (item: R) => TreeViewItemId;
  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the focused item.
   */
  onItemClick?: (event: React.MouseEvent, itemId: string) => void;
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation?: string | number;
  /**
   * This prop is used to help implement the accessibility logic.
   * If you don't provide this prop. It falls back to a randomly generated id.
   */
  id?: string;
  /**
   * Expanded item ids.
   * Used when the item's expansion is controlled.
   */
  expandedItems?: string[];
  /**
   * Expanded item ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedItems?: string[];
  /**
   * Callback fired when Tree Items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange?: (event: React.SyntheticEvent | null, itemIds: string[]) => void;
  /**
   * Callback fired when a Tree Item is expanded or collapsed.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
   * @param {array} itemId The itemId of the modified item.
   * @param {boolean} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle?: (
    event: React.SyntheticEvent | null,
    itemId: string,
    isExpanded: boolean,
  ) => void;
  /**
   * The slot that triggers the item's expansion when clicked.
   * @default 'content'
   */
  expansionTrigger?: 'content' | 'iconContainer';
  /**
   * Whether selection is disabled.
   * @default false
   */
  disableSelection?: boolean;
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems?: TreeViewSelectionValue<Multiple>;
  /**
   * Selected item ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedItems?: TreeViewSelectionValue<Multiple>;
  /**
   * If `true`, `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect?: Multiple;
  /**
   * Whether the Tree View renders a checkbox at the left of its label that allows selecting it.
   * @default false
   */
  checkboxSelection?: boolean;
  /**
   * When `selectionPropagation.descendants` is set to `true`.
   *
   * - Selecting a parent selects all its descendants automatically.
   * - Deselecting a parent deselects all its descendants automatically.
   *
   * When `selectionPropagation.parents` is set to `true`.
   *
   * - Selecting all the descendants of a parent selects the parent automatically.
   * - Deselecting a descendant of a selected parent deselects the parent automatically.
   *
   * Only works when `multiSelect` is `true`.
   * On the <SimpleTreeView />, only the expanded items are considered (since the collapsed item are not passed to the Tree View component at all)
   *
   * @default { parents: false, descendants: false }
   */
  selectionPropagation?: TreeViewSelectionPropagation;
  /**
   * Callback fired when Tree Items are selected/deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemSelection()` method.
   * @param {string[] | string} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange?: (
    event: React.SyntheticEvent | null,
    itemIds: TreeViewSelectionValue<Multiple>,
  ) => void;
  /**
   * Callback fired when a Tree Item is selected or deselected.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemSelection()` method.
   * @param {array} itemId The itemId of the modified item.
   * @param {boolean} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle?: (
    event: React.SyntheticEvent | null,
    itemId: string,
    isSelected: boolean,
  ) => void;
  /**
   * Callback fired when a given Tree Item is focused.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
   */
  onItemFocus?: (event: React.SyntheticEvent | null, itemId: string) => void;
}

/**
 * Mapper between a Tree View instance's state and parameters.
 * Used by classes extending `TreeViewStore` to manage the state based on the parameters.
 */
export interface TreeViewParametersToStateMapper<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  State extends MinimalTreeViewState<R, Multiple>,
  Parameters extends MinimalTreeViewParameters<R, Multiple>,
> {
  getInitialState: (
    treeViewInitialState: MinimalTreeViewState<R, Multiple>,
    parameters: Parameters,
  ) => State;

  updateStateFromParameters: (
    newState: Partial<MinimalTreeViewState<R, Multiple>>,
    parameters: Parameters,
    updateModel: TreeViewModelUpdater<State, Parameters>,
  ) => Partial<State>;
  shouldIgnoreItemsStateUpdate: (parameters: Parameters) => boolean;
}

export type TreeViewModelUpdater<
  State extends MinimalTreeViewState<any, any>,
  Parameters extends MinimalTreeViewParameters<any, any>,
> = (
  newState: Partial<State>,
  controlledProp: keyof Parameters & keyof State & string,
  defaultProp: keyof Parameters,
) => void;

export type TreeViewSelectionValue<Multiple extends boolean | undefined> = Multiple extends true
  ? Multiple extends false
    ? // Multiple === boolean, the type cannot be simplified further
      string | null | string[]
    : // Multiple === true, the selection is multiple
      string[]
  : // Multiple === false | undefined, the selection is single
    string | null;
