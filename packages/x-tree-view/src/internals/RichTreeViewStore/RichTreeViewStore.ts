import type { TreeViewValidItem } from '../../models';
import { MinimalTreeViewStore } from '../MinimalTreeViewStore';
import { TreeViewLabelEditingPlugin } from '../plugins/labelEditing';
import type { RichTreeViewState, RichTreeViewStoreParameters } from './RichTreeViewStore.types';
import { parametersToStateMapper } from './RichTreeViewStore.utils';

export class ExtendableRichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  State extends RichTreeViewState<R, Multiple> = RichTreeViewState<R, Multiple>,
  Parameters extends RichTreeViewStoreParameters<R, Multiple> = RichTreeViewStoreParameters<
    R,
    Multiple
  >,
> extends MinimalTreeViewStore<R, Multiple, State, Parameters> {
  public labelEditing = new TreeViewLabelEditingPlugin(this);

  /**
   * Mapper of the RichTreeViewStore.
   * Can be used by classes extending the RichTreeViewStore to create their own mapper.
   */
  public static rawMapper = parametersToStateMapper;

  public buildPublicAPI() {
    return {
      ...super.buildPublicAPI(),
      ...this.labelEditing.buildPublicAPI(),
      // `addItems` is not exposed on the Simple Tree View, where the items are defined with JSX.
      addItems: this.items.addItems,
    };
  }
}

export class RichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtendableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewState<R, Multiple>,
  RichTreeViewStoreParameters<R, Multiple>
> {
  public constructor(parameters: RichTreeViewStoreParameters<R, Multiple>) {
    super(parameters, 'RichTreeView', parametersToStateMapper);
  }
}
