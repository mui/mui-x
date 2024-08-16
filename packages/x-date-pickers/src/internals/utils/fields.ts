import { FieldValueType } from '../../models';
import {
  DATE_TIME_VALIDATION_PROP_NAMES,
  DATE_VALIDATION_PROP_NAMES,
  TIME_VALIDATION_PROP_NAMES,
} from './validation/extractValidationProps';

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

export const splitFieldInternalAndForwardedProps = <
  TProps extends {},
  TInternalPropNames extends keyof TProps,
>(
  props: TProps,
  valueType: FieldValueType,
) => {
  const forwardedProps = { ...props } as Omit<TProps, TInternalPropNames>;
  const internalProps = {} as Pick<TProps, TInternalPropNames>;

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
};
