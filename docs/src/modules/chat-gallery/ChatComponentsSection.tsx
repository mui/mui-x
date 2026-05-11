import * as React from 'react';
import Grid from '@mui/material/Grid';
import ChatComponentShowcaseCard from './ChatComponentShowcaseCard';
import { entriesForSection, type ChatGallerySectionId } from './components';

export interface ChatComponentsSectionProps {
  sectionId: ChatGallerySectionId;
}

/**
 * Renders one section of the chat all-components gallery as a 3-up card grid.
 * Markdown loaders can't pass props, so each section gets a thin wrapper file
 * that calls this with a fixed `sectionId`.
 */
export default function ChatComponentsSection({ sectionId }: ChatComponentsSectionProps) {
  const entries = entriesForSection(sectionId);
  return (
    <Grid container spacing={2} sx={{ pt: 1 }}>
      {entries.map((entry) => (
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
