'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Eye, EyeClosed } from 'lucide-react';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { CheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { ResourceLegendProps } from './ResourceLegend.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { getColorClassName } from '../../utils/color-utils';
import { useEventCalendarContext } from '../../hooks/useEventCalendarContext';
import { useSelector } from '../../../../base-ui-copy/utils/store/useSelector';
import { selectors } from '../../../event-calendar/store';
import { useEventCallback } from '../../../../base-ui-copy/utils/useEventCallback';
import { CalendarResource } from '../../../models/resource';
import './ResourceLegend.css';

function ResourceLegendItem(props: { resource: CalendarResource }) {
  const { resource } = props;
  const translations = useTranslations();

  return (
    <label className="ResourceLegendItem">
      <span className={clsx('ResourceLegendColor', getColorClassName({ resource }))} />
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
              <Eye size={16} strokeWidth={2} {...indicatorProps} />
            ) : (
              <EyeClosed size={16} strokeWidth={2} {...indicatorProps} />
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
  const { store, instance } = useEventCalendarContext();
  const resources = useSelector(store, selectors.resources);
  const visibleResourcesList = useSelector(store, selectors.visibleResourcesList);

  const handleVisibleResourcesChange = useEventCallback((value: string[]) => {
    const valueSet = new Set(value);
    const newVisibleResourcesMap = new Map(
      store.state.resources
        .filter((resource) => !valueSet.has(resource.id))
        .map((resource) => [resource.id, false]),
    );

    instance.setVisibleResources(newVisibleResourcesMap);
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
