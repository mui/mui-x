import * as React from 'react';
import { GridCellCheckboxRenderer } from '../../components/columnSelection/GridCellCheckboxRenderer';
import { GridHeaderCheckbox } from '../../components/columnSelection/GridHeaderCheckbox';
import { GridCheckboxHeaderOrCellProps } from './GridCheckboxHeaderOrCellProps';

export const GridCheckbox = (props: GridCheckboxHeaderOrCellProps) => {
  const { headerParams, cellParams } = props;
  return headerParams ? (
    <GridHeaderCheckbox {...headerParams} />
  ) : (
    <GridCellCheckboxRenderer {...cellParams!} />
  );
};
