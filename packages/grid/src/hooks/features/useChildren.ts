import React, { ReactNode } from 'react';
import { isFunction, isObject } from '../../utils';
import { PaginationProps } from './usePagination';
import { Columns, GridOptions, InternalColumns, Rows } from '../../models';
import { GridApiRef, GridRootRef } from '../../grid';

type ChildrenParams = [PaginationProps, Rows, Columns, GridOptions, GridApiRef, GridRootRef];
export type ChildFn = ((...props: ChildrenParams) => React.ReactNode) | null;
export interface NamedChildrenMap {
  header?: ChildFn;
  footer?: ChildFn;
}

export const isNamedChildrenMap = (children: any): children is NamedChildrenMap =>
  isObject(children) && (children.footer != null || children.header != null);

export type GridChildrenProp = React.ReactNode | ChildFn | NamedChildrenMap;

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
    return [null, null];
  }

  let footerChildNode: ReactNode;
  let headerChildNode: ReactNode = null;
  const childrenParams: ChildrenParams = [paginationProps, rows, columns.visible, options, apiRef, gridRootRef];

  if (children && isFunction(children)) {
    footerChildNode = children(...childrenParams);
  } else if (children && isNamedChildrenMap(children)) {
    footerChildNode = children.footer ? children.footer(...childrenParams) : null;
    headerChildNode = children.header ? children.header(...childrenParams) : null;
  } else {
    footerChildNode = children;
  }

  return [footerChildNode, headerChildNode];
};
