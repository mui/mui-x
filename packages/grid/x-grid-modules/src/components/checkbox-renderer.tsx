import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import styled from 'styled-components';
import { SelectionChangedParams } from '../models/params/selectionChangedParams';
import { ColParams } from '../models/params/colParams';
import { CellParams } from '../models/params/cellParams';

const CheckboxInputContainer = styled.div`
  display: block;
`;

export const HeaderCheckbox: React.FC<ColParams> = React.memo(({ api }) => {
  const [isChecked, setChecked] = React.useState(false);
  const [isIndeterminate, setIndeterminate] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    api.selectRows(api.getAllRowIds(), checked);
  };
  const selectionChanged = React.useCallback(
    (event: SelectionChangedParams) => {
      const isAllSelected =
        api.getAllRowIds().length === event.rows.length && event.rows.length > 0;
      const hasNoneSelected = event.rows.length === 0;
      setChecked(isAllSelected || !hasNoneSelected);
      setIndeterminate(!isAllSelected && !hasNoneSelected);
    },
    [api, setIndeterminate, setChecked],
  );

  React.useEffect(() => {
    return api.onSelectionChanged(selectionChanged);
  }, [api, selectionChanged]);
  return (
    <CheckboxInputContainer>
      <Checkbox
        indeterminate={isIndeterminate}
        checked={isChecked}
        onChange={handleChange}
        className="checkbox-input"
        inputProps={{ 'aria-label': 'Select All Rows checkbox' }}
      />
    </CheckboxInputContainer>
  );
});
HeaderCheckbox.displayName = 'HeaderCheckbox';

export const CellCheckboxRenderer: React.FC<CellParams> = React.memo(({ api, rowModel, value }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    api.selectRow(rowModel.id, checked, true);
  };

  return (
    <CheckboxInputContainer>
      <Checkbox
        checked={!!value}
        onChange={handleChange}
        className="checkbox-input"
        inputProps={{ 'aria-label': 'Select Row checkbox' }}
      />
    </CheckboxInputContainer>
  );
});
CellCheckboxRenderer.displayName = 'CellCheckboxRenderer';
