'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Eye, EyeClosed } from 'lucide-react';
import { ResourceLegendProps } from './ResourceLegend.types';
import { useTranslations } from '../../utils/TranslationsContext';
import { getColorClassName } from '../../utils/color-utils';
import './ResourceLegend.css';
import { useEventCalendarStore } from '../../hooks/useEventCalendarStore';
import { useSelector } from '../../../../base-ui-copy/utils/store/useSelector';
import { selectors } from '../../../event-calendar/store';
import { useEventCallback } from '../../../../base-ui-copy/utils/useEventCallback';
import { CalendarResource } from '../../../models/resource';

function ResourceLegendItem(props: { resource: CalendarResource }) {
  const { resource } = props;
  const translations = useTranslations();
  const store = useEventCalendarStore();
  const isVisible = useSelector(store, selectors.isResourceVisible, resource.id);

  const handleVisibilityChange = useEventCallback(() => {
    const newMap = new Map(store.state.visibleResources);
    if (isVisible) {
      newMap.set(resource.id, false);
    } else {
      newMap.delete(resource.id);
    }
    store.set('visibleResources', newMap);
  });

  return (
    <div key={resource.id} className="ResourceLegendItem">
      <span className={clsx('ResourceLegendColor', getColorClassName({ resource }))} />
      <span className="ResourceLegendName">{resource.name}</span>
      <button
        className={clsx('NeutralTextButton', 'Button', 'ResourceLegendButton')}
        onClick={handleVisibilityChange}
        type="button"
        aria-label={
          isVisible
            ? translations.hideEventsLabel(resource.name)
            : translations.showEventsLabel(resource.name)
        }
      >
        {isVisible ? (
          <Eye size={16} strokeWidth={2} aria-hidden="true" />
        ) : (
          <EyeClosed size={16} strokeWidth={2} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export const ResourceLegend = React.forwardRef(function ResourceLegend(
  props: ResourceLegendProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, ...other } = props;
  const translations = useTranslations();
  const store = useEventCalendarStore();
  const resources = useSelector(store, selectors.resources);

  if (resources.length === 0) {
    return null;
  }

  return (
    <section
      ref={forwardedRef}
      aria-label={translations.resourceLegendSectionLabel}
      className={clsx('ResourceLegendContainer', className)}
      {...other}
    >
      {resources.map((resource) => {
        return <ResourceLegendItem resource={resource} />;
      })}
    </section>
  );
});
