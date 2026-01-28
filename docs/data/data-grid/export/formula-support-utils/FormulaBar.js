import * as React from 'react';
import Box from '@mui/material/Box';
import { FormulaTextField } from './FormulaTextField';

// Helper to convert column index to letter (A, B, C, ...)
const getColumnLetter = (index) => String.fromCharCode(64 + index);

export function FormulaBar(props) {
  const { value, onChange, colIndex, rowNumber } = props;

  const cellRef =
    colIndex && rowNumber ? `${getColumnLetter(colIndex)}${rowNumber}` : '--';

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'stretch',
        my: 1,
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: '4px',
        overflow: 'hidden',
        '&:focus-within': {
          borderColor: '#4472C4',
        },
      })}
    >
      {/* Name Box - shows current cell reference like "A1" */}
      <Box
        sx={(theme) => ({
          width: '50px',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.grey[800]
              : theme.palette.grey[100],
          borderRight: '1px solid',
          borderColor: theme.palette.divider,
          fontFamily: '"Calibri", "Segoe UI", sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.text.primary,
          userSelect: 'none',
        })}
      >
        {cellRef}
      </Box>

      {/* fx label */}
      <Box
        sx={(theme) => ({
          px: 0.5,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.grey[800]
              : theme.palette.grey[100],
          borderRight: '1px solid',
          borderColor: theme.palette.divider,
          fontFamily: '"Calibri", "Segoe UI", sans-serif',
          fontSize: '15px',
          fontStyle: 'italic',
          color: theme.palette.text.secondary,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          minWidth: '32px',
          justifyContent: 'center',
        })}
      >
        fx
      </Box>

      {/* Formula input field */}
      <FormulaTextField
        sx={(theme) => ({
          flex: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.paper,
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
        })}
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
