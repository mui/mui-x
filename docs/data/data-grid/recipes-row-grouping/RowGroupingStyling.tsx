import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridRowClassNameParams,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

type Movie = ReturnType<typeof useMovieData>['rows'][number];

const EXPECTED_GROSS = 2000000000;

export default function RowGroupingStyling() {
  const apiRef = useGridApiRef();
  const data = useMovieData();

  const getRowClassName = (params: GridRowClassNameParams<Movie>) => {
    const node = apiRef.current?.getRowNode(params.id);

    if (!node) {
      return '';
    }

    if (node.type === 'group') {
      const childIds = node.children || [];

      let hasExpectedGross = false;

      for (const childId of childIds) {
        const childNode = apiRef.current?.getRowNode(childId);
        if (childNode && childNode.type === 'leaf') {
          const childRow = apiRef.current?.getRow<Movie>(childId);
          if (childRow?.gross && childRow.gross > EXPECTED_GROSS) {
            hasExpectedGross = true;
          }
        }
      }

      if (hasExpectedGross) {
        return 'highlighted-group';
      }
      return '';
    }

    if (node.parent) {
      const row = params.row;

      if (row.gross > EXPECTED_GROSS) {
        return 'highlighted-child';
      }
    }

    return '';
  };

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['company'],
      },
    },
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        apiRef={apiRef}
        initialState={initialState}
        getRowClassName={getRowClassName}
        sx={(theme) => ({
          '& .highlighted-group': {
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              left: 0,
              width: 4,
              height: 'calc(var(--height) * 0.8)',
              marginTop: 'calc(var(--height) * 0.1)',
              backgroundColor: 'success.main',
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          },
          '& .highlighted-child': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.success.main} 8%, transparent)`,
            '&:hover': {
              backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.success.main} 12%, transparent)`,
            },
          },
        })}
      />
    </div>
  );
}
