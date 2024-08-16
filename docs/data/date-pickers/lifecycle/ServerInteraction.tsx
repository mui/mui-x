import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField, DateFieldProps } from '@mui/x-date-pickers/DateField';
import useControlled from '@mui/utils/useControlled';

type DisplayEventsProps = {
  logs: (Dayjs | null)[];
  title: string;
};
function DisplayEvents(props: DisplayEventsProps) {
  const { logs, title } = props;
  return (
    <Stack sx={{ minWidth: 180 }}>
      <Typography>{title}</Typography>
      <Divider />
      <Typography component="pre" sx={{ maxHeight: '15rem', overflow: 'auto' }}>
        {logs
          .map(
            (value) =>
              `- ${
                // eslint-disable-next-line no-nested-ternary
                value === null
                  ? 'null'
                  : value.isValid()
                    ? value.format('DD/MM/YYYY')
                    : 'Invalid Date'
              }`,
          )
          .join('\n')}
      </Typography>
    </Stack>
  );
}

// debounce function
function debounce(func: (...arg: any) => void, wait = 500) {
  let timeout: ReturnType<typeof setTimeout>;
  function debounced(...args: any) {
    const later = () => {
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced;
}

function DateFieldWithAccept(
  props: DateFieldProps<Dayjs> & { onAccept: (value: Dayjs | null) => void },
) {
  const { value: valueProp, onAccept, onChange, ...other } = props;

  const [value, setValue] = useControlled<Dayjs | null>({
    name: 'FieldAcceptValue',
    state: 'value',
    controlled: valueProp,
    default: null,
  });

  // Debounced function needs to be memoized to keep the same timeout between each render.
  // For the same reason, the `onAccept` needs to be wrapped in useCallback.
  const debouncedOnAccept = React.useMemo(
    () => debounce(onAccept, 1000),
    [onAccept],
  );

  return (
    <DateField
      value={value}
      onChange={(newValue, context) => {
        setValue(newValue);
        debouncedOnAccept(newValue);
        onChange?.(newValue, context);
      }}
      {...other}
    />
  );
}

export default function ServerInteraction() {
  const [logsFromOnChange, setLogsFromOnChange] = React.useState<(Dayjs | null)[]>(
    [],
  );
  const [logsFromOnAccept, setLogsFromOnAccept] = React.useState<(Dayjs | null)[]>(
    [],
  );

  const onAccept = React.useCallback((newValue: Dayjs | null) => {
    setLogsFromOnAccept((prev) => [newValue, ...prev]);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack sx={{ textAlign: 'center', alignItems: 'center' }}>
        <DateFieldWithAccept
          onAccept={onAccept}
          onChange={(newValue) => {
            setLogsFromOnChange((prev) => [newValue, ...prev]);
          }}
          sx={{ width: 150 }}
          label="debounced field"
          defaultValue={dayjs('2022-04-17')}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}>
          <DisplayEvents logs={logsFromOnChange} title="onChange" />
          <Divider />
          <DisplayEvents logs={logsFromOnAccept} title="onAccept" />
        </Stack>

        <Button
          sx={{ ml: 'auto' }}
          variant="outlined"
          onClick={() => {
            setLogsFromOnChange([]);
            setLogsFromOnAccept([]);
          }}
        >
          Clear logs
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
