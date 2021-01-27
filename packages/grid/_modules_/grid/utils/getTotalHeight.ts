import { ContainerProps, GridOptions } from '../models';

// TODO Move that to renderContext and delete this
export const getCurryTotalHeight = (
  internalOptions: GridOptions,
  containerSizes: ContainerProps | null,
) => (size: any) => {
  const dataContainerHeight = (containerSizes && containerSizes.dataContainerSizes!.height) || 0;
  if (!internalOptions.autoHeight) {
    return size.height;
  }
  let dataHeight = dataContainerHeight;
  if (dataHeight < internalOptions.rowHeight) {
    dataHeight = internalOptions.rowHeight * 2; // If we have no rows, we give the size of 2 rows to display the no rows overlay
  }

  return dataHeight + internalOptions.headerHeight;
};
