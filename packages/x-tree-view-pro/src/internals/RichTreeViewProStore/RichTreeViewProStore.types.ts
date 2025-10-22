import { DataSource, RichTreeViewParameters, RichTreeViewState } from '@mui/x-tree-view/internals';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import { DataSourceCache } from '@mui/x-tree-view/utils';

export interface RichTreeViewProState<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewState<R, Multiple> {}

export interface RichTreeViewProParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewParameters<R, Multiple> {
  /**
   * The data source object.
   */
  dataSource?: DataSource<R>;
  /**
   * The data source cache object.
   */
  dataSourceCache?: DataSourceCache;
}
