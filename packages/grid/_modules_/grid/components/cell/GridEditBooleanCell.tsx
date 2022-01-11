import * as React from 'react';
import clsx from 'clsx';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import {
  unstable_useId as useId,
  unstable_useEnhancedEffect as useEnhancedEffect,
} from '@mui/material/utils';
import { getDataGridUtilityClass } from '../../gridClasses';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['editBooleanCell'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridEditBooleanCell(
  props: GridRenderEditCellParams &
    Omit<
      React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
      'id'
    >,
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
      <rootProps.components.BaseCheckbox
        id={id}
        inputRef={inputRef}
        checked={Boolean(valueState)}
        onChange={handleChange}
        size="small"
        {...rootProps.componentsProps?.baseCheckbox}
      />
    </label>
  );
}
export const renderEditBooleanCell = (params) => <GridEditBooleanCell {...params} />;
