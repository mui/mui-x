import * as React from 'react';
import clsx from 'clsx';
import { GridRenderEditCellParams } from '@mui/x-data-grid';
import Slider, { SliderProps } from '@mui/material/Slider';
import { ValueLabelProps } from '@mui/core/SliderUnstyled';
import Tooltip from '@mui/material/Tooltip';
import { createStyles, makeStyles } from '@mui/styles';
import { debounce } from '@mui/material/utils';
import { alpha, createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        borderRadius: 0,
      },
      rail: {
        height: '100%',
        backgroundColor: 'transparent',
      },
      track: {
        height: '100%',
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.shorter,
        }),
        '&.low': {
          backgroundColor: '#f44336',
        },
        '&.medium': {
          backgroundColor: '#efbb5aa3',
        },
        '&.high': {
          backgroundColor: '#088208a3',
        },
      },
      thumb: {
        height: '100%',
        width: 5,
        borderRadius: 0,
        marginTop: 0,
        backgroundColor: alpha('#000000', 0.2),
      },
    }),
  { defaultTheme },
);

const ValueLabelComponent = (props: ValueLabelProps) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
};

function EditProgress(props: GridRenderEditCellParams) {
  const classes = useStyles();
  const { id, value, api, field } = props;
  const [valueState, setValueState] = React.useState(Number(value));

  const updateCellEditProps = React.useCallback(
    (newValue) => {
      api.setEditCellValue({ id, field, value: newValue });
    },
    [api, field, id],
  );

  const debouncedUpdateCellEditProps = React.useMemo(
    () => debounce(updateCellEditProps, 60),
    [updateCellEditProps],
  );

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValueState(newValue as number);
    debouncedUpdateCellEditProps(newValue);
  };

  React.useEffect(() => {
    setValueState(Number(value));
  }, [value]);

  const handleRef: SliderProps['ref'] = (element) => {
    if (element) {
      element.querySelector<HTMLElement>('[type="range"]')!.focus();
    }
  };

  return (
    <Slider
      ref={handleRef}
      classes={{
        ...classes,
        track: clsx(classes.track, {
          low: valueState < 0.3,
          medium: valueState >= 0.3 && valueState <= 0.7,
          high: valueState > 0.7,
        }),
      }}
      value={valueState}
      max={1}
      step={0.00001}
      onChange={handleChange}
      components={{ ValueLabel: ValueLabelComponent }}
      valueLabelDisplay="auto"
      valueLabelFormat={(newValue) => `${(newValue * 100).toLocaleString()} %`}
    />
  );
}

export function renderEditProgress(params: GridRenderEditCellParams) {
  return <EditProgress {...params} />;
}
