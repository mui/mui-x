import { EMPTY_OBJECT } from '@base-ui-components/utils/empty';
import { TreeViewValidItem } from '../../models';
import { getExpansionTrigger } from '../plugins/useTreeViewExpansion/useTreeViewExpansion.utils';
import { TreeViewParameters } from './TreeViewStore.types';

/**
 * Returns the properties of the state that are derived from the parameters.
 * This do not contain state properties that don't update whenever the parameters update.
 */
export function deriveStateFromParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
>(parameters: TreeViewParameters<R, Multiple>) {
  return {
    disabledItemsFocusable: parameters.disabledItemsFocusable ?? false,
    domStructure: 'nested' as const,
    providedTreeId: parameters.id,
    // TODO: Fix
    expansionTrigger: getExpansionTrigger({
      isItemEditable: parameters.isItemEditable,
      expansionTrigger: parameters.expansionTrigger,
    }),
    disableSelection: parameters.disableSelection ?? false,
    multiSelect: parameters.multiSelect ?? false,
    checkboxSelection: parameters.checkboxSelection ?? false,
    selectionPropagation: parameters.selectionPropagation ?? EMPTY_OBJECT,
  };
}

export function applyModelInitialValue<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  fallback: T,
): T {
  if (controlledValue !== undefined) {
    return controlledValue;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  return fallback;
}
