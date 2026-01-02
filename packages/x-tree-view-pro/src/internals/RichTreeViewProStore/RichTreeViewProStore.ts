import { ExtendableRichTreeViewStore } from '@mui/x-tree-view/internals';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import { RichTreeViewProStoreParameters, RichTreeViewProState } from './RichTreeViewProStore.types';
import { TreeViewLazyLoadingPlugin } from '../plugins/lazyLoading';
import { TreeViewItemsReorderingPlugin } from '../plugins/itemsReordering';
import { parametersToStateMapper } from './RichTreeViewProStore.utils';

export class RichTreeViewProStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtendableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewProState<R, Multiple>,
  RichTreeViewProStoreParameters<R, Multiple>
> {
  public lazyLoading: TreeViewLazyLoadingPlugin;

  public itemsReordering = new TreeViewItemsReorderingPlugin(this);

  public constructor(parameters: RichTreeViewProStoreParameters<R, Multiple>) {
    super(parameters, 'RichTreeViewPro', parametersToStateMapper);

    this.lazyLoading = new TreeViewLazyLoadingPlugin(this);
  }

  public buildPublicAPI() {
    return {
      ...super.buildPublicAPI(),
      ...this.lazyLoading.buildPublicAPI(),
    };
  }
}
