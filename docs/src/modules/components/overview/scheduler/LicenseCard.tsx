import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { grey, blue } from '@mui/material/colors';

type Plan = 'community' | 'premium';

type LicenseCardProps = {
  plan: Plan;
  title: string;
  description: string;
};

const PLAN_CONFIG: Record<
  Plan,
  { iconSrc: string; packageName: string; palette: typeof grey | typeof blue }
> = {
  community: {
    iconSrc: '/static/x/community.svg',
    packageName: '@mui/x-scheduler',
    palette: grey,
  },
  premium: {
    iconSrc: '/static/x/premium.svg',
    packageName: '@mui/x-scheduler-premium',
    palette: blue,
  },
};

export default function LicenseCard({ plan, title, description }: LicenseCardProps) {
  const { iconSrc, packageName, palette } = PLAN_CONFIG[plan];

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexGrow: 1,
        borderColor: alpha(palette[500], 0.2),
        backgroundColor: alpha(palette[100], 0.2),
        ...theme.applyDarkStyles({
          borderColor: alpha(palette[700], 0.2),
          backgroundColor: alpha(palette[900], 0.05),
        }),
      })}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <Box component="img" src={iconSrc} width={16} height={16} alt="" />
          <Typography
            component="h3"
            variant="body1"
            sx={(theme) => ({
              fontWeight: 'semiBold',
              color: palette[900],
              ...theme.applyDarkStyles({ color: palette[300] }),
            })}
          >
            {title}
          </Typography>
        </Stack>
        <Box
          sx={(theme) => ({
            px: 1.25,
            py: 0.25,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            borderRadius: 999,
            border: '1px solid',
            borderColor: palette[200],
            fontFamily: theme.typography.fontFamilyCode,
            fontSize: theme.typography.pxToRem(12),
            color: palette[800],
            ...theme.applyDarkStyles({
              borderColor: alpha(palette[800], 0.5),
              color: palette[300],
            }),
          })}
        >
          {packageName}
        </Box>
      </Stack>
      <Typography
        variant="body2"
        sx={(theme) => ({
          color: palette[800],
          ...theme.applyDarkStyles({ color: palette[200] }),
        })}
      >
        {description}
      </Typography>
    </Paper>
  );
}
