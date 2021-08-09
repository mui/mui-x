import * as React from 'react';
import Select, { SelectProps } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GridCellParams } from '../../models/params/gridCellParams';
import { isEscapeKey } from '../../utils/keyboardUtils';
import { useEnhancedEffect } from '../../utils/material-ui-utils';

const renderSingleSelectOptions = (option) =>
  typeof option === 'object' ? (
    <MenuItem key={option.value} value={option.value}>
      {option.label}
    </MenuItem>
  ) : (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  );

export function GridEditSingleSelectCell(props: GridCellParams & SelectProps) {
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
    className,
    getValue,
    hasFocus,
    ...other
  } = props;

  const ref = React.useRef<any>();

  const handleChange = (event) => {
    api.setEditCellValue({ id, field, value: event.target.value }, event);
    if (!event.key) {
      api.commitCellChange({ id, field }, event);
      api.setCellMode(id, field, 'view');
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || isEscapeKey(event.key)) {
      api.setCellMode(id, field, 'view');
    }
  };

  useEnhancedEffect(() => {
    if (hasFocus) {
      // TODO v5: replace with inputRef.current.focus()
      // See https://github.com/mui-org/material-ui/issues/21441
      ref.current.querySelector('[role="button"]').focus();
    }
  }, [hasFocus]);

  return (
    <Select
      ref={ref}
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      fullWidth
      open
      {...other}
    >
      {colDef.valueOptions?.map(renderSingleSelectOptions)}
    </Select>
  );
}
export const renderEditSingleSelectCell = (params) => <GridEditSingleSelectCell {...params} />;
