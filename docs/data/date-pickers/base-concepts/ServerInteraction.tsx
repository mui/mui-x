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
  logsFromOnChange: (Dayjs | null)[];
  logsFromOnAccept: (Dayjs | null)[];
};
function DisplayEvents(props: DisplayEventsProps) {
  const { logsFromOnChange, logsFromOnAccept } = props;
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}>
      <Stack sx={{ minWidth: 180 }}>
        <Typography>onChange</Typography>
        <Divider />
        <Typography component="pre" sx={{ maxHeight: '15rem', overflow: 'auto' }}>
          {logsFromOnChange
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

      <Divider />
      <Stack sx={{ minWidth: 180 }}>
        <Typography>onAccept</Typography>
        <Divider />
        <Typography component="pre">
          {logsFromOnAccept
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
    </Stack>
  );
}

// debounce function
function debounce(func: (...arg: any) => void, wait = 500) {
  let timeout: NodeJS.Timeout;
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

  // Debounced function needs to be memoized to keep the same timeout beween each render.
  // For the same reason, the `onAccept` needs to be wrapped in useCallback.
  const deboucedOnAccept = React.useMemo(() => debounce(onAccept, 1000), [onAccept]);

  return (
    <DateField
      value={value}
      onChange={(newValue, context) => {
        setValue(newValue);
        deboucedOnAccept(newValue);
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
          defaultValue={dayjs(new Date(2020, 10, 5))}
        />
        <DisplayEvents
          logsFromOnChange={logsFromOnChange}
          logsFromOnAccept={logsFromOnAccept}
        />
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
