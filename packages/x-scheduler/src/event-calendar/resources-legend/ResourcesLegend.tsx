'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerResource } from '@mui/x-scheduler-headless/models';
import clsx from 'clsx';
import { ResourcesLegendProps } from './ResourcesLegend.types';
import { useTranslations } from '../../internals/utils/TranslationsContext';
import { getPaletteVariants } from '../../internals/utils/tokens';
import { useEventCalendarClasses } from '../EventCalendarClassesContext';

const ResourcesLegendRoot = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegend',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  overflowY: 'auto',
  scrollbarWidth: 'thin',
}));

const ResourcesLegendLabel = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendLabel',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: theme.typography.fontWeightMedium,
  paddingLeft: theme.spacing(1.25),
  paddingBottom: theme.spacing(1),
}));

const ResourcesLegendItemRoot = styled(FormControlLabel, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendItem',
})(({ theme }) => ({
  marginLeft: 0,
  marginRight: 0,
  '& .MuiCheckbox-root': {
    color: 'var(--event-main)',
    '&.Mui-checked': {
      color: 'var(--event-main)',
    },
  },
  variants: getPaletteVariants(theme),
}));

const ResourcesLegendItemName = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendItemName',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
}));

interface ResourcesLegendItemProps {
  resource: SchedulerResource;
  isVisible: boolean;
  onToggle: (resourceId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

function ResourcesLegendItem(props: ResourcesLegendItemProps) {
  const { resource, isVisible, onToggle } = props;
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const classes = useEventCalendarClasses();
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, resource.id);

  return (
    <ResourcesLegendItemRoot
      className={classes.resourcesLegendItem}
      data-palette={eventColor}
      control={
        <Checkbox
          className={classes.resourcesLegendItemCheckbox}
          checked={isVisible}
          onChange={(event) => onToggle(resource.id, event)}
          size="small"
          slotProps={{
            input: {
              'aria-label': isVisible
                ? translations.hideEventsLabel(resource.title)
                : translations.showEventsLabel(resource.title),
            },
          }}
        />
      }
      label={
        <ResourcesLegendItemName className={classes.resourcesLegendItemName}>
          {resource.title}
        </ResourcesLegendItemName>
      }
    />
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

  const handleToggle = useStableCallback(
    (resourceId: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const newVisibleResources = Object.fromEntries(
        resources.map((res) => [
          res.id,
          res.id === resourceId ? event.target.checked : visibleSet.has(res.id),
        ]),
      );
      store.setVisibleResources(newVisibleResources, event.nativeEvent);
    },
  );

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
      <ResourcesLegendLabel className={classes.resourcesLegendLabel}>
        {translations.resourcesLabel}
      </ResourcesLegendLabel>
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
