import * as React from 'react';

import { debounce } from '@mui/material/utils';

import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  DataGridPro,
  GridColumns,
  GridRowsProp,
  gridRowIdsSelector,
  useGridApiRef,
  GridEvents,
  GridFilterModel,
  gridSortedRowIdsSelector,
  gridFilteredSortedRowIdsSelector,
  gridVisibleSortedRowIdsSelector,
  gridVisibleSortedTopLevelRowEntriesSelector,
  gridPaginatedVisibleSortedGridRowEntriesSelector,
} from '@mui/x-data-grid-pro';

import HighlightedCode from 'docs/src/modules/components/HighlightedCode';

const getTreeDataPath = (row) => [row.bicycleType, row.color];

const allColumns: GridColumns = [
  {
    field: 'bicycleType',
    headerName: 'Bicycle Type',
    type: 'singleSelect',
    valueOptions: ['Road Bike', 'Mountain Bike', 'Touring Bike', 'Folding Bike'],
    width: 150,
  },
  {
    field: 'color',
    headerName: 'Color',
    type: 'singleSelect',
    valueOptions: ['blue', 'red', 'white', 'black'],
    width: 100,
  },
  {
    field: 'price',
    type: 'number',
    width: 150,
  },
  {
    field: 'id',
    headerName: 'row id',
    flex: 1,
  },
];

const rows: GridRowsProp = [
  {
    id: 'Touring-blue-945',
    bicycleType: 'Touring Bike',
    color: 'blue',
    price: 945,
  },
  {
    id: 'Folding-red-637',
    bicycleType: 'Folding Bike',
    color: 'red',
    price: 637,
  },
  {
    id: 'Folding-black-568',
    bicycleType: 'Folding Bike',
    color: 'black',
    price: 568,
  },
  { id: 'Road-blue-563', bicycleType: 'Road Bike', color: 'blue', price: 563 },
  {
    id: 'Folding-white-498',
    bicycleType: 'Folding Bike',
    color: 'white',
    price: 498,
  },
  {
    id: 'Mountain-black-1365',
    bicycleType: 'Mountain Bike',
    color: 'black',
    price: 1365,
  },
  {
    id: 'Mountain-blue-325',
    bicycleType: 'Mountain Bike',
    color: 'blue',
    price: 325,
  },
  { id: 'Road-red-1054', bicycleType: 'Road Bike', color: 'red', price: 1054 },
  {
    id: 'Touring-black-467',
    bicycleType: 'Touring Bike',
    color: 'black',
    price: 467,
  },
  {
    id: 'Mountain-red-1245',
    bicycleType: 'Mountain Bike',
    color: 'red',
    price: 1245,
  },
  {
    id: 'Road-white-687',
    bicycleType: 'Road Bike',
    color: 'white',
    price: 687,
  },
  {
    id: 'Touring-white-763',
    bicycleType: 'Touring Bike',
    color: 'white',
    price: 763,
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

interface RowSelectorOptions {
  applySorting?: boolean;
  applyFiltering?: boolean;
  ignoreCollapsed?: boolean;
  onlyTopLevelRows?: boolean;
  restrainToCurrentPage?: boolean;
}

const defaultOptions: RowSelectorOptions = {
  applySorting: false,
  applyFiltering: false,
  ignoreCollapsed: false,
  onlyTopLevelRows: false,
  restrainToCurrentPage: false,
};
const availableSelectors: {
  example: { ids?: string; entries?: string };
  idsSelectorCallbak: any;
  options: RowSelectorOptions;
}[] = [
  {
    example: { ids: `gridRowIdsSelector(apiRef)` },
    idsSelectorCallbak: gridRowIdsSelector,
    options: { ...defaultOptions },
  },
  {
    example: {
      ids: `gridSortedRowIdsSelector(apiRef)`,
      entries: `gridSortedRowEntriesSelector`,
    },
    idsSelectorCallbak: gridSortedRowIdsSelector,
    options: {
      ...defaultOptions,
      applySorting: true,
    },
  },
  {
    example: {
      ids: `gridFilteredSortedRowIdsSelector(apiRef)`,
      entries: `gridFilteredSortedRowEntriesSelector`,
    },
    idsSelectorCallbak: gridFilteredSortedRowIdsSelector,
    options: {
      ...defaultOptions,
      applySorting: true,
      applyFiltering: true,
    },
  },
  {
    example: {
      ids: `gridVisibleSortedRowIdsSelector(apiRef)`,
      entries: `gridVisibleSortedRowEntriesSelector`,
    },
    idsSelectorCallbak: gridVisibleSortedRowIdsSelector,
    options: {
      ...defaultOptions,
      applySorting: true,
      applyFiltering: true,
      ignoreCollapsed: true,
    },
  },
  {
    example: {
      entries: `gridVisibleSortedTopLevelRowEntriesSelector`,
      ids: `gridVisibleSortedTopLevelRowEntriesSelector(apiRef).map(({ id }) => id)`,
    },
    idsSelectorCallbak: (apiRef) =>
      gridVisibleSortedTopLevelRowEntriesSelector(apiRef).map(({ id }) => id),
    options: {
      ...defaultOptions,
      applySorting: true,
      applyFiltering: true,
      ignoreCollapsed: true,
      onlyTopLevelRows: true,
    },
  },

  {
    example: {
      entries: `gridPaginatedVisibleSortedGridRowEntriesSelector`,
      ids: `gridPaginatedVisibleSortedGridRowEntriesSelector(apiRef).map(({ id }) => id)`,
    },
    idsSelectorCallbak: (apiRef) =>
      gridPaginatedVisibleSortedGridRowEntriesSelector(apiRef).map(({ id }) => id),
    options: {
      ...defaultOptions,
      applySorting: true,
      applyFiltering: true,
      ignoreCollapsed: true,
      restrainToCurrentPage: true,
    },
  },
];

const formatedSelector = (selectorExample) => {
  if (!selectorExample) {
    return '// no dedicated Selector';
  }
  return `const selected_ids = ${selectorExample}`;
};

export default function RowSelectorPlayground() {
  const apiRef = useGridApiRef();

  const [hasTreeStructure, setHasTreeStructure] = React.useState(false);
  const [hasPagination, setHasPagination] = React.useState(false);
  const [applySorting, setApplySorting] = React.useState(false);
  const [applyFiltering, setApplyFiltering] = React.useState(false);
  const [ignoreCollapsed, setIgnoreCollapsed] = React.useState(false);
  const [onlyTopLevelRows, setOnlyTopLevelRows] = React.useState(false);
  const [restrainToCurrentPage, setRestrainToCurrentPage] = React.useState(false);

  const deductedValues: RowSelectorOptions = {};
  if (!hasPagination) {
    deductedValues.restrainToCurrentPage = false;
  }
  if (
    deductedValues.restrainToCurrentPage === undefined
      ? restrainToCurrentPage
      : deductedValues.restrainToCurrentPage
  ) {
    // The page does not make sens whithout sorting/filtering
    deductedValues.applyFiltering = true;
    deductedValues.applySorting = true;
  }
  if (!hasTreeStructure) {
    deductedValues.ignoreCollapsed = false;
    deductedValues.onlyTopLevelRows = false;
  }
  if (
    onlyTopLevelRows &&
    (deductedValues.onlyTopLevelRows ||
      deductedValues.onlyTopLevelRows === undefined)
  ) {
    deductedValues.ignoreCollapsed = true;
  }

  const cleanedValules = {
    applySorting,
    applyFiltering,
    ignoreCollapsed,
    onlyTopLevelRows,
    restrainToCurrentPage,
    ...deductedValues,
  };

  const possibleSelector = availableSelectors.filter(({ options }) =>
    Object.entries(options).every(
      ([optionKey, optionValue]) => optionValue === cleanedValules[optionKey],
    ),
  );

  const idsSelectorCallbak = possibleSelector?.[0]?.idsSelectorCallbak;
  const idsSelector = possibleSelector?.[0]?.example?.ids;

  const columns = React.useMemo(() => {
    if (!hasTreeStructure) {
      return allColumns;
    }
    return allColumns.filter(
      (col) => col.field !== 'bicycleType' && col.field !== 'color',
    );
  }, [hasTreeStructure]);

  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });
  const [updateIndex, setUpdateIndex] = React.useState(0);

  React.useEffect(() => {
    if (!idsSelector) {
      setSelectedRows(['No documented selector yet']);
    } else if (idsSelectorCallbak) {
      setSelectedRows(idsSelectorCallbak(apiRef) || ['Have a problem']);
    } else {
      setSelectedRows([]);
    }
  }, [apiRef, idsSelectorCallbak, updateIndex, filterModel, idsSelector]);

  const callRowSelector = React.useCallback(() => {
    setUpdateIndex((x) => x + 1);
  }, [setUpdateIndex]);

  const handleFilterChange = React.useCallback((event, value) => {
    setFilterModel({
      items: [{ id: 1, value, columnField: 'price', operatorValue: '<=' }],
    });
  }, []);

  const debouncedHandleFilterChange = React.useMemo(
    () => debounce(handleFilterChange, 10),
    [handleFilterChange],
  );

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowExpansionChange, callRowSelector);
  }, [apiRef, callRowSelector]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex' }}>
        <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
          <FormLabel component="legend">Describe your grid</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasTreeStructure}
                  onChange={(event) => setHasTreeStructure(event.target.checked)}
                />
              }
              label="Use Tree structure"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasPagination}
                  onChange={(event) => setHasPagination(event.target.checked)}
                />
              }
              label="Have Pagination activated"
            />
          </FormGroup>
        </FormControl>
        <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
          <FormLabel component="legend">Which rows do you want to select?</FormLabel>
          <Box sx={{ display: 'flex' }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cleanedValules.applySorting}
                    disabled={deductedValues.applySorting !== undefined}
                    onChange={(event) => setApplySorting(event.target.checked)}
                  />
                }
                label="Apply sorting order"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cleanedValules.applyFiltering}
                    disabled={deductedValues.applyFiltering !== undefined}
                    onChange={(event) => setApplyFiltering(event.target.checked)}
                  />
                }
                label="Apply filtering"
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cleanedValules.onlyTopLevelRows}
                    disabled={deductedValues.onlyTopLevelRows !== undefined}
                    onChange={(event) => setOnlyTopLevelRows(event.target.checked)}
                  />
                }
                label="Only top-level rows"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cleanedValules.ignoreCollapsed}
                    disabled={deductedValues.ignoreCollapsed !== undefined}
                    onChange={(event) => setIgnoreCollapsed(event.target.checked)}
                  />
                }
                label="Ignore collapsed rows"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cleanedValules.restrainToCurrentPage}
                    disabled={deductedValues.restrainToCurrentPage !== undefined}
                    onChange={(event) =>
                      setRestrainToCurrentPage(event.target.checked)
                    }
                  />
                }
                label="Restrain to current page"
              />
            </FormGroup>
          </Box>
        </FormControl>
      </Box>
      <Box>
        <HighlightedCode
          code={`// Rows ids selector:
${formatedSelector(idsSelector)}`}
          language="tsx"
        />

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="data-grid-with-selected-ids"
            id="show-data-grid-with-selected-ids"
          >
            <Typography>Interactive example</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ width: '70%' }}>
                <Box sx={{ height: '300px' }}>
                  <DataGridPro
                    apiRef={apiRef}
                    columns={columns}
                    rows={rows}
                    groupingColDef={{ headerName: 'Bicycle' }}
                    treeData={hasTreeStructure}
                    getTreeDataPath={getTreeDataPath}
                    pageSize={hasPagination ? 2 : 100}
                    rowsPerPageOptions={[2]}
                    pagination={hasPagination}
                    onSortModelChange={callRowSelector}
                    onPageChange={callRowSelector}
                    filterModel={filterModel}
                    disableColumnMenu
                  />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', height: '3rem' }}>
                  <Typography>Maximum price</Typography>
                  <Slider
                    sx={{ maxWidth: 200, ml: 2 }}
                    size="small"
                    defaultValue={900}
                    aria-label="maximum price"
                    valueLabelDisplay="auto"
                    min={100}
                    max={1200}
                    onChangeCommitted={handleFilterChange}
                    onChange={debouncedHandleFilterChange}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  ml: 2,
                  maxWidth: '28%',
                }}
              >
                <p style={{ height: '2rem', marginTop: '1rem', marginBottom: 0 }}>
                  Returned ids
                </p>
                <List dense sx={{ overflow: 'auto', maxHeight: '300px' }}>
                  {selectedRows.map((id) => (
                    <ListItem key={id}>
                      <ListItemText primary={id} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
