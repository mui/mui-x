import { GridContainerProps, GridOptions } from '../models';

// TODO Move that to renderContext and delete this
export const getTotalHeight = (
  options: GridOptions,
  containerSizes: GridContainerProps | null,
  height: number,
) => {
  if (!options.autoHeight) {
    return height;
  }

  const dataContainerHeight = (containerSizes && containerSizes.dataContainerSizes!.height) || 0;
  let dataHeight = dataContainerHeight;
  if (dataHeight < options.rowHeight) {
    dataHeight = options.rowHeight * 2; // If we have no rows, we give the size of 2 rows to display the no rows overlay
  }

  return options.headerHeight + dataHeight;
};
