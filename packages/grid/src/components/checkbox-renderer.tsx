import React, { useEffect, useState } from 'react';
import { CellParams, ColParams } from '../models/colDef';
import { Checkbox } from '@material-ui/core';
import { SelectionChangedParam } from '../models';

export const HeaderCheckbox: React.FC<ColParams> = React.memo(({ api, colDef, colIndex }) => {
  const [isChecked, setChecked] = useState(false);
  const [isIndeterminate, setIndeterminate] = useState(false);

  const handleChange = (e, checked) => {
    setChecked(checked);
    api.selectRows(api.getAllRowIds(), checked);
  };
  const selectionChanged = (e: SelectionChangedParam) => {
    const isAllSelected = api.getAllRowIds().length === e.rows.length;
    const hasNoneSelected = e.rows.length === 0;
    setChecked(isAllSelected || !hasNoneSelected);
    const isIndeterminate = !isAllSelected && !hasNoneSelected;
    setIndeterminate(isIndeterminate);
  };

  useEffect(() => {
    return api.onSelectionChanged(selectionChanged);
  }, [api]);
  return (
    <Checkbox
      indeterminate={isIndeterminate}
      checked={isChecked}
      onChange={handleChange}
      className={'checkbox-input'}
    />
  );
});
HeaderCheckbox.displayName = 'HeaderCheckbox';
export const CellCheckboxRenderer: React.FC<CellParams> = React.memo(({ api, rowModel, value }) => {
  const handleChange = (e, checked) => {
    api.selectRow(rowModel.id, true);
  };

  return <Checkbox checked={!!value} onChange={handleChange} className={'checkbox-input'} />;
});
CellCheckboxRenderer.displayName = 'CellCheckboxRenderer';
