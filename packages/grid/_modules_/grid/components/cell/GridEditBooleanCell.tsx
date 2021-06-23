import * as React from 'react';
import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';
// @ts-expect-error fixed in Material-UI v5, types definitions were added.
import { unstable_useId as useId } from '@material-ui/core/utils';
import { GridCellParams } from '../../models/params/gridCellParams';

export function GridEditBooleanCell(
  props: GridCellParams &
    React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
) {
  const {
    id: idProp,
    value,
    formattedValue,
    api,
    field,
    row,
    colDef,
    cellMode,
    isEditable,
    className,
    getValue,
    hasFocus,
    ...other
  } = props;

  const id = useId();
  const [valueState, setValueState] = React.useState(value);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      const editProps = { value: newValue };
      setValueState(newValue);
      api.setEditCellProps({ id: idProp, field, props: editProps });
    },
    [api, field, idProp],
  );

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  return (
    <label htmlFor={id} className={clsx('MuiDataGrid-editBooleanCell', className)} {...other}>
      <Checkbox
        autoFocus
        id={id}
        checked={Boolean(valueState)}
        onChange={handleChange}
        size="small"
      />
    </label>
  );
}
export const renderEditBooleanCell = (params) => <GridEditBooleanCell {...params} />;
