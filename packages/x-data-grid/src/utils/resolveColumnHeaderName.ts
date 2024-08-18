import * as React from 'react';
import { GridColDef } from '../models/colDef';

export function resolveColumnHeaderName<T, S extends T>(
  headerName: GridColDef['headerName'],
  filter: (node: T) => node is S,
): S | undefined;
export function resolveColumnHeaderName(
  headerName: GridColDef['headerName'],
  filter: (node: React.ReactNode) => unknown,
): React.ReactNode | undefined {
  const resolvedHeaderName = typeof headerName === 'function' ? headerName() : headerName;
  const isOk = filter(resolvedHeaderName);
  if (isOk) {
    return resolvedHeaderName;
  }
  return undefined;
}

export const isStringHeaderName = (node: React.ReactNode): node is string =>
  typeof node === 'string';
export const isReactNodeHeaderName = (node: React.ReactNode): node is React.ReactNode => true;
