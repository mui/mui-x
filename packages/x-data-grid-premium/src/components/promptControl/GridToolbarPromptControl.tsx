import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  getDataGridUtilityClass,
  GRID_CHECKBOX_SELECTION_FIELD,
  gridColumnLookupSelector,
  GridLogicOperator,
  GridSingleSelectColDef,
} from '@mui/x-data-grid';
import { getValueOptions, getVisibleRows } from '@mui/x-data-grid/internals';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { GridApiPremium } from '../../models/gridApiPremium';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { PromptResponse } from '../../hooks/features/promptControl/types';
import { RecordButton } from './RecordButton';

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState, recording: boolean) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarPromptControl', recording && 'toolbarPromptControl--recording'],
    recordingIndicator: ['toolbarPromptControlRecordingIndicator'],
    recordButton: ['toolbarPromptControlRecordButton'],
    sendButton: ['toolbarPromptControlSendButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridToolbarPromptControlRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarPromptControl',
  overridesResolver: (_props, styles) => styles.toolbarPromptControl,
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
});

function sampleData(
  apiRef: React.MutableRefObject<GridApiPremium>,
  rootProps: DataGridPremiumProcessedProps,
) {
  const columns = Object.values(gridColumnLookupSelector(apiRef));
  const rows = rootProps.rows;
  const columnExamples: Record<string, any[]> = {};

  columns.forEach((column) => {
    columnExamples[column.field] = rows.slice(0, 5).map(() => {
      const row = rows[Math.floor(Math.random() * rows.length)];
      if (column.valueGetter) {
        return column.valueGetter(row[column.field] as never, row, column, apiRef);
      }
      return row[column.field];
    });
  });

  return columnExamples;
}

function generateContext(
  apiRef: React.MutableRefObject<GridApiPremium>,
  examples?: Record<string, any[]>,
) {
  const columns = Object.values(gridColumnLookupSelector(apiRef));
  const columnsContext = columns.map((column) => ({
    field: column.field,
    description: column.description ?? null,
    examples: examples?.[column.field] ?? column.unstable_examples ?? [],
    type: column.type ?? 'string',
    allowedOperators: column.filterOperators?.map((operator) => operator.value) ?? [],
  }));

  return `${apiRef.current.getLocaleText('toolbarPromptControlColumnsContextIntro')}\n${JSON.stringify(columnsContext)}`;
}

type GridToolbarPromptControlProps = {
  /**
   * Called when the new prompt is ready to be processed.
   * Provides the prompt and the data context and expects the grid state updates to be returned.
   * @param {string} context The context of the prompt
   * @param {string} query The query to process
   * @returns {Promise<PromptResponse>} The grid state updates
   */
  onPrompt: (context: string, query: string) => Promise<PromptResponse>;
  /**
   * Allow taking couple of random cell values from each column to improve the prompt context.
   * If allowed, samples are taken from different rows.
   * If not allowed, the column examples are used.
   * @default false
   */
  allowDataSampling?: boolean;
  /**
   * The language to use for the speech recognition.
   * @default 'en-US'
   */
  lang?: string;
};

function GridToolbarPromptControl(props: GridToolbarPromptControlProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const { onPrompt, lang, allowDataSampling = false } = props;

  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isRecording, setRecording] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const classes = useUtilityClasses(rootProps, isRecording);
  const examplesFromData = React.useMemo(
    () => (allowDataSampling ? sampleData(apiRef, rootProps) : undefined),
    [apiRef, rootProps, allowDataSampling],
  );

  const processPrompt = React.useCallback(() => {
    const context = generateContext(apiRef, examplesFromData);
    const columnsByField = gridColumnLookupSelector(apiRef);

    setLoading(true);
    setError(null);
    apiRef.current.setState((state) => ({ ...state, rows: { ...state.rows, loading: true } }));

    onPrompt(context, query)
      .then((result) => {
        const interestColumns = [] as string[];

        apiRef.current.setFilterModel({
          items: result.filters.map((filter, index) => {
            const item = {
              id: index,
              field: filter.column,
              operator: filter.operator,
              value: filter.value,
            };

            const column = columnsByField[filter.column];
            if (column.type === 'singleSelect') {
              const options = getValueOptions(column as GridSingleSelectColDef) ?? [];
              const found = options.find(
                (option) => typeof option === 'object' && option.label === filter.value,
              );
              if (found) {
                item.value = (found as any).value;
              }
            }

            return item;
          }),
          logicOperator: (result.filterOperator as GridLogicOperator) ?? GridLogicOperator.And,
          quickFilterValues: [],
        });

        apiRef.current.setRowGroupingModel(result.grouping.map((g) => g.column));
        apiRef.current.setAggregationModel(result.aggregation);

        apiRef.current.setSortModel(
          result.sorting.map((s) => ({ field: s.column, sort: s.direction })),
        );

        const rows = getVisibleRows(apiRef, rootProps);
        const selectedRowIds =
          result.select === -1
            ? []
            : rows.rows.slice(0, result.select).map((r) => {
                return apiRef.current.getRowId(r);
              });
        apiRef.current.setRowSelectionModel(selectedRowIds);

        const columns = apiRef.current.getAllColumns();
        const targetIndex =
          Number(columns.find((c) => c.field === GRID_CHECKBOX_SELECTION_FIELD) !== undefined) +
          Number(result.grouping.length);

        interestColumns.push(...Object.keys(result.aggregation));
        interestColumns.push(...result.filters.map((f) => f.column));
        interestColumns.reverse().forEach((c) => apiRef.current.setColumnIndex(c, targetIndex));
      })
      .catch((_) => {
        setError(apiRef.current.getLocaleText('toolbarPromptControlErrorMessage'));
      })
      .finally(() => {
        setLoading(false);
        apiRef.current.setState((state) => ({ ...state, rows: { ...state.rows, loading: false } }));
      });
  }, [apiRef, rootProps, onPrompt, examplesFromData, query]);

  const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  });

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      processPrompt();
    }
  });

  const handleDone = useEventCallback((value: string) => {
    setQuery(value);
    if (value) {
      processPrompt();
    }
  });

  return (
    <GridToolbarPromptControlRoot ownerState={rootProps} className={classes.root}>
      <rootProps.slots.baseTextField
        variant="outlined"
        placeholder={
          isRecording
            ? apiRef.current.getLocaleText('toolbarPromptControlRecordingPlaceholder')
            : apiRef.current.getLocaleText('toolbarPromptControlPlaceholder')
        }
        aria-label={apiRef.current.getLocaleText('toolbarPromptControlLabel')}
        disabled={isLoading}
        value={query}
        style={{ flex: 1 }}
        onChange={handleChange}
        size="small"
        onKeyDown={handleKeyDown}
        error={!!error}
        helperText={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <RecordButton
                className={classes.recordButton}
                lang={lang}
                recording={isRecording}
                setRecording={setRecording}
                disabled={isLoading}
                onUpdate={setQuery}
                onDone={handleDone}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <rootProps.slots.baseTooltip
                title={apiRef.current.getLocaleText('toolbarPromptControlSendActionLabel')}
              >
                <div>
                  <rootProps.slots.baseIconButton
                    className={classes.sendButton}
                    disabled={isLoading || isRecording || query === ''}
                    color="primary"
                    onClick={processPrompt}
                    size="small"
                    aria-label={apiRef.current.getLocaleText(
                      'toolbarPromptControlSendActionAriaLabel',
                    )}
                  >
                    <rootProps.slots.toolbarPromptSendIcon fontSize="small" />
                  </rootProps.slots.baseIconButton>
                </div>
              </rootProps.slots.baseTooltip>
            </InputAdornment>
          ),
        }}
      />
    </GridToolbarPromptControlRoot>
  );
}

GridToolbarPromptControl.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Allow taking couple of random cell values from each column to improve the prompt context.
   * If allowed, samples are taken from different rows.
   * If not allowed, the column examples are used.
   * @default false
   */
  allowDataSampling: PropTypes.bool,
  /**
   * The language to use for the speech recognition.
   * @default 'en-US'
   */
  lang: PropTypes.string,
  /**
   * Called when the new prompt is ready to be processed.
   * Provides the prompt and the data context and expects the grid state updates to be returned.
   * @param {string} context The context of the prompt
   * @param {string} query The query to process
   * @returns {Promise<PromptResponse>} The grid state updates
   */
  onPrompt: PropTypes.func.isRequired,
} as any;

export { GridToolbarPromptControl as Unstable_GridToolbarPromptControl };
