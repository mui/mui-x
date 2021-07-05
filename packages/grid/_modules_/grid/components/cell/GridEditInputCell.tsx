import * as React from 'react';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridEditInputCell(props: GridCellParams & InputBaseProps) {
  const {
    id,
    value,
    formattedValue,
    api,
    field,
    row,
    colDef,
    cellMode,
    isEditable,
    hasFocus,
    getValue,
    ...other
  } = props;

  const [valueState, setValueState] = React.useState(value);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      const editProps = { value: newValue };
      setValueState(newValue);
      api.setEditCellProps({ id, field, props: editProps });
    },
    [api, field, id],
  );

  return (
    <InputBase
      autoFocus
      className="MuiDataGrid-editInputCell"
      fullWidth
      type={colDef.type === 'number' ? colDef.type : 'text'}
      value={valueState || ''}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditInputCell = (params) => <GridEditInputCell {...params} />;
