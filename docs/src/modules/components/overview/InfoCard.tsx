import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

type InfoCardProps = {
  active?: boolean;
  backgroundColor?: 'gradient' | 'subtle';
  description?: string | string[];
  icon?: React.ReactNode;
  link?: string;
  onClick?: () => void;
  title: string;
};
export default function InfoCard(props: InfoCardProps) {
  const {
    active,
    backgroundColor = 'gradient',
    description,
    icon: Icon,
    link,
    onClick,
    title,
  } = props;
  const clickable = Boolean(onClick);

  return (
    <Paper
      variant="outlined"
      component={link ? Link : 'div'}
      href={link}
      onClick={onClick}
      sx={(theme) => ({
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'left',
        flexGrow: 1,
        height: '100%',
        boxShadow: 'transparent',
        background:
          backgroundColor === 'gradient'
            ? `${(theme.vars || theme).palette.gradients.linearSubtle}`
            : 'transparent',
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
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: description ? 2 : 0, width: '100%', alignItems: 'center' }}
      >
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
      {description && typeof description === 'string' && (
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      )}
      {description &&
        typeof description === 'object' &&
        description.map((item, index) => (
          <Typography color="text.secondary" variant="body2" key={index}>
            {item}
          </Typography>
        ))}
    </Paper>
  );
}
