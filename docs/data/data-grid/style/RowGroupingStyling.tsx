import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridRowClassNameParams,
  gridRowNodeSelector,
  gridRowSelector,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';

type Movie = ReturnType<typeof useMovieData>['rows'][number];

const EXPECTED_GROSS = 2000000000;
const ROW_HEIGHT = 52;

export default function RowGroupingStyling() {
  const apiRef = useGridApiRef();
  const data = useMovieData();
  const getRowClassName = React.useCallback(
    (params: GridRowClassNameParams<Movie>) => {
      const node = gridRowNodeSelector(apiRef, params.id);

      if (!node) {
        return '';
      }

      if (node.type === 'group') {
        for (const childId of node.children) {
          const childNode = gridRowNodeSelector(apiRef, childId);
          if (childNode && childNode.type === 'leaf') {
            const childRow = gridRowSelector(apiRef, childId) as Movie;
            if (childRow?.gross && childRow.gross > EXPECTED_GROSS) {
              return 'highlighted-group';
            }
          }
        }

        return '';
      }

      const row = params.row;

      if (row.gross > EXPECTED_GROSS) {
        return 'highlighted-child';
      }

      return '';
    },
    [apiRef],
  );

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
              height: `calc(${ROW_HEIGHT}px * 0.8)`,
              marginTop: `calc(${ROW_HEIGHT}px * 0.1)`,
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
