import * as React from 'react';
import {
  Chip,
  ChipProps,
   FormControl,
  Grid, InputLabel, MenuItem,
 Select,
  TextField,
  Typography,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { allColumnsSelector } from '../../hooks/features/columns/columnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { useGridState } from '../../hooks/features/core/useGridState';
import {
  COLUMN_FILTER_CHANGED,
  PREVENT_HIDE_PREFERENCES,
} from '../../constants/index';
import { ApiContext } from '../api-context';
import { ColDef } from '../../models/colDef/colDef';
import { CheckCircleIcon} from '../icons/index';

const SUBMIT_FILTER_STROKE_TIME = 500;

export const FilterPanel: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef!);
  const columns = useGridSelector(apiRef, allColumnsSelector);

  const [filterValue, setFilterValue] = React.useState('');
  const [colDef, setColDef] = React.useState<ColDef | null>(()=> {
    if(!gridState.preferencePanel.targetField) {
      return null;
    }
    return apiRef!.current.getColumnFromField(gridState.preferencePanel.targetField);
  });

  const filterTimeout = React.useRef<any>();

  const dontHidePreferences = React.useCallback((event: React.ChangeEvent<{}>) => {
    apiRef!.current.publishEvent(PREVENT_HIDE_PREFERENCES, {})
    event.preventDefault();

  }, [apiRef]);

  const applyFilter = React.useCallback(
    (value: any) => {
      apiRef?.current.publishEvent(COLUMN_FILTER_CHANGED, {
        column: colDef,
        filterValues: [...(colDef?.filterValue || []), value],
      });
      forceUpdate();
    },
    [apiRef, colDef, forceUpdate],
  );

  const onFilterChange = React.useCallback((event) => {
    clearTimeout(filterTimeout.current);
    const value = event.target.value;
    setFilterValue(value);
    filterTimeout.current = setTimeout(() => {
      applyFilter(value);
      setFilterValue('');
    }, SUBMIT_FILTER_STROKE_TIME);
  }, [applyFilter]);

  const deleteFilter = React.useCallback(
    (event, value) => {
      const newFilterValue = colDef?.filterValue?.filter((v) => v !== value);
      apiRef?.current.publishEvent(COLUMN_FILTER_CHANGED, {
        column: colDef,
        filterValues: newFilterValue,
      });
    },
    [apiRef, colDef],
  );

  React.useEffect(() => {
    setColDef(()=> {
      if(!gridState.preferencePanel.targetField) {
        return null;
      }
      return apiRef!.current.getColumnFromField(gridState.preferencePanel.targetField);
    });
  }, [apiRef, gridState.preferencePanel]);

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    }
  }, []);

  const changeColFilter = React.useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    setColDef(apiRef?.current.getColumnFromField(event.target.value as string)!);
  }, [apiRef]);

  const changeOperator = React.useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    // setColDef(apiRef?.current.getColumnFromField(event.target.value as string)!);
  }, [apiRef]);

  return (

    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <FormControl>
          <InputLabel id="columns-filter-select-label">Columns</InputLabel>
          <Select
            labelId="columns-filter-select-label"
            id="columns-filter-select"
            value={colDef?.field || ''}
            onChange={changeColFilter}
            onOpen={dontHidePreferences}
          >
            {columns.map(col =>
              <MenuItem key={col.field} value={col.field}>{col.headerName || col.field}</MenuItem>
            )}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="columns-operators-select-label">Operators</InputLabel>
          <Select
            labelId="columns-operators-select-label"
            id="columns-operators-select"
            value={0}
            onOpen={dontHidePreferences}
            onChange={changeOperator}
          >
            <MenuItem value={0}>Contains</MenuItem>
            <MenuItem value={1}>Equals</MenuItem>
            <MenuItem value={2}>Starts with</MenuItem>
            <MenuItem value={3}>Ends with</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <TextField
            label={'Value'}
            placeholder={'Filter value'}
            value={filterValue}
            onChange={onFilterChange}
          />
        </FormControl>
      </div>
      <div
        style={{
          paddingTop: 5,
          display: 'inline-flex',
          flexFlow: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-evenly',
        }}
      >
        {colDef?.filterValue?.map((appliedFilter) => (
          <ChipWithValue
            key={appliedFilter}
            icon={<CheckCircleIcon/>}
            label={appliedFilter}
            value={appliedFilter}
            onDelete={deleteFilter}
            variant="outlined"
            className={'chip'}
          />
        ))}
      </div>
      {colDef?.filterValue?.length != null && colDef?.filterValue?.length > 1 && (
        <div style={{display: 'inline-flex', justifyContent: 'center'}}>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>And</Grid>
              <Grid item>
                <Switch
                  defaultChecked
                  color="default"
                  inputProps={{'aria-label': 'checkbox with default color'}}
                />
              </Grid>
              <Grid item>Or</Grid>
            </Grid>
          </Typography>
        </div>
      )}
    </div>

  );
};

function ChipWithValue(
  props: Omit<ChipProps, 'onDelete'> & {
    value: string;
    onDelete: (event: any, value: string) => void;
  },
) {
  const { value, onDelete, ...chipProps } = props;

  const onDeleteCallback = React.useCallback(
    (event) => {
      if (onDelete) {
        return onDelete(event, value);
      }
      return null;
    },
    [onDelete, value],
  );

  return <Chip {...chipProps} onDelete={onDeleteCallback} />;
}
