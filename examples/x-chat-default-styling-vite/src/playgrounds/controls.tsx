import * as React from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Slider,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

export interface BaseControlProps {
  label: string;
  helperText?: string;
  disabled?: boolean;
}

export interface SwitchControlProps extends BaseControlProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export type ControlOption<T extends string> =
  | T
  | {
      value: T;
      label?: React.ReactNode;
      description?: string;
      disabled?: boolean;
    };

function getOptionValue<T extends string>(option: ControlOption<T>) {
  return typeof option === 'string' ? option : option.value;
}

function getOptionLabel<T extends string>(option: ControlOption<T>) {
  return typeof option === 'string' ? option : (option.label ?? option.value);
}

function getOptionDescription<T extends string>(option: ControlOption<T>) {
  return typeof option === 'string' ? undefined : option.description;
}

function isOptionDisabled<T extends string>(option: ControlOption<T>) {
  return typeof option === 'string' ? false : Boolean(option.disabled);
}

export function SwitchControl({
  label,
  helperText,
  checked,
  onChange,
  disabled = false,
}: SwitchControlProps) {
  return (
    <Stack spacing={0}>
      <FormControlLabel
        disabled={disabled}
        control={
          <Switch
            size="small"
            checked={checked}
            disabled={disabled}
            onChange={(_, next) => onChange(next)}
          />
        }
        label={<Typography variant="body2">{label}</Typography>}
        sx={{ mr: 0 }}
      />
      {helperText ? (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 6 }}>
          {helperText}
        </Typography>
      ) : null}
    </Stack>
  );
}

export interface ChoiceControlProps<T extends string> extends BaseControlProps {
  value: T;
  options: ReadonlyArray<ControlOption<T>>;
  onChange: (value: T) => void;
}

export function ChoiceControl<T extends string>({
  label,
  helperText,
  value,
  options,
  onChange,
  disabled = false,
}: ChoiceControlProps<T>) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value}
        disabled={disabled}
        onChange={(_, next) => {
          if (next != null) {
            onChange(next as T);
          }
        }}
        aria-label={label}
        sx={{
          flexWrap: 'wrap',
          '& .MuiToggleButton-root': { textTransform: 'none', py: 0.25, minHeight: 32 },
        }}
      >
        {options.map((option) => (
          <ToggleButton
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            disabled={isOptionDisabled(option)}
          >
            {getOptionLabel(option)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {helperText ? (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      ) : null}
    </Stack>
  );
}

export interface SelectControlProps<T extends string> extends BaseControlProps {
  value: T;
  options: ReadonlyArray<ControlOption<T>>;
  onChange: (value: T) => void;
}

export function SelectControl<T extends string>({
  label,
  helperText,
  value,
  options,
  onChange,
  disabled = false,
}: SelectControlProps<T>) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <TextField
        size="small"
        select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T)}
        helperText={helperText}
      >
        {options.map((option) => (
          <MenuItem
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            disabled={isOptionDisabled(option)}
          >
            {getOptionDescription(option) ? (
              <Stack spacing={0}>
                <Typography variant="body2">{getOptionLabel(option)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {getOptionDescription(option)}
                </Typography>
              </Stack>
            ) : (
              getOptionLabel(option)
            )}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}

export interface NumberControlProps extends BaseControlProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  valueFormatter?: (value: number) => React.ReactNode;
  onChange: (value: number) => void;
}

export function NumberControl({
  label,
  helperText,
  value,
  min,
  max,
  step = 1,
  disabled = false,
  valueFormatter,
  onChange,
}: NumberControlProps) {
  return (
    <Stack spacing={0.5}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="caption"
          color="text.primary"
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {valueFormatter ? valueFormatter(value) : value}
        </Typography>
      </Box>
      <Slider
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={label}
        onChange={(_, next) => onChange(typeof next === 'number' ? next : next[0])}
      />
      {helperText ? (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      ) : null}
    </Stack>
  );
}

export interface TextControlProps extends BaseControlProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextControl({
  label,
  helperText,
  value,
  onChange,
  placeholder,
  multiline,
  rows,
  disabled = false,
}: TextControlProps) {
  return (
    <TextField
      size="small"
      label={label}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      helperText={helperText}
      multiline={multiline}
      minRows={rows}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
}

export interface DividerLabelProps {
  children: React.ReactNode;
}

export function DividerLabel({ children }: DividerLabelProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '&::before, &::after': {
          content: '""',
          flex: 1,
          height: '1px',
          backgroundColor: 'divider',
        },
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {children}
      </Typography>
    </Box>
  );
}

export interface ResetButtonProps {
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
}

export function ResetButton({
  onClick,
  tooltip = 'Reset to defaults',
  disabled = false,
}: ResetButtonProps) {
  return (
    <Tooltip title={tooltip} arrow placement="top">
      <Button
        size="small"
        variant="text"
        onClick={onClick}
        disabled={disabled}
        startIcon={<RefreshIcon />}
        sx={{
          textTransform: 'none',
          color: 'text.secondary',
          fontSize: '0.75rem',
          py: 0.25,
          '&:hover': {
            color: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        Reset
      </Button>
    </Tooltip>
  );
}

export interface ControlGroupProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function ControlGroup({ label, description, children }: ControlGroupProps) {
  return (
    <Stack spacing={1}>
      <Stack spacing={0.25}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
            fontSize: '0.65rem',
          }}
        >
          {label}
        </Typography>
        {description ? (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Stack>
      <Stack spacing={1.5}>{children}</Stack>
    </Stack>
  );
}
