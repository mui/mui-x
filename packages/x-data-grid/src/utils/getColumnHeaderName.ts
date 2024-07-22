import * as React from 'react';
import { GridColDef } from '../models/colDef';

export function getColumnHeaderName<T, S extends T>(
  col: GridColDef,
  filter: (node: T) => node is S,
  fallbackToField?: true,
): S | string;
export function getColumnHeaderName<T, S extends T>(
  col: GridColDef,
  filter: (node: T) => node is S,
  fallbackToField?: false,
): S | undefined;
export function getColumnHeaderName<T, S extends T>(
  col: GridColDef,
  filter: (node: T) => node is S,
  fallbackToField?: boolean,
): S | undefined;
export function getColumnHeaderName(
  col: GridColDef,
  filter: (node: React.ReactNode) => unknown,
  fallbackToField: boolean = true,
): React.ReactNode | undefined {
  const headerName = typeof col.headerName === 'function' ? col.headerName() : col.headerName;
  const isOk = filter(headerName);
  if (isOk) {
    return headerName ?? (fallbackToField ? col.field : undefined);
  }

  return fallbackToField ? col.field : undefined;
}

export const isStringHeaderName = (node: React.ReactNode): node is string =>
  typeof node === 'string';
export const isReactNodeHeaderName = (node: React.ReactNode): node is React.ReactNode => true;
