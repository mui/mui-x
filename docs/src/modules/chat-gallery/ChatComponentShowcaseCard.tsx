import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/internal-core-docs/Link';
import type { ChatGalleryEntry, ChatGalleryStatus } from './components';

const STATUS_LABEL: Record<ChatGalleryStatus, string> = {
  core: 'Core',
  compound: 'Compound',
  slot: 'Slot',
  state: 'State',
  presentational: 'Presentational',
};

const STATUS_COLOR: Record<
  ChatGalleryStatus,
  'default' | 'primary' | 'secondary' | 'info' | 'warning' | 'success'
> = {
  core: 'primary',
  compound: 'default',
  slot: 'info',
  state: 'warning',
  presentational: 'success',
};

export interface ChatComponentShowcaseCardProps {
  entry: ChatGalleryEntry;
}

/**
 * Card for the chat all-components gallery. Mirrors
 * `docs/src/components/action/ComponentShowcaseCard.tsx` from `mui-material`,
 * but renders an inline-SVG schematic component instead of light/dark PNGs.
 *
 * - 4/3 thumbnail at top, light/dark theming via the SVG component itself.
 * - Component name (left) + role chip (right) below.
 * - Whole card is a `<Link>` to the component's docs page.
 */
export default function ChatComponentShowcaseCard({ entry }: ChatComponentShowcaseCardProps) {
  const { Thumbnail, name, status, href } = entry;
  return (
    <Card
      component={Link}
      noLinkStyle
      prefetch={false}
      variant="outlined"
      href={href}
      sx={(theme) => ({
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        borderColor: 'divider',
        textDecoration: 'none',
        transition: theme.transitions.create(['border-color', 'box-shadow'], {
          duration: theme.transitions.duration.shortest,
        }),
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: theme.shadows[2],
        },
        ...theme.applyDarkStyles({
          backgroundColor: alpha(theme.palette.primaryDark[700], 0.1),
          borderColor: 'primaryDark.700',
          '&:hover': {
            borderColor: 'primary.400',
          },
        }),
      })}
    >
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          aspectRatio: '4 / 3',
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& > svg': { width: '100%', height: '100%', display: 'block' },
          ...theme.applyDarkStyles({
            borderColor: 'primaryDark.700',
          }),
        })}
      >
        <Thumbnail />
      </Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.25,
        }}
      >
        <Typography
          component="h3"
          variant="body2"
          sx={{
            fontWeight: 'semiBold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
        >
          {name}
        </Typography>
        <Chip
          label={STATUS_LABEL[status]}
          size="small"
          variant="outlined"
          color={STATUS_COLOR[status]}
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, flexShrink: 0 }}
        />
      </Stack>
    </Card>
  );
}
