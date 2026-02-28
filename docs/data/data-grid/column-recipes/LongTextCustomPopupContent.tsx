import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridLongTextCell } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Markdown from 'markdown-to-jsx';

const rows = [
  {
    id: 1,
    title: 'Introduction to React',
    notes:
      'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient updates.',
    markdown:
      '# Getting Started\n\nTo create a new React app:\n\n```bash\nnpx create-react-app my-app\n```\n\n**Key concepts:**\n- Components\n- Props\n- State',
  },
  {
    id: 2,
    title: 'TypeScript Basics',
    notes:
      'TypeScript adds static type definitions to JavaScript. It helps catch errors early and improves code maintainability in large codebases.',
    markdown:
      '## Type Annotations\n\nBasic types:\n\n```typescript\nlet name: string = "John";\nlet age: number = 30;\nlet active: boolean = true;\n```\n\n*TypeScript compiles to plain JavaScript.*',
  },
  {
    id: 3,
    title: 'MUI Data Grid',
    notes:
      'The MUI X Data Grid is a powerful component for displaying and editing tabular data. It supports sorting, filtering, pagination, and many other features out of the box.',
    markdown:
      '### Features\n\n1. Sorting & Filtering\n2. Pagination\n3. Column resizing\n4. Row selection\n\n> The Data Grid is highly customizable!',
  },
];

const CharacterCountWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const CharacterCountText = styled('span')(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: theme.spacing(1),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const MarkdownPreview = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  '& h1, & h2, & h3': {
    marginTop: 0,
    marginBottom: theme.spacing(1),
    fontSize: '1rem',
    fontWeight: 600,
  },
  '& p': {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
  '& ul, & ol': {
    marginTop: 0,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  '& code': {
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.85em',
  },
  '& pre': {
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& blockquote': {
    margin: 0,
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    borderLeft: `3px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
  },
  '& strong': {
    fontWeight: 600,
  },
  '& em': {
    fontStyle: 'italic',
  },
}));

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 180 },
  {
    field: 'notes',
    headerName: 'Notes (with character count)',
    type: 'longText',
    width: 250,
    editable: true,
    renderCell: (params) => (
      <GridLongTextCell
        {...params}
        renderContent={(value) => (
          <CharacterCountWrapper>
            <div>{value}</div>
            <CharacterCountText>{value?.length ?? 0} characters</CharacterCountText>
          </CharacterCountWrapper>
        )}
      />
    ),
  },
  {
    field: 'markdown',
    headerName: 'Markdown (with preview)',
    type: 'longText',
    width: 250,
    editable: true,
    renderCell: (params) => (
      <GridLongTextCell
        {...params}
        renderContent={(value) => (
          <MarkdownPreview>
            <Markdown>{value ?? ''}</Markdown>
          </MarkdownPreview>
        )}
        slotProps={{
          popperContent: {
            style: {
              minWidth: 375,
              maxHeight: 'initial',
            },
          },
        }}
      />
    ),
  },
];

export default function LongTextCustomPopupContent() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
}
