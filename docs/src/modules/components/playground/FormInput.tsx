import * as React from 'react';

import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Input, { inputClasses } from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { ConfigProperty } from './configuration.type';

export function FormInput<Props, State extends Record<string, any>>({
  property,
  state,
  onStateChange,
}: {
  property: ConfigProperty<Props>;
  state: State;
  onStateChange: (state: State | ((prev: State) => State)) => void;
}) {
  const currentValue = state[property.key] ?? property.default;

  if (property.type === 'radio') {
    if (property.input === 'buttonGroup') {
      const extraFieldForCurrentValue =
        property.extraFields && typeof currentValue === 'string'
          ? property.extraFields[currentValue as keyof typeof property.extraFields]
          : null;
      return (
        <React.Fragment>
          <FormControl key={property.title} size="small">
            <FormLabel>{property.title}</FormLabel>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={currentValue}
              onChange={(event, value) => {
                if (value === null) {
                  return;
                }
                onStateChange((prev) => ({ ...prev, [property.key]: value }));
              }}
            >
              {property.values.map((option) => (
                <ToggleButton key={option} value={option}>
                  {option}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FormControl>
          {extraFieldForCurrentValue ? (
            <FormInput
              property={extraFieldForCurrentValue}
              state={state}
              onStateChange={onStateChange}
            />
          ) : null}
        </React.Fragment>
      );
    }
    return (
      <FormControl key={property.title} size="small">
        <FormLabel>{property.title}</FormLabel>
        <RadioGroup
          name={property.title}
          value={currentValue}
          onChange={(event) => {
            const value = event.target.value;
            onStateChange((prev) => ({ ...prev, [property.key]: value }));
          }}
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
          {property.values.map((option) => (
            <FormControlLabel
              key={option}
              control={<Radio size="small" />}
              label={<Typography>{option}</Typography>}
              value={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }

  if (property.type === 'boolean') {
    return (
      <FormControl key={property.title} disabled={property.disabled?.(state)}>
        <FormLabel>{property.title}</FormLabel>
        <Switch
          size="small"
          disabled={property.disabled?.(state)}
          checked={Boolean(currentValue)}
          onChange={(event) => {
            const value = event.target.checked;
            onStateChange((prev) => ({ ...prev, [property.key]: value }));
          }}
        />
      </FormControl>
    );
  }
  if (property.type === 'number') {
    if (property.input === 'slider') {
      return (
        <FormControl key={property.title} disabled={property.disabled?.(state)}>
          <FormLabel>{property.title}</FormLabel>
          <Slider
            disabled={property.disabled?.(state)}
            size="small"
            valueLabelDisplay="auto"
            value={typeof currentValue === 'number' ? currentValue : property.default}
            onChange={(event, value) => {
              if (typeof value === 'number') {
                onStateChange((prev) => ({ ...prev, [property.key]: value }));
              }
            }}
            min={property.min}
            max={property.max}
            step={property.step ?? 1}
          />
        </FormControl>
      );
    }

    return (
      <FormControl key={property.title} disabled={property.disabled?.(state)}>
        <FormLabel>{property.title}</FormLabel>
        <Input
          disabled={property.disabled?.(state)}
          size="small"
          type="number"
          value={typeof currentValue === 'number' ? currentValue : property.default}
          onChange={(event) => {
            const parsed = Number.parseFloat(event.target.value);
            if (Number.isNaN(parsed)) {
              return;
            }
            onStateChange((prev) => ({ ...prev, [property.key]: parsed }));
          }}
          slotProps={{
            input: {
              min: property.min,
              max: property.max,
              step: property.step ?? 1,
            },
          }}
          sx={{
            [`& .${inputClasses.root}`]: {
              bgcolor: 'background.body',
            },
          }}
        />
      </FormControl>
    );
  }

  return null;
}
