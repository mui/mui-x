import * as React from 'react';
import Box from '@mui/material/Box';
import { FormulaTextField } from './FormulaTextField';
import { FormulaBarProps } from './useFormulaSupport';

// Helper to convert column index to letter (A, B, C, ...)
const getColumnLetter = (index: number) => String.fromCharCode(64 + index);

export interface FormulaBarComponentProps extends FormulaBarProps {}

export function FormulaBar(props: FormulaBarComponentProps) {
  const { value, onChange, colIndex, rowNumber } = props;

  const cellRef =
    colIndex && rowNumber ? `${getColumnLetter(colIndex)}${rowNumber}` : '--';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        my: 1,
        border: '1px solid #D4D4D4',
        borderRadius: '4px',
        overflow: 'hidden',
        '&:focus-within': {
          borderColor: '#4472C4',
        },
      }}
    >
      {/* Name Box - shows current cell reference like "A1" */}
      <Box
        sx={{
          width: '50px',
          backgroundColor: '#F3F3F3',
          borderRight: '1px solid #D4D4D4',
          fontFamily: '"Calibri", "Segoe UI", sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333',
          userSelect: 'none',
        }}
      >
        {cellRef}
      </Box>

      {/* fx label */}
      <Box
        sx={{
          px: 0.5,
          backgroundColor: '#F3F3F3',
          borderRight: '1px solid #D4D4D4',
          fontFamily: '"Calibri", "Segoe UI", sans-serif',
          fontSize: '15px',
          fontStyle: 'italic',
          color: '#555',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          minWidth: '32px',
          justifyContent: 'center',
        }}
      >
        fx
      </Box>

      {/* Formula input field */}
      <FormulaTextField
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            fontFamily: '"Calibri", "Segoe UI", sans-serif',
            fontSize: '11px',
            borderRadius: 0,
            '& fieldset': {
              border: 'none',
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '15px',
            py: 0.75,
            px: 1,
          },
        }}
        variant="outlined"
        size="small"
        fullWidth
        disabled={cellRef === '--'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Box>
  );
}
