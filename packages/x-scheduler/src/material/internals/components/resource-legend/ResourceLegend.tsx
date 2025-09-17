'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Eye, EyeClosed } from 'lucide-react';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { CheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { useStore } from '@base-ui-components/utils/store';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { ResourceLegendProps } from './ResourceLegend.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { getColorClassName } from '../../utils/color-utils';
import { useEventCalendarStoreContext } from '../../../../primitives/utils/useEventCalendarStoreContext';
import { DEFAULT_EVENT_COLOR, selectors } from '../../../../primitives/use-event-calendar';
import { CalendarResource } from '../../../../primitives/models';
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
      <span className="ResourceLegendName">{resource.name}</span>
      <Checkbox.Root
        className={clsx('NeutralTextButton', 'Button', 'ResourceLegendButton')}
        value={resource.id}
        render={(rootProps, state) => (
          <button
            type="button"
            aria-label={
              state.checked
                ? translations.hideEventsLabel(resource.name)
                : translations.showEventsLabel(resource.name)
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
    const valueSet = new Set(value);
    const newVisibleResourcesMap = new Map(
      store.state.resources
        .filter((resource) => !valueSet.has(resource.id))
        .map((resource) => [resource.id, false]),
    );

    store.setVisibleResources(newVisibleResourcesMap);
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
