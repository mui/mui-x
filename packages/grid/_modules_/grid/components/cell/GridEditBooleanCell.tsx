import * as React from 'react';
import clsx from 'clsx';
import Checkbox from '@mui/material/Checkbox';
import { unstable_useId as useId } from '@mui/material/utils';
import { composeClasses, useEnhancedEffect } from '../../utils/material-ui-utils';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridComponentProps } from '../../GridComponentProps';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editBooleanCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridEditBooleanCell(
  props: GridRenderEditCellParams &
    React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
) {
  const {
    id: idProp,
    value,
    formattedValue,
    api,
    field,
    row,
    rowNode,
    colDef,
    cellMode,
    isEditable,
    tabIndex,
    className,
    getValue,
    hasFocus,
    ...other
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const id = useId();
  const [valueState, setValueState] = React.useState(value);
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;
      setValueState(newValue);
      api.setEditCellValue({ id: idProp, field, value: newValue }, event);
    },
    [api, field, idProp],
  );

  React.useEffect(() => {
    setValueState(value);
  }, [value]);

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current!.focus();
    }
  }, [hasFocus]);

  return (
    <label htmlFor={id} className={clsx(classes.root, className)} {...other}>
      <Checkbox
        id={id}
        inputRef={inputRef}
        checked={Boolean(valueState)}
        onChange={handleChange}
        size="small"
      />
    </label>
  );
}
export const renderEditBooleanCell = (params) => <GridEditBooleanCell {...params} />;
