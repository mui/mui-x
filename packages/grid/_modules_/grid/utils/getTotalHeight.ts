import * as React from 'react';
import { ContainerProps, GridOptions } from '../models';

// TODO Move that to renderContext and delete this
export const getCurryTotalHeight = (
  internalOptions: GridOptions,
  containerSizes: ContainerProps | null,
  headerRef: React.RefObject<HTMLDivElement>,
  footerRef: React.RefObject<HTMLDivElement>,
) => (size: any) => {
  const dataContainerHeight = (containerSizes && containerSizes.dataContainerSizes!.height) || 0;
  if (!internalOptions.autoHeight) {
    return size.height;
  }
  const footerHeight = (footerRef.current && footerRef.current.getBoundingClientRect().height) || 0;
  const headerHeight = (headerRef.current && headerRef.current.getBoundingClientRect().height) || 0;
  let dataHeight = dataContainerHeight;
  if (dataHeight < internalOptions.rowHeight) {
    dataHeight = internalOptions.rowHeight * 2; // If we have no rows, we give the size of 2 rows to display the no rows overlay
  }

  return headerHeight + footerHeight + dataHeight + internalOptions.headerHeight;
};
