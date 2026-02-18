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
import { getPaletteVariants } from '../../internals/utils/tokens';
import { useEventCalendarStyledContext } from '../EventCalendarStyledContext';

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
  const { classes, localeText } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
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
                ? localeText.hideEventsLabel(resource.title)
                : localeText.showEventsLabel(resource.title),
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
  const { classes, localeText } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const resources = useStore(store, schedulerResourceSelectors.processedResourceList);
  const visibleResources = useStore(store, schedulerResourceSelectors.visibleMap);

  const handleToggle = useStableCallback(
    (resourceId: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const newVisibleResources = Object.fromEntries(
        resources.map((res) => [
          res.id,
          res.id === resourceId ? event.target.checked : visibleResources[res.id] !== false,
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
      aria-label={localeText.resourcesLegendSectionLabel}
      {...props}
      className={clsx(props.className, classes.resourcesLegend)}
    >
      <ResourcesLegendLabel className={classes.resourcesLegendLabel}>
        {localeText.resourcesLabel}
      </ResourcesLegendLabel>
      {resources.map((resource) => (
        <ResourcesLegendItem
          key={resource.id}
          resource={resource}
          isVisible={visibleResources[resource.id] !== false}
          onToggle={handleToggle}
        />
      ))}
    </ResourcesLegendRoot>
  );
});
