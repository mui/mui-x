'use client';
import * as React from 'react';
import { SchedulerTranslations } from '../../models/translations';
import { enUS } from '../../translations/enUS';

export type TranslationsContext = SchedulerTranslations;

/**
 * @internal
 */
export const TranslationsContext = React.createContext<TranslationsContext>(enUS);

export function TranslationsProvider(props: TranslationProviderProps) {
  const parentTranslations = React.useContext(TranslationsContext);

  const mergedTranslations = React.useMemo(() => {
    if (props.translations === undefined) {
      return parentTranslations;
    }

    return { ...parentTranslations, ...props.translations };
  }, [parentTranslations, props.translations]);

  if (props.translations === undefined) {
    return props.children;
  }

  return (
    <TranslationsContext.Provider value={mergedTranslations}>
      {props.children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  return React.useContext(TranslationsContext);
}

interface TranslationProviderProps {
  children: React.ReactNode;
  translations: Partial<SchedulerTranslations> | undefined;
}
