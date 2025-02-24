/* eslint-disable  */

import * as React from 'react';
import Check from '@mui/icons-material/Check';

import { alpha } from '@mui/material/styles';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import FormControl from '@mui/material/FormControl';
import FormLabel, { formLabelClasses } from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Input, { inputClasses } from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';

import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const shallowEqual = (item1: { [k: string]: any }, item2: { [k: string]: any }) => {
  let equal = true;
  Object.entries(item1).forEach(([key, value]: [string, any]) => {
    if (item2[key] !== value) {
      equal = false;
    }
  });
  return equal;
};

type Placement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'left-start'
  | 'right-start'
  | 'left'
  | 'right'
  | 'left-end'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end';

type DefaultTypes = {
  /**
   * The display name of the prop, for example 'X Axis Label'
   */
  displayName?: string;
};

type ConditionalTypes = {
  /**
   * The options for these knobs: `select` and `radio`
   */
  options: readonly string[];
  /**
   * The labels for these knobs: `radio`
   */
  labels?: readonly string[];
  /**
   * Option for knobs: `number`
   */
  step?: number;
  /**
   * Option for knobs: `number`
   */
  min?: number;
  /**
   * Option for knobs: `number`
   */
  max?: number;
};

type NumberDataType = {
  knob: 'number' | 'slider';
  /**
   * The default value to be used by the components.
   */
  defaultValue?: number;
} & DefaultTypes &
  Pick<ConditionalTypes, 'step' | 'min' | 'max'>;

type SelectDataType = {
  knob: 'select' | 'color';
  /**
   * The default value to be used by the components.
   */
  defaultValue?: string;
} & DefaultTypes &
  Pick<ConditionalTypes, 'options'>;

type RadioDataType = {
  knob: 'radio';
  /**
   * The default value to be used by the components.
   */
  defaultValue?: string;
} & DefaultTypes &
  Pick<ConditionalTypes, 'options' | 'labels'>;

type SwitchDataType = {
  knob: 'switch';
  /**
   * The default value to be used by the components.
   */
  defaultValue?: boolean;
} & DefaultTypes;

type InputDataType = {
  knob: 'input';
  /**
   * The default value to be used by the components.
   */
  defaultValue?: string;
} & DefaultTypes;

type PlacementDataType = {
  knob: 'placement';
  /**
   * The default value to be used by the components.
   */
  defaultValue?: Placement;
} & DefaultTypes;

export type DataType =
  | NumberDataType
  | SelectDataType
  | RadioDataType
  | SwitchDataType
  | InputDataType
  | PlacementDataType;

export type PropsFromData<Data extends Record<string, DataType>> = {
  [K in keyof Data]: Data[K] extends { options: readonly (infer T)[] }
    ? Data[K] extends { defaultValue: any }
      ? T
      : T | undefined
    : Data[K] extends { defaultValue: any }
      ? FromKnob<Data[K]>
      : FromKnob<Data[K]> | undefined;
};

export type FromKnob<DT extends DataType> = DT['knob'] extends 'number' | 'slider'
  ? number
  : DT['knob'] extends 'switch'
    ? boolean
    : DT['knob'] extends 'input'
      ? string
      : DT['knob'] extends 'placement'
        ? Placement
        : never;

interface ChartDemoPropsFormProps<
  Data extends Record<string, DataType>,
  Props extends PropsFromData<Data>,
> {
  /**
   * Name of the component to show in the code block.
   */
  componentName: string;
  /**
   * Configuration
   */
  data: Data;
  /**
   * Props to be displayed in the form
   */
  props: Props;
  onPropsChange: (state: Props | ((prevState: Props) => Props)) => void;
}

export default function ChartDemoPropsForm<
  Data extends Record<string, DataType>,
  Props extends PropsFromData<Data>,
>({ componentName, data, props, onPropsChange }: ChartDemoPropsFormProps<Data, Props>) {
  const initialProps = React.useMemo(
    () =>
      Object.entries(data).reduce(
        (acc, [propName, value]) => ({ ...acc, [propName]: value.defaultValue }),
        {} as Props,
      ),
    [data],
  );

  return (
    <Box
      sx={(theme) => ({
        flexShrink: 0,
        gap: 2,
        borderLeft: '1px solid',
        borderColor: theme.palette.grey[200],
        background: alpha(theme.palette.grey[50], 0.5),
        minWidth: '250px',
        [`:where(${theme.vars ? '[data-mui-color-scheme="dark"]' : '.mode-dark'}) &`]: {
          borderColor: alpha(theme.palette.grey[900], 0.8),
          backgroundColor: alpha(theme.palette.grey[900], 0.3),
        },
      })}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          id="usage-props"
          component="h3"
          fontWeight="bold"
          sx={{ scrollMarginTop: 160, fontFamily: 'General Sans' }}
        >
          Playground
        </Typography>
        <IconButton
          aria-label="Reset all"
          size="small"
          onClick={() => onPropsChange(initialProps)}
          sx={{
            visibility: !shallowEqual(props, initialProps) ? 'visible' : 'hidden',
            '--IconButton-size': '30px',
          }}
        >
          <ReplayRoundedIcon />
        </IconButton>
      </Box>
      <Divider sx={{ opacity: 0.5 }} />
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          [`& .${formLabelClasses.root}`]: {
            fontWeight: 'lg',
          },
        }}
      >
        {Object.entries(data).map(([propName, propData]) => {
          const { knob, defaultValue, displayName } = propData;
          const resolvedValue = props[propName] ?? defaultValue;
          const title = displayName || propName;
          if (!knob) {
            return null;
          }
          if (knob === 'switch') {
            return (
              <FormControl
                key={propName}
                size="small"
                sx={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}
              >
                <FormLabel>{title}</FormLabel>
                <Switch
                  checked={Boolean(resolvedValue)}
                  onChange={(event) =>
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: event.target.checked,
                    }))
                  }
                />
              </FormControl>
            );
          }
          if (knob === 'slider') {
            const { step, min, max } = propData;
            return (
              <FormControl key={propName}>
                <FormLabel>{title}</FormLabel>
                <Slider
                  value={Number.parseFloat(`${resolvedValue}`)}
                  onChange={(_, value) =>
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: Number.parseFloat(`${value}`),
                    }))
                  }
                  step={step}
                  min={min}
                  max={max}
                />
              </FormControl>
            );
          }
          if (knob === 'radio') {
            const { options, labels } = propData;
            const labelId = `${componentName}-${propName}`;
            return (
              <FormControl key={propName} size="small">
                <FormLabel>{title}</FormLabel>
                <RadioGroup
                  // orientation="horizontal"
                  name={labelId}
                  value={resolvedValue}
                  onChange={(event) => {
                    let value: string | boolean | undefined = event.target.value;
                    if (value === 'true') {
                      value = true;
                    } else if (value === 'false') {
                      value = false;
                    } else if (value === 'undefined') {
                      value = undefined;
                    }
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: value,
                    }));
                  }}
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {options.map((value: string, index: number) => {
                    const checked = String(resolvedValue) === value;
                    return (
                      <FormControlLabel
                        control={<Radio size="small" />}
                        // variant={checked ? 'solid' : 'outlined'}
                        color={checked ? 'primary' : 'info'}
                        label={<Typography>{labels?.[index] || value}</Typography>}
                        value={value}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            );
          }
          if (knob === 'color') {
            const { options } = propData;
            return (
              <FormControl key={propName} sx={{ mb: 1 }} size="small">
                <FormLabel>{title}</FormLabel>
                <RadioGroup
                  name={`${componentName}-color`}
                  value={resolvedValue || ''}
                  onChange={(event) =>
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: event.target.value,
                    }))
                  }
                  sx={{ flexWrap: 'wrap', gap: 1.5, display: 'flex', flexDirection: 'row' }}
                >
                  {options.map((value) => {
                    return (
                      <FormControlLabel
                        control={<ControlledColorRadio />}
                        label={value}
                        value={value}
                        labelPlacement="bottom"
                        sx={{
                          [`& .${formControlLabelClasses.label}`]: {
                            fontSize: '10px',
                            color: 'text.secondary',
                          },
                        }}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            );
          }
          if (knob === 'select') {
            const { options } = propData;
            return (
              <FormControl key={propName} size="small">
                <FormLabel>{title}</FormLabel>
                <Select
                  placeholder="Select a variant..."
                  value={resolvedValue || 'none'}
                  onChange={(event) =>
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: event.target.value,
                    }))
                  }
                >
                  {options.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
          if (knob === 'input') {
            return (
              <FormControl key={propName}>
                <FormLabel>{title}</FormLabel>
                <Input
                  size="small"
                  value={props[propName] ?? ''}
                  onChange={(event) =>
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: event.target.value,
                    }))
                  }
                  sx={{
                    textTransform: 'capitalize',
                    [`& .${inputClasses.root}`]: {
                      bgcolor: 'background.body',
                    },
                  }}
                />
              </FormControl>
            );
          }
          if (knob === 'number') {
            const { step, min, max } = propData;
            return (
              <FormControl key={propName}>
                <FormLabel>{title}</FormLabel>
                <Input
                  size="small"
                  type="number"
                  value={typeof props[propName] === 'number' ? props[propName] : defaultValue}
                  onChange={(event) => {
                    if (Number.isNaN(Number.parseFloat(event.target.value))) {
                      return;
                    }
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: Number.parseFloat(event.target.value),
                    }));
                  }}
                  sx={{
                    textTransform: 'capitalize',
                    [`& .${inputClasses.root}`]: {
                      bgcolor: 'background.body',
                    },
                  }}
                  slotProps={{
                    input: {
                      step,
                      min,
                      max,
                    },
                  }}
                />
              </FormControl>
            );
          }
          if (knob === 'placement') {
            return (
              <FormControl key={propName}>
                <FormLabel>{displayName ?? 'Placement'}</FormLabel>
                <RadioGroup
                  name="placement"
                  value={resolvedValue}
                  onChange={(event) =>
                    onPropsChange((latestProps) => ({
                      ...latestProps,
                      [propName]: event.target.value,
                    }))
                  }
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 1fr 1fr 40px',
                      gridTemplateRows: 'repeat(5, 20px)',
                      gridAutoFlow: 'row dense',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        gridRow: '2 / -2',
                        gridColumn: '2 / -2',
                        fontSize: 'sm',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 'sm',
                        alignSelf: 'stretch',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'md',
                        color: 'text.secondary',
                      }}
                    >
                      {`${resolvedValue}`}
                    </Box>
                    {/* void */}
                    <div />
                    <Box sx={{ gridColumn: '-1 / -2', gridRow: '1' }} />
                    <Box sx={{ gridRow: '-1 / -2', gridColumn: '1' }} />
                    {/* void */}
                    {[
                      'top-start',
                      'top',
                      'top-end',
                      'left-start',
                      'right-start',
                      'left',
                      'right',
                      'left-end',
                      'right-end',
                      'bottom-start',
                      'bottom',
                      'bottom-end',
                    ].map((placement) => (
                      <Paper
                        key={placement}
                        // variant="soft"
                        color="primary"
                        sx={[
                          {
                            position: 'relative',
                            height: '14px',
                            width: 32,
                            borderRadius: 'xs',
                            mx: 0.5,
                          },
                          placement.match(/^(top|bottom)$/) && {
                            justifySelf: 'center',
                          },
                          placement.match(/^(top-end|bottom-end)$/) && {
                            justifySelf: 'flex-end',
                          },
                        ]}
                      >
                        <Radio
                          value={placement}
                          // overlay
                          // disableIcon
                          // slotProps={{
                          //   action: ({ checked }) => ({
                          //     sx: (theme) => ({
                          //       ...(checked && {
                          //         ...theme.variants.solid.primary,
                          //         '&:hover': theme.variants.solid.primary,
                          //       }),
                          //     }),
                          //   }),
                          // }}
                        />
                      </Paper>
                    ))}
                  </Box>
                </RadioGroup>
              </FormControl>
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
}

function ControlledColorRadio(props: any) {
  const { value, ...other } = props;
  return (
    <Paper
      color={value}
      sx={{
        width: 28,
        height: 28,
        borderRadius: 'sm',
        textTransform: 'capitalize',
        position: 'relative',
        bgcolor: value,
      }}
    >
      <Radio
        {...other}
        value={value}
        icon={<Check sx={{ opacity: 0 }} />}
        checkedIcon={
          <Check
            fontSize="medium"
            color="inherit"
            sx={(theme) => ({
              zIndex: 1,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              color: theme.palette.background.default,
            })}
          />
        }
        sx={{ width: '100%', height: '100%', margin: 0 }}
      />
    </Paper>
  );
}
