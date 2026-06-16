import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export interface BaseControlProps {
  label: string;
  helperText?: string;
  disabled?: boolean;
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

function PropCard({
  label,
  meta,
  helperText,
  children,
}: {
  label: string;
  meta?: React.ReactNode;
  helperText?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={(theme) => ({
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'background.paper',
        px: 1.25,
        py: 1,
        minWidth: 0,
      })}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 1,
          minWidth: 0,
          mb: 0.75,
        }}
      >
        <Typography
          variant="caption"
          sx={(theme) => ({
            fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.3,
            overflowWrap: 'anywhere',
            minWidth: 0,
          })}
        >
          {label}
        </Typography>
        {meta ? (
          <Typography
            variant="caption"
            sx={(theme) => ({
              fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
              fontSize: '0.68rem',
              color: 'text.secondary',
              lineHeight: 1.3,
              flexShrink: 0,
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {meta}
          </Typography>
        ) : null}
      </Box>
      {helperText ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            fontSize: '0.65rem',
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          {helperText}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}

export interface SwitchControlProps extends BaseControlProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchControl({
  label,
  helperText,
  checked,
  onChange,
  disabled = false,
}: SwitchControlProps) {
  return (
    <Box
      sx={(theme) => ({
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'background.paper',
        px: 1.25,
        py: 0.625,
        minWidth: 0,
      })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          minWidth: 0,
        }}
      >
        <Typography
          variant="caption"
          sx={(theme) => ({
            fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'text.primary',
            lineHeight: 1.3,
            overflowWrap: 'anywhere',
            minWidth: 0,
            flex: 1,
          })}
        >
          {label}
        </Typography>
        <Switch
          size="small"
          checked={checked}
          disabled={disabled}
          onChange={(_, next) => onChange(next)}
          slotProps={{ input: { 'aria-label': label } }}
          sx={{ mr: -0.5, flexShrink: 0 }}
        />
      </Box>
      {helperText ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            fontSize: '0.65rem',
            lineHeight: 1.3,
            mt: 0.5,
          }}
        >
          {helperText}
        </Typography>
      ) : null}
    </Box>
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
    <PropCard label={label} helperText={helperText} meta={`enum · ${options.length}`}>
      <RadioGroup
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        aria-label={label}
        sx={{ gap: 0.25 }}
      >
        {options.map((option) => {
          const optionValue = getOptionValue(option);
          const isSelected = optionValue === value;
          return (
            <FormControlLabel
              key={optionValue}
              value={optionValue}
              disabled={disabled || isOptionDisabled(option)}
              control={
                <Radio
                  size="small"
                  sx={{
                    p: 0.5,
                    '& .MuiSvgIcon-root': { fontSize: 16 },
                  }}
                />
              }
              label={
                <Typography
                  variant="caption"
                  sx={(theme) => ({
                    fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
                    fontSize: '0.74rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'primary.main' : 'text.primary',
                    lineHeight: 1.4,
                  })}
                >
                  {getOptionLabel(option)}
                </Typography>
              }
              sx={(theme) => {
                const isDark = theme.palette.mode === 'dark';
                const selectedBg = isDark
                  ? 'rgba(144, 202, 249, 0.12)'
                  : 'rgba(25, 118, 210, 0.08)';
                const selectedHoverBg = isDark
                  ? 'rgba(144, 202, 249, 0.16)'
                  : 'rgba(25, 118, 210, 0.12)';
                return {
                  m: 0,
                  pl: 0.25,
                  pr: 1,
                  py: 0.125,
                  borderRadius: 1,
                  gap: 0.5,
                  width: '100%',
                  bgcolor: isSelected ? selectedBg : 'transparent',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: isSelected ? selectedHoverBg : theme.palette.action.hover,
                  },
                  '& .MuiFormControlLabel-label': { minWidth: 0, flex: 1 },
                };
              }}
            />
          );
        })}
      </RadioGroup>
    </PropCard>
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
    <PropCard label={label} helperText={helperText} meta={`enum · ${options.length}`}>
      <TextField
        size="small"
        select
        value={value}
        disabled={disabled}
        fullWidth
        onChange={(event) => onChange(event.target.value as T)}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.75rem',
            fontFamily: (theme) => theme.typography.fontFamilyCode ?? 'Menlo, monospace',
          },
          '& .MuiSelect-select': {
            py: 0.625,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            disabled={isOptionDisabled(option)}
            sx={{ fontSize: '0.8rem' }}
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
    </PropCard>
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
    <PropCard
      label={label}
      helperText={helperText}
      meta={
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
          {valueFormatter ? valueFormatter(value) : value}
        </Box>
      }
    >
      <Slider
        size="small"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={label}
        onChange={(_, next) => onChange(typeof next === 'number' ? next : next[0])}
        sx={{ py: 0.5, display: 'block' }}
      />
    </PropCard>
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
    <PropCard label={label} helperText={helperText} meta="string">
      <TextField
        size="small"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth
        onChange={(event) => onChange(event.target.value)}
        multiline={multiline}
        minRows={rows}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.75rem',
            fontFamily: (theme) => theme.typography.fontFamilyCode ?? 'Menlo, monospace',
          },
          '& .MuiOutlinedInput-input': {
            py: 0.625,
          },
        }}
      />
    </PropCard>
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
        pt: 0.5,
        '&::before, &::after': {
          content: '""',
          flex: 1,
          height: '1px',
          backgroundColor: 'divider',
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontWeight: 600,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
