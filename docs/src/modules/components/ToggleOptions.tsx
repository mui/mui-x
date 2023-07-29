import * as React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

export default function ToggleOptions(props: {
  options: string[];
  label: string;
  value: string;
  setValue: (arg: React.SetStateAction<string>) => void;
  autoColapse?: boolean;
}) {
  const { options, label, value, setValue, autoColapse } = props;

  return (
    <div>
      <Typography
        role="presentation"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
          mb: '2px',
          color: 'text.secondary',
        }}
      >
        {label}
      </Typography>
      <ToggleButtonGroup
        sx={(theme) => (autoColapse ? { [theme.breakpoints.down('md')]: { display: 'none' } } : {})}
        size="small"
        fullWidth
        color="primary"
        value={value}
        exclusive
        onChange={(event, newValue) => {
          if (newValue) {
            setValue(newValue);
          }
        }}
        aria-label={label}
      >
        {options.map((option) => {
          return (
            <ToggleButton
              key={option}
              value={option}
              sx={{
                width: 'max-content',
                minWidth: 64,
                py: 0.5,
                px: 1,
              }}
            >
              {option}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <Select
        sx={(theme) =>
          autoColapse
            ? {
                [theme.breakpoints.up('md')]: { display: 'none' },

                fontSize: '0.8125rem',
                lineHeight: 1.75,
                '& .MuiSelect-select': {
                  fontSize: theme.typography.pxToRem(13),
                  px: 1,
                  py: 0.5,
                },
              }
            : { display: 'none' }
        }
        size="small"
        fullWidth
        variant="outlined"
        color="primary"
        value={value}
        onChange={(event) => {
          if (event.target.value) {
            setValue(event.target.value);
          }
        }}
        aria-label={label}
      >
        {options.map((option) => {
          return (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}
