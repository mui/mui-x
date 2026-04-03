import * as React from 'react';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { FormulaTextField } from './FormulaTextField';
import { useHyperFormula } from './formulaSupportContext';

export type FormulaEditCellProps = GridRenderEditCellParams & {
  onChange: (newValue: string) => void;
};

// Row type with HyperFormula reference
interface HFRow {
  id: string | number;
  _hfRowIndex: number;
  row_number: number;
}

export const FormulaEditCell = React.forwardRef<
  HTMLInputElement,
  FormulaEditCellProps
>((props, _ref) => {
  const { field, onChange, row, hasFocus } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Get HyperFormula context
  const { hf, sheetId, columnFieldMap } = useHyperFormula();

  // Get the formula directly from HyperFormula
  const initialValue = React.useMemo(() => {
    if (!hf) {
      return '';
    }

    const hfRow = row as HFRow;
    const colIndex = columnFieldMap.get(field);

    if (colIndex === undefined) {
      return '';
    }

    // Get serialized formula/value from HyperFormula
    const formula = hf.getCellSerialized({
      sheet: sheetId,
      // eslint-disable-next-line no-underscore-dangle
      row: hfRow._hfRowIndex,
      col: colIndex,
    });

    return String(formula ?? '');
  }, [field, hf, sheetId, row, columnFieldMap]);

  const [inputValue, setInputValue] = React.useState(initialValue);

  useEnhancedEffect(() => {
    if (hasFocus) {
      inputRef.current?.focus();
      // Select all text on focus for easy editing
      inputRef.current?.select?.();
    }
  }, [hasFocus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <FormulaTextField
      value={inputValue}
      onChange={handleChange}
      fullWidth
      variant="standard"
      ref={inputRef}
    />
  );
});
