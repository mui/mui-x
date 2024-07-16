import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { Timeout } from '@mui/utils/useTimeout';
import useLazyRef from '@mui/utils/useLazyRef';
import {
  getDataGridUtilityClass,
  useGridApiContext,
  useGridRootProps,
  gridColumnLookupSelector,
  GridLogicOperator,
  GridSingleSelectColDef,
  GRID_CHECKBOX_SELECTION_FIELD,
} from '@mui/x-data-grid';
import { getValueOptions, getVisibleRows } from '@mui/x-data-grid/internals';
import MicrophoneIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import * as remoteControl from '../hooks/features/remoteControl/api';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import { GridApiPro } from '../models';

const BrowserSpeechRecognition = (globalThis as any).webkitSpeechRecognition;

type OwnerState = DataGridProProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['toolbarRemoteControl'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const Style = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ToolbarRemoteControl',
  overridesResolver: (_props, styles) => styles.toolbarRemoteControl,
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
});

function GridToolbarRemoteControl() {
  const apiRef = useGridApiContext<GridApiPro>();
  const rootProps = useGridRootProps() as DataGridProProcessedProps;
  const classes = useUtilityClasses(rootProps);
  const [isLoading, setLoading] = React.useState(false);
  const [isRecording, setRecording] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const sendRequest = React.useCallback(() => {
    const context = generateContext(apiRef, rootProps);
    const columnsByField = gridColumnLookupSelector(apiRef);

    setLoading(true);
    apiRef.current.setState((state) => ({ ...state, rows: { ...state.rows, loading: true } }));
    remoteControl
      .controls(context, query)
      .then((result) => {
        const interestColumns = [] as string[];

        apiRef.current.setFilterModel({
          items: result.filters.map((f, i) => {
            const item = {
              id: i,
              field: f.column,
              operator: f.operator,
              value: f.value,
            };
            const column = columnsByField[f.column];
            if (column.type === 'singleSelect') {
              const options = getValueOptions(column as GridSingleSelectColDef) ?? [];
              const found = options.find((o) => typeof o === 'object' && o.label === f.value);
              if (found) {
                item.value = (found as any).value;
              }
            }

            return item;
          }),
          logicOperator: (result.filterOperator as GridLogicOperator) ?? GridLogicOperator.And,
          quickFilterValues: [],
        });

        // XXX: This requires premium.
        if ((apiRef.current as any).setRowGroupingModel) {
          (apiRef.current as any).setRowGroupingModel(result.grouping.map((g) => g.column));
        }
        // XXX: This requires premium.
        if ((apiRef.current as any).setAggregationModel) {
          // XXX: Custom aggregation functions not supported here.
          (apiRef.current as any).setAggregationModel(result.aggregation);
        }

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
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
        apiRef.current.setState((state) => ({ ...state, rows: { ...state.rows, loading: false } }));
      });
  }, [apiRef, rootProps, query]);

  const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  });

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      sendRequest();
    }
  });

  const handleDone = useEventCallback((value: string) => {
    setQuery(value);
    sendRequest();
  });

  return (
    <Style ownerState={rootProps} className={classes.root}>
      <rootProps.slots.baseTextField
        variant="outlined"
        placeholder={
          isRecording
            ? 'Listening for prompt…'
            : apiRef.current.getLocaleText('toolbarRemoteControlPlaceholder')
        }
        aria-label={apiRef.current.getLocaleText('toolbarRemoteControlLabel')}
        disabled={isLoading}
        value={query}
        style={{ flex: 1 }}
        onChange={handleChange}
        size="small"
        onKeyDown={handleKeyDown}
        InputProps={
          BrowserSpeechRecognition && {
            startAdornment: (
              <InputAdornment position="start">
                {isRecording ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 34,
                      height: 34,
                      borderRadius: '100%',
                      background: 'secondary',
                    }}
                  >
                    <MicrophoneIcon color="primary" />
                  </Box>
                ) : (
                  <RecordButton
                    label={isLoading ? 'Loading…' : undefined}
                    recording={isRecording}
                    setRecording={setRecording}
                    disabled={isLoading}
                    onUpdate={setQuery}
                    onDone={handleDone}
                  />
                )}
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <rootProps.slots.baseIconButton
                  disabled={isLoading || query === ''}
                  color="primary"
                  onClick={sendRequest}
                  size="small"
                  aria-label="Send prompt"
                >
                  <SendIcon fontSize="small" />
                </rootProps.slots.baseIconButton>
              </InputAdornment>
            ),
          }
        }
      />
    </Style>
  );
}

type SpeechRecognitionOptions = {
  onUpdate: (value: string) => void;
  onDone: (value: string) => void;
};
function RecordButton(
  props: SpeechRecognitionOptions & {
    disabled: boolean;
    label?: string;
    recording: boolean;
    setRecording: (value: boolean) => void;
  },
) {
  const rootProps = useGridRootProps() as DataGridProProcessedProps;
  const { recording, setRecording } = props;
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const recognition = useLazyRef(() => {
    const timeout = new Timeout();
    const instance = new BrowserSpeechRecognition();
    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = rootProps.lang ?? 'en-US';

    let finalResult = '';
    let interimResult = '';

    function start(options: SpeechRecognitionOptions) {
      if (recording) {
        return;
      }
      setRecording(true);

      instance.onresult = (event: any) => {
        finalResult = '';
        interimResult = '';
        if (typeof event.results === 'undefined') {
          instance.stop();
          return;
        }

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          } else {
            interimResult += event.results[i][0].transcript;
          }
        }

        if (finalResult === '') {
          options.onUpdate(interimResult);
        }
        timeout.start(1000, () => instance.stop());
      };

      instance.onsoundend = () => {
        instance.stop();
      };

      instance.onend = () => {
        options.onDone(finalResult);
        setRecording(false);
      };

      instance.start();
    }

    return { start };
  }).current;

  const handleClick = useEventCallback(() => {
    recognition.start({ onDone: props.onDone, onUpdate: props.onUpdate });
  });

  return (
    <rootProps.slots.baseTooltip title={recording ? 'Stop recording' : props.label ?? 'Record'}>
      <rootProps.slots.baseIconButton
        disabled={props.disabled}
        onClick={handleClick}
        ref={buttonRef}
        size="small"
      >
        <MicrophoneIcon />
      </rootProps.slots.baseIconButton>
    </rootProps.slots.baseTooltip>
  );
}

RecordButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string,
  onDone: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
} as any;

export { GridToolbarRemoteControl };

function generateContext(
  apiRef: React.MutableRefObject<GridApiPro>,
  rootProps: DataGridProProcessedProps,
) {
  const columns = Object.values(gridColumnLookupSelector(apiRef));
  const rows = rootProps.rows;

  const columnsContext = Object.values(columns).map((c) => ({
    field: c.field,
    description: c.description ?? null,
    examples: rows.slice(0, 5).map(() => {
      const row = rows[Math.floor(Math.random() * rows.length)];
      if (c.valueGetter) {
        return c.valueGetter(row[c.field] as never, row, c, apiRef);
      }
      return row[c.field];
    }),
    type: c.type ?? 'string',
    allowedOperators: c.filterOperators?.map((o) => o.value) ?? [],
  }));

  let context = '';
  if (rootProps.description) {
    context += `The rows represent: ${rootProps.description}\n\n`;
  }
  context += `The columns are described by the following JSON:\n${JSON.stringify(columnsContext)}`;

  return context;
}
