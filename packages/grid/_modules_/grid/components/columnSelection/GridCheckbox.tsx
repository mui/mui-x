import * as React from 'react';
import { GridCellCheckboxRenderer } from './GridCellCheckboxRenderer';
import { GridHeaderCheckbox } from './GridHeaderCheckbox';
import { GridCheckboxHeaderOrCellProps } from './GridCheckboxHeaderOrCell';

export const GridCheckbox = (props: GridCheckboxHeaderOrCellProps) => {
  const { headerParams, cellParams } = props;
  return headerParams ? (
    <GridHeaderCheckbox {...headerParams} />
  ) : (
    <GridCellCheckboxRenderer {...cellParams!} />
  );
};
