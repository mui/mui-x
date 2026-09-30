import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

interface PlaygroundToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onAddRows: (count: number) => void;
  onAddColumn: () => void;
  onExportExcel: () => void;
}

const iconButtonSx = {
  borderRadius: '4px',
  padding: '4px',
  color: 'var(--sheets-icon)',
  '&:hover': { backgroundColor: 'var(--sheets-hover)' },
  '& svg': { fontSize: 20 },
} as const;

function PillDivider() {
  return (
    <Box
      sx={{
        width: '1px',
        height: 20,
        backgroundColor: 'var(--sheets-hairline)',
        mx: 0.75,
      }}
    />
  );
}

function ToolbarIcon({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={title}>
      <IconButton size="small" sx={iconButtonSx} onClick={onClick} aria-label={title}>
        {children}
      </IconButton>
    </Tooltip>
  );
}

function PlaygroundToolbar(props: PlaygroundToolbarProps) {
  const { onUndo, onRedo, onAddRows, onAddColumn, onExportExcel } = props;
  return (
    <Box sx={{ px: 1.5, pb: 0.75, backgroundColor: 'var(--sheets-chrome)' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          backgroundColor: 'var(--sheets-pill)',
          borderRadius: '45px',
          px: 1.5,
          py: 0.5,
        }}
      >
        <ToolbarIcon title="Undo (Ctrl+Z)" onClick={onUndo}>
          <UndoRoundedIcon />
        </ToolbarIcon>
        <ToolbarIcon title="Redo (Ctrl+Y)" onClick={onRedo}>
          <RedoRoundedIcon />
        </ToolbarIcon>
        <PillDivider />
        <ToolbarIcon title="Add a row" onClick={() => onAddRows(1)}>
          <PostAddOutlinedIcon />
        </ToolbarIcon>
        <ToolbarIcon title="Add a column" onClick={onAddColumn}>
          <PlaylistAddOutlinedIcon />
        </ToolbarIcon>
        <PillDivider />
        <ToolbarIcon title="Export to Excel (live formulas)" onClick={onExportExcel}>
          <FileDownloadOutlinedIcon />
        </ToolbarIcon>
      </Box>
    </Box>
  );
}

export { PlaygroundToolbar };
