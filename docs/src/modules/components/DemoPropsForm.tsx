import * as React from 'react';

import { alpha } from '@mui/material/styles';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Input, { inputClasses } from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';

import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
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

type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

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
  knob: 'select';
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

type TitleDataType = {
  knob: 'title';
} & DefaultTypes;

export type DataType =
  | NumberDataType
  | SelectDataType
  | RadioDataType
  | SwitchDataType
  | InputDataType
  | TitleDataType;

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
    : DT['knob'] extends 'input' | 'title'
      ? string
      : DT['knob'] extends 'placement'
        ? Placement
        : DT['knob'] extends 'margin'
          ? Margin
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
        (acc, [propName, value]) => ({
          ...acc,
          [propName]: 'defaultValue' in value ? value.defaultValue : undefined,
        }),
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
          sx={{
            fontWeight: 'bold',
            scrollMarginTop: 160,
            fontFamily: 'General Sans',
          }}
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
          pt: 3,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&& > *': {
            px: 3,
          },
        }}
      >
        {Object.entries(data).map(([propName, propData], i) => {
          const { knob, displayName } = propData;
          const defaultValue = 'defaultValue' in propData ? propData.defaultValue : undefined;
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
                  valueLabelDisplay="auto"
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
                        key={value}
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
          if (knob === 'select') {
            const { options } = propData;
            return (
              <FormControl key={propName} size="small">
                <FormLabel>{title}</FormLabel>
                <Select
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
          if (knob === 'title') {
            return (
              <React.Fragment key={propName}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    pt: i !== 0 ? 2 : 0,
                  }}
                >
                  {title}
                </Typography>
                <Divider sx={{ opacity: 0.5 }} />
              </React.Fragment>
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
          return null;
        })}
      </Box>
    </Box>
  );
}
