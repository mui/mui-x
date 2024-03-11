export type DescribeTreeViewTestRunner = (params: DescribeTreeViewTestRunnerParams) => void;

export type DescribeTreeViewNodesRenderer = <R extends {}>(params: { items: R[] }) => void;

interface DescribeTreeViewTestRunnerParams {
  renderNodes: DescribeTreeViewNodesRenderer;
}
