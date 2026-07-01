'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useStore } from '@base-ui/utils/store';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { schedulerOccurrencePlaceholderSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingStyledContext, ReadonlyEventDetails } from '../event-editing';

const CompactReadonlyContentHeader = styled('header', {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawerReadonlyHeader',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 3),
}));

const CompactReadonlyContentTitle = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'CompactEventDrawerReadonlyTitle',
})({
  flex: 1,
  minWidth: 0,
  margin: 0,
  color: 'var(--event-on-surface-subtle-secondary)',
  cursor: 'default',
});

interface CompactReadonlyContentProps {
  occurrence: SchedulerRenderableEventOccurrence;
  onClose: () => void;
}

/**
 * The read-only summary shown inside the compact drawer: the shared `ReadonlyEventDetails` with
 * lighter chrome (small heading + close button, no footer).
 */
export function CompactReadonlyContent(props: CompactReadonlyContentProps) {
  const { occurrence, onClose } = props;

  // Context hooks
  const { localeText, classes } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isCreating = useStore(store, schedulerOccurrencePlaceholderSelectors.isCreating);

  const showPlaceholder = isCreating && !occurrence.title;

  // Stop the tap reaching the drawer root, which would expand instead of close.
  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <React.Fragment>
      <CompactReadonlyContentHeader className={classes.compactEventDrawerReadonlyHeader}>
        <CompactReadonlyContentTitle
          className={classes.compactEventDrawerReadonlyTitle}
          variant="body1"
          noWrap
        >
          {showPlaceholder ? localeText.eventTitlePlaceholder : occurrence.title}
        </CompactReadonlyContentTitle>
        <IconButton
          size="small"
          edge="end"
          aria-label={localeText.closeButtonAriaLabel}
          onClick={handleClose}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
      </CompactReadonlyContentHeader>

      <ReadonlyEventDetails occurrence={occurrence} />
    </React.Fragment>
  );
}
