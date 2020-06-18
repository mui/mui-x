import React, { ReactNode } from 'react';
import { isFunction } from '../../utils';
import { PaginationProps } from './usePagination';
import { Columns, GridApiRef, GridOptions, GridRootRef, InternalColumns, Rows } from '../../models';

type ChildrenParams = [PaginationProps, Rows, Columns, GridOptions, GridApiRef, GridRootRef];
export type ChildFn = ((...props: ChildrenParams) => React.ReactNode) | null;

export type GridChildrenProp = React.ReactNode | ChildFn;

export const useChildren = (
  columns: InternalColumns,
  rows: Rows,
  options: GridOptions,
  paginationProps: PaginationProps,
  apiRef: GridApiRef,
  gridRootRef: GridRootRef,
  children?: GridChildrenProp,
) => {
  if (!children) {
    return null;
  }

  let footerChildNode: ReactNode;
  const childrenParams: ChildrenParams = [paginationProps, rows, columns.visible, options, apiRef, gridRootRef];

  if (children && isFunction(children)) {
    footerChildNode = children(...childrenParams);
  } else {
    footerChildNode = children;
  }

  return footerChildNode;
};
