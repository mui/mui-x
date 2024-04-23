import * as React from 'react';
import { styled } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { Timeout } from '@mui/utils/useTimeout';
import useLazyRef from '@mui/utils/useLazyRef';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
import {
  getDataGridUtilityClass,
  useGridApiContext,
  useGridRootProps,
  gridColumnLookupSelector,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

type OwnerState = DataGridProProcessedProps;

const REMOTE_ENDPOINT = 'http://localhost:3006'


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

export type GridToolbarRemoteControlProps = {};

function GridToolbarRemoteControl(props: GridToolbarRemoteControlProps) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps() as DataGridProProcessedProps;
  const classes = useUtilityClasses(rootProps);
  const [isLoading, setLoading] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const sendRequest = React.useCallback(() => {
    const context = generateContext(apiRef, rootProps)

    setLoading(true)
    fetch(`${REMOTE_ENDPOINT}/api/v1`, {
      mode: 'cors',
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      redirect: 'follow',
      body: JSON.stringify({
        context: JSON.stringify(context),
        query,
      }),
    })
    .then(result => result.json())
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [apiRef, rootProps, query])

  const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  })

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      sendRequest()
    }
  })

  const handleDone = useEventCallback((value: string) => {
    setQuery(value)
    sendRequest()
  })

  return (
    <Style ownerState={rootProps} className={classes.root}>
      <RecordButton
        onUpdate={setQuery}
        onDone={handleDone}
      />
      <rootProps.slots.baseTextField
        variant="standard"
        placeholder={apiRef.current.getLocaleText('toolbarRemoteControlPlaceholder')}
        aria-label={apiRef.current.getLocaleText('toolbarRemoteControlLabel')}
        disabled={isLoading}
        value={query}
        style={{ flex: 1 }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </Style>
  );
}

const BrowserSpeechRecognition = (globalThis as any).webkitSpeechRecognition
type SpeechRecognitionOptions = { onUpdate: (value: string) => void, onDone: (value: string) => void }
function RecordButton(props: SpeechRecognitionOptions) {
  if (!BrowserSpeechRecognition) {
    return null
  }

  const rootProps = useGridRootProps() as DataGridProProcessedProps;
  const [isRecording, setRecording] = React.useState(false)

  const recognition = useLazyRef(() => {
    const timeout = new Timeout()
    const instance = new BrowserSpeechRecognition()
    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = rootProps.lang ?? 'en-US';

    let finalResult = ''
    let interimResult = ''

    // XXX: handle this
    // instance.onerror = (event: ErrorEvent) => {};

    function start(options: SpeechRecognitionOptions) {
      if (isRecording) {
        return;
      }
      setRecording(true)

      instance.onresult = (event: any) => {
        finalResult = '';
        interimResult = '';
        if (typeof event.results == 'undefined') {
          return instance.stop();
        }

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          } else {
            interimResult += event.results[i][0].transcript;
          }
        }

        if (finalResult === '') {
          options.onUpdate(interimResult)
        }
        timeout.start(1000, () => instance.stop())
      };

      instance.onsoundend = () => {
        console.log('SOUND_END')
        instance.stop();
      }

      instance.onend = () => {
        console.log('END')
        options.onDone(finalResult)
        setRecording(false)
      }

      instance.start()
    }

    return { start }
  }).current;

  const handleClick = useEventCallback(() => {
    recognition.start(props)
  })

  return (
    <rootProps.slots.baseButton onClick={handleClick}>
      Voice
    </rootProps.slots.baseButton> // XXX: l11n
  )
}

GridToolbarRemoteControl.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
} as any;

export { GridToolbarRemoteControl };


function generateContext(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  rootProps: DataGridProProcessedProps
) {
  const columns = Object.values(gridColumnLookupSelector(apiRef))
  const rows = rootProps.rows

  const columnsContext = Object.values(columns).map(c => ({
    field: c.field,
    description: c.description ?? null,
    examples: rows.slice(0, 5).map(() => {
      const row = rows[~~(Math.random() * rows.length)]
      if (c.valueGetter) {
        return c.valueGetter(row[c.field] as never, row, c, apiRef)
      }
      return row[c.field]
    }),
    type: c.type ?? 'string',
    allowedOperators: c.filterOperators?.map(o => o.value) ?? []
  }))

  const context =
    (rootProps.description ? `The rows represent: ${rootProps.description}\n\n` : '')
    + `The columns are described by the following JSON:\n${JSON.stringify(columnsContext)}`

  return context
}
