'use client';
import * as React from 'react';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerResource } from '@mui/x-scheduler-headless/models';
import clsx from 'clsx';
import { ResourcesLegendProps } from './ResourcesLegend.types';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { getPaletteVariants, PaletteName } from '../../internals/utils/tokens';
import { useEventCalendarClasses } from '../EventCalendarClassesContext';

const ResourcesLegendRoot = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegend',
})({
  display: 'flex',
  flexDirection: 'column',
});

const ResourcesLegendItemRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendItem',
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

const ResourcesLegendItemColorDot = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendItemColorDot',
})<{ palette?: PaletteName }>({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
  variants: getPaletteVariants(),
});

const ResourcesLegendItemName = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendItemName',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
}));

interface ResourcesLegendItemProps {
  resource: SchedulerResource;
  isVisible: boolean;
  onToggle: (resourceId: string, event: React.MouseEvent) => void;
}

function ResourcesLegendItem(props: ResourcesLegendItemProps) {
  const { resource, isVisible, onToggle } = props;
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const classes = useEventCalendarClasses();
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resource.id);

  return (
    <ResourcesLegendItemRoot className={classes.resourcesLegendItem}>
      <ResourcesLegendItemColorDot
        className={classes.resourcesLegendItemColorDot}
        palette={eventColor}
      />
      <ResourcesLegendItemName className={classes.resourcesLegendItemName}>
        {resource.title}
      </ResourcesLegendItemName>
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
          <VisibilityOutlined fontSize="small" />
        ) : (
          <VisibilityOffOutlined fontSize="small" />
        )}
      </IconButton>
    </ResourcesLegendItemRoot>
  );
}

export const ResourcesLegend = React.forwardRef(function ResourcesLegend(
  props: ResourcesLegendProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const classes = useEventCalendarClasses();
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
    <ResourcesLegendRoot
      ref={forwardedRef}
      aria-label={translations.resourcesLegendSectionLabel}
      {...props}
      className={clsx(props.className, classes.resourcesLegend)}
    >
      {resources.map((resource) => (
        <ResourcesLegendItem
          key={resource.id}
          resource={resource}
          isVisible={visibleSet.has(resource.id)}
          onToggle={handleToggle}
        />
      ))}
    </ResourcesLegendRoot>
  );
});
