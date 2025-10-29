'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Eye, EyeClosed } from 'lucide-react';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { CheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { CalendarResource } from '@mui/x-scheduler-headless/models';
import { DEFAULT_EVENT_COLOR } from '@mui/x-scheduler-headless/constants';
import { ResourceLegendProps } from './ResourceLegend.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { getColorClassName } from '../../utils/color-utils';
import './ResourceLegend.css';

function ResourceLegendItem(props: { resource: CalendarResource }) {
  const { resource } = props;
  const translations = useTranslations();

  return (
    <label className="ResourceLegendItem">
      <span
        className={clsx(
          'ResourceLegendColor',
          getColorClassName(resource.eventColor ?? DEFAULT_EVENT_COLOR),
        )}
      />
      <span className="ResourceLegendName">{resource.title}</span>
      <Checkbox.Root
        className={clsx('NeutralTextButton', 'Button', 'ResourceLegendButton')}
        value={resource.id}
        render={(rootProps, state) => (
          <button
            type="button"
            aria-label={
              state.checked
                ? translations.hideEventsLabel(resource.title)
                : translations.showEventsLabel(resource.title)
            }
            {...rootProps}
          />
        )}
      >
        <Checkbox.Indicator
          keepMounted
          render={(indicatorProps, state) =>
            state.checked ? (
              <Eye size={16} strokeWidth={1.5} {...indicatorProps} />
            ) : (
              <EyeClosed size={16} strokeWidth={1.5} {...indicatorProps} />
            )
          }
        />
      </Checkbox.Root>
    </label>
  );
}

const getVisibilityDifferenceMap = (allResources: CalendarResource[], newValue: string[]) => {
  const newVisibleResourcesSet = new Set(newValue);
  const diffMap = new Map<string, boolean>();

  const propagateChangeToChildren = (resource: CalendarResource, isVisible: boolean) => {
    diffMap.set(resource.id, isVisible);
    if (resource.children && resource.children.length > 0) {
      for (const child of resource.children) {
        diffMap.set(child.id, isVisible);
        propagateChangeToChildren(child, isVisible);
      }
    }
  };

  for (const resource of allResources) {
    propagateChangeToChildren(resource, newVisibleResourcesSet.has(resource.id));
  }
  return diffMap;
};

export const ResourceLegend = React.forwardRef(function ResourceLegend(
  props: ResourceLegendProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const resources = useStore(store, selectors.resources);
  const visibleResourcesList = useStore(store, selectors.visibleResourcesList);

  const handleVisibleResourcesChange = useEventCallback((value: string[]) => {
    const differenceMap = getVisibilityDifferenceMap(resources, value);

    store.setVisibleResources(differenceMap);
  });

  if (resources.length === 0) {
    return null;
  }

  return (
    <CheckboxGroup
      render={<section />}
      ref={forwardedRef}
      value={visibleResourcesList}
      onValueChange={handleVisibleResourcesChange}
      aria-label={translations.resourceLegendSectionLabel}
      className={clsx('ResourceLegendContainer', className)}
      {...other}
    >
      {resources.map((resource) => {
        return <ResourceLegendItem key={resource.id} resource={resource} />;
      })}
    </CheckboxGroup>
  );
});
