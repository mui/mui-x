import * as React from 'react';

import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { FormulaTextField } from './FormulaTextField';
import { useHyperFormula } from './formulaSupportContext';

// Row type with HyperFormula reference

export const FormulaEditCell = React.forwardRef((props, _ref) => {
  const { field, onChange, row, hasFocus } = props;
  const inputRef = React.useRef(null);

  // Get HyperFormula context
  const { hf, sheetId, columnFieldMap } = useHyperFormula();

  // Get the formula directly from HyperFormula
  const initialValue = React.useMemo(() => {
    if (!hf) {
      return '';
    }

    const hfRow = row;
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

  const handleChange = (event) => {
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
