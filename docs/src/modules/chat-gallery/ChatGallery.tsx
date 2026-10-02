import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChatComponentShowcaseCard from './ChatComponentShowcaseCard';
import { CHAT_GALLERY, CHAT_GALLERY_SECTIONS } from './components';
import {
  focusInput,
  getServerSnapshot,
  getSnapshot,
  setQuery,
  subscribe,
} from './galleryFilterStore';

/**
 * Section heading and description, styled to match the docs `MarkdownElement`
 * `h2`/`p` rules. The gallery renders as a sibling of `.MuiMarkdownElement`
 * (not a descendant), so those styles aren't inherited and are replicated here.
 */
const SectionHeading = styled('h2')(({ theme }) => ({
  fontFamily: '"General Sans", sans-serif',
  fontSize: theme.typography.pxToRem(26),
  fontWeight: 600,
  lineHeight: 1.2,
  margin: '40px 0 4px',
}));

const SectionDescription = styled('p')(({ theme }) => ({
  ...theme.typography.body1,
  margin: '0 0 16px',
}));

/** Inline `code` span inside a section description. Mirrors the docs inline code. */
const InlineCode = styled('code')(({ theme }) => ({
  fontFamily: 'Menlo, Consolas, "Droid Sans Mono", monospace',
  fontSize: theme.typography.pxToRem(13),
  padding: '2px 4px',
  borderRadius: 6,
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  backgroundColor: theme.palette.grey[50],
  ...theme.applyDarkStyles({
    borderColor: theme.palette.primaryDark[600],
    backgroundColor: theme.palette.primaryDark[800],
  }),
}));

/** Render a description string, turning `backticked` spans into inline code. */
function renderDescription(text: string): React.ReactNode {
  return text
    .split('`')
    .map((segment, index) =>
      index % 2 === 1 ? (
        <InlineCode key={index}>{segment}</InlineCode>
      ) : (
        <React.Fragment key={index}>{segment}</React.Fragment>
      ),
    );
}

/**
 * All-components gallery, driven by the shared filter store. Renders one grid
 * per section, hiding any section whose components are all filtered out, and
 * falls back to a single empty state with a clear-search action when nothing
 * matches the query.
 */
export default function ChatGallery() {
  const query = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const normalized = query.trim().toLowerCase();

  const sections = CHAT_GALLERY_SECTIONS.map((section) => ({
    ...section,
    entries: CHAT_GALLERY.filter(
      (entry) =>
        entry.sectionId === section.id &&
        (normalized === '' || entry.name.toLowerCase().includes(normalized)),
    ),
  })).filter((section) => section.entries.length > 0);

  if (sections.length === 0) {
    return (
      <Stack spacing={1} sx={{ alignItems: 'flex-start', py: 6 }}>
        <Typography component="p" variant="h6" sx={{ fontWeight: 'semiBold' }}>
          No components match {`"${query.trim()}"`}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Try a different name, or clear the search to browse the full catalog.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setQuery('');
            focusInput();
          }}
        >
          Clear search
        </Button>
      </Stack>
    );
  }

  return (
    <React.Fragment>
      {sections.map((section) => (
        <Box key={section.id} component="section">
          <SectionHeading id={section.id}>{section.title}</SectionHeading>
          <SectionDescription>{renderDescription(section.description)}</SectionDescription>
          <Grid container spacing={2}>
            {section.entries.map((entry) => (
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
        </Box>
      ))}
    </React.Fragment>
  );
}
