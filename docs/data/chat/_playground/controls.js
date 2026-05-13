import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

function getOptionValue(option) {
  return typeof option === 'string' ? option : option.value;
}

function getOptionLabel(option) {
  return typeof option === 'string' ? option : (option.label ?? option.value);
}

function getOptionDescription(option) {
  return typeof option === 'string' ? undefined : option.description;
}

function isOptionDisabled(option) {
  return typeof option === 'string' ? false : Boolean(option.disabled);
}

function PropCard({ label, meta, helperText, children }) {
  return (
    <Box
      sx={(theme) => ({
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'background.paper',
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

export function SwitchControl({
  label,
  helperText,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <Box
      sx={(theme) => ({
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'background.paper',
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

export function ChoiceControl({
  label,
  helperText,
  value,
  options,
  onChange,
  disabled = false,
}) {
  return (
    <PropCard
      label={label}
      helperText={helperText}
      meta={`enum · ${options.length}`}
    >
      <RadioGroup
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
                    fontFamily:
                      theme.typography.fontFamilyCode ?? 'Menlo, monospace',
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
                    bgcolor: isSelected
                      ? selectedHoverBg
                      : theme.palette.action.hover,
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

export function SelectControl({
  label,
  helperText,
  value,
  options,
  onChange,
  disabled = false,
}) {
  return (
    <PropCard
      label={label}
      helperText={helperText}
      meta={`enum · ${options.length}`}
    >
      <TextField
        size="small"
        select
        value={value}
        disabled={disabled}
        fullWidth
        onChange={(event) => onChange(event.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.75rem',
            fontFamily: (theme) =>
              theme.typography.fontFamilyCode ?? 'Menlo, monospace',
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
}) {
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

export function TextControl({
  label,
  helperText,
  value,
  onChange,
  placeholder,
  multiline,
  rows,
  disabled = false,
}) {
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
            fontFamily: (theme) =>
              theme.typography.fontFamilyCode ?? 'Menlo, monospace',
          },
          '& .MuiOutlinedInput-input': {
            py: 0.625,
          },
        }}
      />
    </PropCard>
  );
}

export function SxTextareaControl({
  label,
  value,
  onChange,
  description,
  parseError,
  placeholder = '{ /* sx object */ }',
}) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <Stack spacing={0.5} sx={{ width: '100%', minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 1,
          minWidth: 0,
        }}
      >
        <Typography
          variant="caption"
          sx={(theme) => ({
            fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
            fontSize: '0.72rem',
            fontWeight: 500,
            color: 'text.primary',
            overflowWrap: 'anywhere',
            minWidth: 0,
          })}
        >
          {label}
        </Typography>
        {value ? (
          <Box
            component="button"
            type="button"
            onClick={() => onChange('')}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'text.secondary',
              fontSize: '0.65rem',
              p: 0,
              flexShrink: 0,
              '&:hover': { color: 'primary.main' },
            }}
          >
            Reset
          </Box>
        ) : null}
      </Box>
      {description ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.65rem', lineHeight: 1.4 }}
        >
          {description}
        </Typography>
      ) : null}
      <TextField
        size="small"
        multiline
        minRows={2}
        maxRows={8}
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (draft !== value) {
            onChange(draft);
          }
        }}
        error={Boolean(parseError)}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.7rem',
            fontFamily: (theme) =>
              theme.typography.fontFamilyCode ?? 'Menlo, monospace',
            alignItems: 'flex-start',
          },
          '& .MuiOutlinedInput-input': {
            py: 0.625,
            lineHeight: 1.5,
          },
        }}
      />
      {parseError ? (
        <Typography
          variant="caption"
          color="error"
          sx={{
            fontSize: '0.65rem',
            fontFamily: (theme) =>
              theme.typography.fontFamilyCode ?? 'Menlo, monospace',
          }}
        >
          {parseError}
        </Typography>
      ) : null}
    </Stack>
  );
}

export function DividerLabel({ children }) {
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

export function ResetButton({
  onClick,
  tooltip = 'Reset to defaults',
  disabled = false,
}) {
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
          fontSize: '0.7rem',
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

export function ControlGroup({ label, description, children }) {
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
      <Stack spacing={1}>{children}</Stack>
    </Stack>
  );
}
