import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';

interface PlaygroundFooterProps {
  sheetName: string;
  /** Number of cells recalculated by the last evaluation pass, or `null`. */
  lastEvaluationCount: number | null;
  onAddRows: (count: number) => void;
}

function PlaygroundFooter(props: PlaygroundFooterProps) {
  const { sheetName, lastEvaluationCount, onAddRows } = props;
  const [count, setCount] = React.useState('10');

  const addRows = () => {
    const parsed = Number.parseInt(count, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      onAddRows(Math.min(parsed, 1000));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.5,
        borderTop: '1px solid var(--sheets-hairline)',
        backgroundColor: 'var(--sheets-chrome)',
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
      }}
    >
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={addRows}
        sx={{
          color: 'var(--sheets-icon)',
          textTransform: 'none',
          fontSize: '13px',
          '&:hover': { backgroundColor: 'var(--sheets-hover)' },
        }}
      >
        Add
      </Button>
      <InputBase
        value={count}
        onChange={(event) => setCount(event.target.value.replace(/[^0-9]/g, ''))}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            addRows();
          }
        }}
        inputProps={{ 'aria-label': 'Number of rows to add' }}
        sx={{
          width: 48,
          px: 0.75,
          fontSize: '13px',
          color: 'var(--sheets-text)',
          border: '1px solid var(--sheets-hairline)',
          borderRadius: '4px',
          backgroundColor: 'var(--sheets-bar-bg)',
        }}
      />
      <Typography sx={{ fontSize: '13px', color: 'var(--sheets-text)' }}>
        more rows at the bottom
      </Typography>

      <Box
        sx={{
          ml: 2,
          px: 2,
          py: 0.25,
          borderRadius: '8px 8px 0 0',
          backgroundColor: 'var(--sheets-bar-bg)',
          borderBottom: '2px solid var(--sheets-accent)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--sheets-text)',
        }}
      >
        {sheetName}
      </Box>

      <Box sx={{ flex: 1 }} />
      {lastEvaluationCount !== null && (
        <Typography sx={{ fontSize: '12px', color: 'var(--sheets-icon)' }} role="status">
          Recalculated {lastEvaluationCount} {lastEvaluationCount === 1 ? 'cell' : 'cells'}
        </Typography>
      )}
    </Box>
  );
}

export { PlaygroundFooter };
