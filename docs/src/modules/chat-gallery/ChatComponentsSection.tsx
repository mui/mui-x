import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ChatComponentShowcaseCard from './ChatComponentShowcaseCard';
import { entriesForSection, type ChatGallerySectionId } from './components';
import { getServerSnapshot, getSnapshot, subscribe } from './galleryFilterStore';

export interface ChatComponentsSectionProps {
  sectionId: ChatGallerySectionId;
}

/**
 * Renders one section of the chat all-components gallery as a 3-up card grid.
 * Markdown loaders can't pass props, so each section gets a thin wrapper file
 * that calls this with a fixed `sectionId`.
 */
export default function ChatComponentsSection({ sectionId }: ChatComponentsSectionProps) {
  const query = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const entries = entriesForSection(sectionId);
  const normalized = query.trim().toLowerCase();
  const visible = normalized
    ? entries.filter((entry) => entry.name.toLowerCase().includes(normalized))
    : entries;

  if (visible.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
        No matching components in this section.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2} sx={{ pt: 1 }}>
      {visible.map((entry) => (
        <Grid
          key={entry.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
          sx={{ flexGrow: 1 }}
        >
          <ChatComponentShowcaseCard entry={entry} />
        </Grid>
      ))}
    </Grid>
  );
}
