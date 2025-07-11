'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Eye, EyeClosed } from 'lucide-react';
import { ResourceLegendProps } from './ResourceLegend.types';
import { useTranslations } from '../internals/utils/TranslationsContext';
import { getColorClassName } from '../internals/utils/color-utils';
import './ResourceLegend.css';

export const ResourceLegend = React.forwardRef(function ResourceLegend(
  props: ResourceLegendProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, resources, visibleResourceIds, onResourceVisibilityChange, ...other } = props;
  const translations = useTranslations();

  return (
    <section
      ref={forwardedRef}
      aria-label={translations.resourceLegendSectionLabel}
      className={clsx('ResourceLegendContainer', className)}
      {...other}
    >
      {resources.map((resource) => {
        const isVisible = visibleResourceIds.includes(resource.id);
        return (
          <div key={resource.id} className="ResourceLegendItem">
            <span className={clsx('ResourceLegendColor', getColorClassName({ resource }))} />
            <span className="ResourceLegendName">{resource.name}</span>
            <button
              className={clsx('NeutralTextButton', 'Button', 'ResourceLegendButton')}
              onClick={(event) => onResourceVisibilityChange(event, resource.id)}
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
      })}
    </section>
  );
});
