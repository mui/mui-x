'use client';
import * as React from 'react';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
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
import { schedulerPaletteStyles } from '../../internals/utils/tokens';
import { useEventCalendarClasses } from '../EventCalendarClassesContext';

const ResourcesLegendRoot = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegend',
})({
  display: 'flex',
  flexDirection: 'column',
});

const ResourcesLegendItemRoot = styled(FormControlLabel, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendItem',
})(({ theme }) => ({
  marginLeft: 0,
  marginRight: 0,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:has(:focus-visible)': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
  },
  '& .MuiFormControlLabel-label': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flex: 1,
  },
}));

const ResourcesLegendItemColorDot = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'ResourcesLegendItemColorDot',
})({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
  ...schedulerPaletteStyles,
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
  onToggle: (
    resourceId: string,
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
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
      labelPlacement="start"
      control={
        <Checkbox
          checked={isVisible}
          onChange={(event) => onToggle(resource.id, event.target.checked, event)}
          icon={<VisibilityOffOutlined fontSize="small" />}
          checkedIcon={<VisibilityOutlined fontSize="small" />}
          size="small"
          disableRipple
          slotProps={{
            input: {
              'aria-label': isVisible
                ? translations.hideEventsLabel(resource.title)
                : translations.showEventsLabel(resource.title),
            },
          }}
          sx={{
            p: 0,
            '&.Mui-checked': { color: 'action.active' },
          }}
        />
      }
      label={
        <React.Fragment>
          <ResourcesLegendItemColorDot
            className={classes.resourcesLegendItemColorDot}
            data-palette={eventColor}
          />
          <ResourcesLegendItemName className={classes.resourcesLegendItemName}>
            {resource.title}
          </ResourcesLegendItemName>
        </React.Fragment>
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
    (resourceId: string, checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
      const newVisibleResources: Record<string, boolean> = {};
      resources.forEach((resource) => {
        newVisibleResources[resource.id] =
          resource.id === resourceId ? checked : visibleSet.has(resource.id);
      });
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
