import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { SelectionChangeParams } from '../models/params/selectionChangeParams';
import { ColParams } from '../models/params/colParams';
import { CellParams } from '../models/params/cellParams';

export const HeaderCheckbox: React.FC<ColParams> = React.memo(({ api }) => {
  const [isChecked, setChecked] = React.useState(false);
  const [isIndeterminate, setIndeterminate] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    api.selectRows(api.getAllRowIds(), checked);
  };
  const selectionChange = React.useCallback(
    (event: SelectionChangeParams) => {
      const isAllSelected =
        api.getAllRowIds().length === event.rows.length && event.rows.length > 0;
      const hasNoneSelected = event.rows.length === 0;
      setChecked(isAllSelected || !hasNoneSelected);
      setIndeterminate(!isAllSelected && !hasNoneSelected);
    },
    [api, setIndeterminate, setChecked],
  );

  React.useEffect(() => {
    return api.onSelectionChange(selectionChange);
  }, [api, selectionChange]);

  return (
    <Checkbox
      indeterminate={isIndeterminate}
      checked={isChecked}
      onChange={handleChange}
      className="MuiDataGrid-checkboxInput"
      color="primary"
      inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
    />
  );
});
HeaderCheckbox.displayName = 'HeaderCheckbox';

export const CellCheckboxRenderer: React.FC<CellParams> = React.memo(({ api, rowModel, value }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    api.selectRow(rowModel.id, checked, true);
  };

  return (
    <Checkbox
      checked={!!value}
      onChange={handleChange}
      className="MuiDataGrid-checkboxInput"
      color="primary"
      inputProps={{ 'aria-label': 'Select Row checkbox' }}
    />
  );
});
CellCheckboxRenderer.displayName = 'CellCheckboxRenderer';
