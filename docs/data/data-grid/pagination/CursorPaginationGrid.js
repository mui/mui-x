import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createFakeServer } from '@mui/x-data-grid-generator';

const PAGE_SIZE = 5;

const SERVER_OPTIONS = {
  useCursorPagination: true,
};

const { useQuery, ...data } = createFakeServer({}, SERVER_OPTIONS);

export default function CursorPaginationGrid() {
  const [rowCountType, setRowCountType] = React.useState('known');

  const mapPageToNextCursor = React.useRef({});

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });

  const queryOptions = React.useMemo(
    () => ({
      cursor: mapPageToNextCursor.current[paginationModel.page - 1],
      pageSize: paginationModel.pageSize,
    }),
    [paginationModel],
  );
  const {
    isLoading,
    rows,
    pageInfo: { hasNextPage, nextCursor, totalRowCount },
  } = useQuery(queryOptions);

  const handlePaginationModelChange = (newPaginationModel) => {
    // We have the cursor, we can allow the page transition.
    if (
      newPaginationModel.page === 0 ||
      mapPageToNextCursor.current[newPaginationModel.page - 1]
    ) {
      setPaginationModel(newPaginationModel);
    }
  };

  const paginationMetaRef = React.useRef();

  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = React.useMemo(() => {
    if (
      hasNextPage !== undefined &&
      paginationMetaRef.current?.hasNextPage !== hasNextPage
    ) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  React.useEffect(() => {
    if (!isLoading && nextCursor) {
      // We add nextCursor when available
      mapPageToNextCursor.current[paginationModel.page] = nextCursor;
    }
  }, [paginationModel.page, isLoading, nextCursor]);

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = React.useState(totalRowCount || 0);
  React.useEffect(() => {
    if (rowCountType === 'known') {
      setRowCountState((prevRowCountState) =>
        totalRowCount !== undefined ? totalRowCount : prevRowCountState,
      );
    }
    if (
      (rowCountType === 'unknown' || rowCountType === 'estimated') &&
      paginationMeta?.hasNextPage !== false
    ) {
      setRowCountState(-1);
    }
  }, [paginationMeta?.hasNextPage, rowCountType, totalRowCount]);

  const prevEstimatedRowCount = React.useRef(undefined);
  const estimatedRowCount = React.useMemo(() => {
    if (rowCountType === 'estimated') {
      if (totalRowCount !== undefined) {
        if (prevEstimatedRowCount.current === undefined) {
          prevEstimatedRowCount.current = totalRowCount / 2;
        }
        return totalRowCount / 2;
      }
      return prevEstimatedRowCount.current;
    }
    return undefined;
  }, [rowCountType, totalRowCount]);

  return (
    <div style={{ width: '100%' }}>
      <FormControl>
        <FormLabel id="demo-cursor-pagination-buttons-group-label">
          Row count
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-cursor-pagination-buttons-group-label"
          name="cursor-pagination-buttons-group"
          value={rowCountType}
          onChange={(event) => setRowCountType(event.target.value)}
        >
          <FormControlLabel value="known" control={<Radio />} label="Known" />
          <FormControlLabel value="unknown" control={<Radio />} label="Unknown" />
          <FormControlLabel
            value="estimated"
            control={<Radio />}
            label="Estimated"
          />
        </RadioGroup>
      </FormControl>
      <div style={{ height: 400 }}>
        <DataGrid
          rows={rows}
          {...data}
          pageSizeOptions={[PAGE_SIZE]}
          rowCount={rowCountState}
          onRowCountChange={(newRowCount) => setRowCountState(newRowCount)}
          estimatedRowCount={estimatedRowCount}
          paginationMeta={paginationMeta}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
          paginationModel={paginationModel}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
