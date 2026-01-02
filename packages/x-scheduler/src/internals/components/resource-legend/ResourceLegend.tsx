'use client';
import * as React from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerResource } from '@mui/x-scheduler-headless/models';
import { ResourceLegendProps } from './ResourceLegend.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { schedulerPaletteStyles } from '../../utils/tokens';

const ResourceLegendRoot = styled('section', {
  name: 'MuiSchedulerResourceLegend',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'column',
});

const ResourceLegendItemRoot = styled('div', {
  name: 'MuiSchedulerResourceLegend',
  slot: 'Item',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ResourceLegendColorDot = styled('span', {
  name: 'MuiSchedulerResourceLegend',
  slot: 'ColorDot',
})({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
  ...schedulerPaletteStyles,
});

const ResourceLegendName = styled(Typography, {
  name: 'MuiSchedulerResourceLegend',
  slot: 'Name',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
}));

interface ResourceLegendItemProps {
  resource: SchedulerResource;
  isVisible: boolean;
  onToggle: (resourceId: string, event: React.MouseEvent) => void;
}

function ResourceLegendItem(props: ResourceLegendItemProps) {
  const { resource, isVisible, onToggle } = props;
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resource.id);

  return (
    <ResourceLegendItemRoot>
      <ResourceLegendColorDot data-palette={eventColor} />
      <ResourceLegendName>{resource.title}</ResourceLegendName>
      <IconButton
        size="small"
        onClick={(event) => onToggle(resource.id, event)}
        aria-label={
          isVisible
            ? translations.hideEventsLabel(resource.title)
            : translations.showEventsLabel(resource.title)
        }
        sx={{ ml: 'auto' }}
      >
        {isVisible ? (
          <Eye size={16} strokeWidth={1.5} />
        ) : (
          <EyeClosed size={16} strokeWidth={1.5} />
        )}
      </IconButton>
    </ResourceLegendItemRoot>
  );
}

export const ResourceLegend = React.forwardRef(function ResourceLegend(
  props: ResourceLegendProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const resources = useStore(store, schedulerResourceSelectors.processedResourceList);
  const visibleResourcesList = useStore(store, schedulerResourceSelectors.visibleIdList);

  const visibleSet = React.useMemo(() => new Set(visibleResourcesList), [visibleResourcesList]);

  const handleToggle = useStableCallback((resourceId: string, event: React.MouseEvent) => {
    const isCurrentlyVisible = visibleSet.has(resourceId);
    store.setVisibleResources({ [resourceId]: !isCurrentlyVisible }, event.nativeEvent);
  });

  if (resources.length === 0) {
    return null;
  }

  return (
    <ResourceLegendRoot
      ref={forwardedRef}
      aria-label={translations.resourceLegendSectionLabel}
      className={className}
      {...other}
    >
      {resources.map((resource) => (
        <ResourceLegendItem
          key={resource.id}
          resource={resource}
          isVisible={visibleSet.has(resource.id)}
          onToggle={handleToggle}
        />
      ))}
    </ResourceLegendRoot>
  );
});
