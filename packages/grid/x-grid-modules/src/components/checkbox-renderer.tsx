import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@material-ui/core';
import styled from 'styled-components';
import { SelectionChangedParams } from '../models/params/selectionChangedParams';
import { ColParams } from '../models/params/colParams';
import { CellParams } from '../models/params/cellParams';

const CheckboxInputContainer = styled.div`
  display: block;
`;

export const HeaderCheckbox: React.FC<ColParams> = React.memo(({ api, colDef, colIndex }) => {
  const [isChecked, setChecked] = useState(false);
  const [isIndeterminate, setIndeterminate] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    api.selectRows(api.getAllRowIds(), checked);
  };
  const selectionChanged = useCallback(
    (e: SelectionChangedParams) => {
      const isAllSelected = api.getAllRowIds().length === e.rows.length && e.rows.length > 0;
      const hasNoneSelected = e.rows.length === 0;
      setChecked(isAllSelected || !hasNoneSelected);
      setIndeterminate(!isAllSelected && !hasNoneSelected);
    },
    [api, setIndeterminate, setChecked],
  );

  useEffect(() => {
    return api.onSelectionChanged(selectionChanged);
  }, [api, selectionChanged]);
  return (
    <CheckboxInputContainer>
      <Checkbox
        indeterminate={isIndeterminate}
        checked={isChecked}
        onChange={handleChange}
        className={'checkbox-input'}
        inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
      />
    </CheckboxInputContainer>
  );
});
HeaderCheckbox.displayName = 'HeaderCheckbox';
export const CellCheckboxRenderer: React.FC<CellParams> = React.memo(({ api, rowModel, value }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    api.selectRow(rowModel.id, checked, true);
  };

  return (
    <CheckboxInputContainer>
      <Checkbox
        checked={!!value}
        onChange={handleChange}
        className={'checkbox-input'}
        inputProps={{ 'aria-label': 'Select Row checkbox' }}
      />
    </CheckboxInputContainer>
  );
});
CellCheckboxRenderer.displayName = 'CellCheckboxRenderer';
