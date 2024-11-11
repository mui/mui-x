'use client';
import * as React from 'react';
import { FieldValueType } from '../models';
import {
  DATE_TIME_VALIDATION_PROP_NAMES,
  DATE_VALIDATION_PROP_NAMES,
  TIME_VALIDATION_PROP_NAMES,
} from '../validation/extractValidationProps';

const SHARED_FIELD_INTERNAL_PROP_NAMES = [
  'value',
  'defaultValue',
  'referenceDate',
  'format',
  'formatDensity',
  'onChange',
  'timezone',
  'onError',
  'shouldRespectLeadingZeros',
  'selectedSections',
  'onSelectedSectionsChange',
  'unstableFieldRef',
  'enableAccessibleFieldDOMStructure',
  'disabled',
  'readOnly',
  'dateSeparator',
] as const;

type InternalPropNames<TValueType extends FieldValueType> =
  | (typeof SHARED_FIELD_INTERNAL_PROP_NAMES)[number]
  | (TValueType extends 'date' | 'date-time' ? (typeof DATE_VALIDATION_PROP_NAMES)[number] : never)
  | (TValueType extends 'time' | 'date-time' ? (typeof TIME_VALIDATION_PROP_NAMES)[number] : never)
  | (TValueType extends 'date-time' ? (typeof DATE_TIME_VALIDATION_PROP_NAMES)[number] : never);

/**
 * Split the props received by the field component into:
 * - `internalProps` which are used by the various hooks called by the field component.
 * - `forwardedProps` which are passed to the underlying component.
 * Note that some forwarded props might be used by the hooks as well.
 * For instance, hooks like `useDateField` need props like `autoFocus` to know how to behave.
 * @template TProps, TValueType
 * @param {TProps} props The props received by the field component.
 * @param {TValueType} valueType The type of the field value ('date', 'time', or 'date-time').
 */
export const useSplitFieldProps = <
  TValueType extends FieldValueType,
  TProps extends { [key in InternalPropNames<TValueType>]?: any },
>(
  props: TProps,
  valueType: TValueType,
) => {
  return React.useMemo(() => {
    const forwardedProps = { ...props } as Omit<TProps, InternalPropNames<TValueType>>;
    const internalProps = {} as Pick<TProps, InternalPropNames<TValueType>>;

    const extractProp = (propName: string) => {
      if (forwardedProps.hasOwnProperty(propName)) {
        // @ts-ignore
        internalProps[propName] = forwardedProps[propName];
        delete forwardedProps[propName as keyof typeof forwardedProps];
      }
    };

    SHARED_FIELD_INTERNAL_PROP_NAMES.forEach(extractProp);

    if (valueType === 'date') {
      DATE_VALIDATION_PROP_NAMES.forEach(extractProp);
    } else if (valueType === 'time') {
      TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
    } else if (valueType === 'date-time') {
      DATE_VALIDATION_PROP_NAMES.forEach(extractProp);
      TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
      DATE_TIME_VALIDATION_PROP_NAMES.forEach(extractProp);
    }

    return { forwardedProps, internalProps };
  }, [props, valueType]);
};
