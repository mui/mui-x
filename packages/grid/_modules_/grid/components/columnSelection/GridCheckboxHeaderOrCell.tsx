import * as React from 'react';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';
import { GridCellParams } from '../../models/params/gridCellParams';
import { GridApiContext } from '../GridApiContext';

export interface GridCheckboxHeaderOrCellProps {
  headerParams?: GridColumnHeaderParams;
  cellParams?: GridCellParams;
}

export const GridCheckboxHeaderOrCell = (props: GridCheckboxHeaderOrCellProps) => {
  const { headerParams, cellParams } = props;
  const apiRef = React.useContext(GridApiContext);
  const CheckboxComponent = apiRef?.current.components.Checkbox;
  return (
    <React.Fragment>
      {CheckboxComponent && (
        <CheckboxComponent
          headerParams={headerParams}
          cellParams={cellParams}
          {...apiRef?.current.componentsProps?.checkbox}
        />
      )}
    </React.Fragment>
  );
};
