/**
 * Method used to insert specific React nodes after a node
 * in column menu items list
 *
 * @param {React.ReactNode[]} initialNodes actual array of nodes
 * @param {React.ReactNode[]} noesToInsert new nodes to be inserted
 * @param {string} afterComponentName name of the component/node after which the nodes should be inserted
 * @returns {React.ReactNode[]} newArray with updated nodes
 */
export const insertItemsInMenu = (
  initialNodes: React.ReactNode[],
  nodesToInsert: React.ReactNode[],
  afterComponentName: string,
) =>
  // TODO: Fix typing
  initialNodes.reduce((finalItems, item: any) => {
    if (item?.type?.name === afterComponentName) {
      return [...finalItems, item, ...nodesToInsert];
    }
    return [...finalItems, item];
  }, [] as any);
