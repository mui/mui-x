import * as React from 'react';

import { alpha } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Input, { inputClasses } from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { ConfigSection } from './configuration.type';

type PlaygroundState = Record<string, unknown>;

interface PlaygroundFormProps<Props extends Record<string, unknown>> {
  config: ConfigSection<Props>[];
  state: PlaygroundState;
  onStateChange: (state: PlaygroundState | ((prev: PlaygroundState) => PlaygroundState)) => void;
}

export default function PlaygroundForm<Props extends Record<string, unknown>>({
  config,
  state,
  onStateChange,
}: PlaygroundFormProps<Props>) {
  return (
    <Box
      sx={(theme) => ({
        flexShrink: 0,
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
      {config.map((section) => (
        <Accordion key={section.title} defaultExpanded disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Typography sx={{ fontWeight: 'bold' }}>{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pb: 2,
            }}
          >
            {section.properties.map((property) => {
              const resolvedKey =
                typeof property.key === 'function' ? property.key(state) : property.key;
              const resolvedValueConfig =
                typeof property.value === 'function' ? property.value(state) : property.value;
              const currentValue = state[resolvedKey] ?? resolvedValueConfig.default;

              if (resolvedValueConfig.type === 'radio') {
                if (resolvedValueConfig.input === 'buttonGroup') {
                  return (
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
                          onStateChange((prev) => ({ ...prev, [resolvedKey]: value }));
                        }}
                      >
                        {resolvedValueConfig.values.map((option) => (
                          <ToggleButton key={option} value={option}>
                            {option}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </FormControl>
                  );
                }
                return (
                  <FormControl key={property.title} size="small">
                    <FormLabel>{property.title}</FormLabel>
                    <RadioGroup
                      name={resolvedKey}
                      value={currentValue}
                      onChange={(event) => {
                        const value = event.target.value;
                        onStateChange((prev) => ({ ...prev, [resolvedKey]: value }));
                      }}
                      sx={{ flexWrap: 'wrap', gap: 1 }}
                    >
                      {resolvedValueConfig.values.map((option) => (
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

              if (resolvedValueConfig.type === 'boolean') {
                return (
                  <FormControl key={property.title} disabled={property.disabled?.(state)}>
                    <FormLabel>{property.title}</FormLabel>
                    <Switch
                      size="small"
                      disabled={property.disabled?.(state)}
                      checked={Boolean(currentValue)}
                      onChange={(event) => {
                        const value = event.target.checked;
                        onStateChange((prev) => ({ ...prev, [resolvedKey]: value }));
                      }}
                    />
                  </FormControl>
                );
              }
              if (resolvedValueConfig.type === 'number') {
                if (resolvedValueConfig.input === 'slider') {
                  return (
                    <FormControl key={property.title} disabled={property.disabled?.(state)}>
                      <FormLabel>{property.title}</FormLabel>
                      <Slider
                        disabled={property.disabled?.(state)}
                        size="small"
                        value={
                          typeof currentValue === 'number'
                            ? currentValue
                            : resolvedValueConfig.default
                        }
                        onChange={(event, value) => {
                          if (typeof value === 'number') {
                            onStateChange((prev) => ({ ...prev, [resolvedKey]: value }));
                          }
                        }}
                        min={resolvedValueConfig.min}
                        max={resolvedValueConfig.max}
                        step={resolvedValueConfig.step ?? 1}
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
                      value={
                        typeof currentValue === 'number'
                          ? currentValue
                          : resolvedValueConfig.default
                      }
                      onChange={(event) => {
                        const parsed = Number.parseFloat(event.target.value);
                        if (Number.isNaN(parsed)) {
                          return;
                        }
                        onStateChange((prev) => ({ ...prev, [resolvedKey]: parsed }));
                      }}
                      slotProps={{
                        input: {
                          min: resolvedValueConfig.min,
                          max: resolvedValueConfig.max,
                          step: resolvedValueConfig.step ?? 1,
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
            })}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
