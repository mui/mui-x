import * as React from 'react';
import {
  GridColDef,
  GridColumnHeaderParams,
  GridColumnHeaderTitle,
  useGridApiContext,
  useGridSelector,
  gridVisibleColumnFieldsSelector,
} from '@mui/x-data-grid';

function Alphabet(props: Pick<GridColDef, 'field'>) {
  const apiRef = useGridApiContext();
  const visibleColumnFields = useGridSelector(
    apiRef,
    gridVisibleColumnFieldsSelector,
  );
  const index = visibleColumnFields.indexOf(props.field);
  return (
    <span style={{ color: 'gray', paddingRight: 4 }}>
      {String.fromCharCode(64 + index)}
    </span>
  );
}

export function TitleWithAlphabet(props: GridColumnHeaderParams) {
  const { colDef, field } = props;
  const label = colDef.headerName ?? field;
  return (
    <React.Fragment>
      <Alphabet field={field} />
      <GridColumnHeaderTitle
        label={label}
        description={colDef.description}
        columnWidth={colDef.computedWidth}
      />
    </React.Fragment>
  );
}
