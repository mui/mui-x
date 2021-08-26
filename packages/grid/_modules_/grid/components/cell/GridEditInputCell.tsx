import * as React from 'react';
import clsx from 'clsx';
import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import { GridRenderEditCellParams } from '../../models/params/gridCellParams';
import { useEnhancedEffect } from '../../utils/material-ui-utils';
import { gridClasses } from '../../gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridEditInputCell(props: GridRenderEditCellParams & InputBaseProps) {
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
    tabIndex,
    hasFocus,
    getValue,
    ...other
  } = props;

  const inputRef = React.useRef<HTMLInputElement>();
  const [valueState, setValueState] = React.useState(value);
  const rootProps = useGridRootProps();

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      setValueState(newValue);
      api.setEditCellValue({ id, field, value: newValue }, event);
    },
    [api, field, id],
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
    <InputBase
      inputRef={inputRef}
      className={clsx(gridClasses.editInputCell, rootProps.classes?.editInputCell)}
      fullWidth
      type={colDef.type === 'number' ? colDef.type : 'text'}
      value={valueState || ''}
      onChange={handleChange}
      {...other}
    />
  );
}
export const renderEditInputCell = (params) => <GridEditInputCell {...params} />;
