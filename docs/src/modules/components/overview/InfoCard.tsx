import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

type InfoCardProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};
export default function InfoCard({
  title,
  description,
  icon: Icon,
  onClick,
  active,
}: InfoCardProps) {
  const clickable = Boolean(onClick);

  return (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={(theme) => ({
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
        ...(clickable && {
          cursor: 'pointer',
          '&:hover': {
            opacity: 1,
            boxShadow: `0px 2px 30px 0px ${alpha(theme.palette.primary[50], 0.3)} inset, 0px 1px 6px 0px ${theme.palette.primary[100]}`,
            borderColor: 'primary.100',
            ...(active && {
              borderColor: 'primary.300',
            }),
          },
          ...(active && {
            boxShadow: `0px 2px 30px 0px ${alpha(theme.palette.primary[50], 0.3)} inset, 0px 1px 6px 0px ${theme.palette.primary[100]}`,
            borderColor: 'primary.200',
          }),
          ...(!active && { borderColor: 'grey.300', opacity: 0.7 }),
        }),
        ...theme.applyDarkStyles({
          bgcolor: alpha(theme.palette.primaryDark[800], 0.25),
          background: `${(theme.vars || theme).palette.gradients.linearSubtle}`,
          borderColor: 'primaryDark.700',
          ...(clickable && {
            '&:hover': {
              boxShadow: `0px 2px 30px 0px ${alpha(theme.palette.primary[800], 0.1)} inset, 0px 1px 6px 0px ${theme.palette.primary[900]}`,

              borderColor: 'primary.300',
            },
            ...(active && {
              boxShadow: `0px 2px 30px 0px ${alpha(theme.palette.primary[800], 0.1)} inset, 0px 1px 6px 0px ${theme.palette.primary[900]}`,
              borderColor: 'primary.100',
            }),
          }),
        }),
      })}
    >
      <Stack direction="row" spacing={2} sx={{ mb: description ? 2 : 0 }}>
        {Icon}
        <Typography
          gutterBottom
          fontWeight="semiBold"
          component="h3"
          color="text.primary"
          variant="body2"
        >
          {title}
        </Typography>
      </Stack>
      {description && (
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      )}
    </Paper>
  );
}
