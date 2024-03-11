import { TreeViewAnyPluginSignature, TreeViewUsedParams } from '@mui/x-tree-view/internals/models';

export type DescribeTreeViewTestRunner<TPlugin extends TreeViewAnyPluginSignature> = (
  params: DescribeTreeViewTestRunnerParams<TPlugin>,
) => void;

export interface DescribeTreeViewTestRunnerReturnValue<TPlugin extends TreeViewAnyPluginSignature> {
  setProps: (props: Partial<TreeViewUsedParams<TPlugin>>) => void;
  getItemRoot: (id: string) => HTMLElement;
}

export type DescribeTreeViewItemsRenderer<TPlugin extends TreeViewAnyPluginSignature> = <
  R extends {},
>(
  params: {
    items: R[];
  } & TreeViewUsedParams<TPlugin>,
) => DescribeTreeViewTestRunnerReturnValue<TPlugin>;

interface DescribeTreeViewTestRunnerParams<TPlugin extends TreeViewAnyPluginSignature> {
  renderItems: DescribeTreeViewItemsRenderer<TPlugin>;
}
