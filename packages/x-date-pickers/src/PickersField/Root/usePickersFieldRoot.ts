import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { useField } from '../../internals/hooks/useField';
import type { PickersFieldProvider } from './PickersFieldProvider';
import { PickerValueManagerProperties, PickerAnyAccessibleValueManagerV8 } from '../../models';
import { useLocalizationContext } from '../../internals/hooks/useUtils';

export function usePickersFieldRoot<TValueManager extends PickerAnyAccessibleValueManagerV8>(
  params: UsePickersFieldRoot.Parameters<TValueManager>,
): UsePickersFieldRoot.ReturnValue {
  type ValueManagerProperties = PickerValueManagerProperties<TValueManager>;
  type TValue = ValueManagerProperties['value'];
  type TDate = ValueManagerProperties['date'];
  type TSection = ValueManagerProperties['section'];
  type TInternalProps = ValueManagerProperties['internalProps'];
  type TInternalPropsWithDefaults = ValueManagerProperties['internalProps'];

  const { valueManager, internalProps } = params;

  const adapter = useLocalizationContext<TDate>();
  const internalPropsWithDefault: TInternalPropsWithDefaults =
    valueManager.applyDefaultsToFieldInternalProps({
      adapter,
      internalProps,
    });

  const {
    sectionListRef,
    elements,
    // TODO: Rename to a more meaningful name now that it's not the props passed directly to the root `contentEditable` DOM attribute.
    contentEditable,
    enableAccessibleFieldDOMStructure,

    // TODO: Add support
    clearable,
    onClear,
    error,
    focused,
    areAllSectionsEmpty,
    disabled,

    // Props forwarded to the hidden input
    value,
    onChange,
    readOnly,
    // id,
    // name,

    // Props forwarded to the root
    onFocus,
    onBlur,

    ...propsForwardedToContent
  } = useField<
    TValue,
    TDate,
    TSection,
    true,
    // TODO: Add forwaredProps
    {},
    TInternalProps
  >({
    forwardedProps: {},
    internalProps: { ...internalPropsWithDefault, enableAccessibleFieldDOMStructure: true },
    valueManager: valueManager.legacyValueManager,
    fieldValueManager: valueManager.fieldValueManager,
    validator: valueManager.validator,
    valueType: valueManager.valueType,
  });

  const contentRef = React.useRef<HTMLDivElement>(null);
  const sectionsRef = React.useRef<{ [sectionIndex: string]: HTMLSpanElement }>({});
  const sectionsContentRef = React.useRef<{
    [sectionIndex: string]: HTMLSpanElement;
  }>({});

  const registerSectionRef = React.useCallback(
    (sectionIndex: number, ref: HTMLSpanElement | null) => {
      if (ref == null) {
        delete sectionsRef.current[sectionIndex];
      } else {
        sectionsRef.current[sectionIndex] = ref;
      }
    },
    [],
  );

  const registerSectionContentRef = React.useCallback(
    (sectionIndex: number, ref: HTMLSpanElement | null) => {
      if (ref == null) {
        delete sectionsContentRef.current[sectionIndex];
      } else {
        sectionsContentRef.current[sectionIndex] = ref;
      }
    },
    [],
  );

  React.useImperativeHandle(sectionListRef, () => ({
    // TODO: Rename "getContent" to match the component name in PickersField instead of the one in PickersSectionList.
    getRoot() {
      if (!contentRef.current) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getRoot before the mount of the component.`,
        );
      }

      return contentRef.current;
    },
    // TODO: Rename "getSection" to match the component name in PickersField instead of the one in PickersSectionList.
    getSectionContainer(index) {
      const sectionRef = sectionsRef.current[index];
      if (!sectionRef) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getSectionContainer before the mount of the component.`,
        );
      }

      return sectionRef;
    },
    getSectionContent(index) {
      const sectionContentRef = sectionsContentRef.current[index];
      if (!contentRef.current) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getSectionContent before the mount of the component.`,
        );
      }

      return sectionContentRef;
    },
    getSectionIndexFromDOMElement(element) {
      if (!contentRef.current) {
        throw new Error(
          `MUI X: Cannot call sectionListRef.getSectionIndexFromDOMElement before the mount of the component.`,
        );
      }

      if (element == null || !contentRef.current.contains(element)) {
        return null;
      }

      const matchingSectionIndex = Object.keys(sectionsRef.current).find((sectionIndex) =>
        sectionsRef.current[sectionIndex].contains(element),
      );
      if (matchingSectionIndex == null) {
        return null;
      }

      return Number(matchingSectionIndex);
    },
  }));

  const getRootProps: UsePickersFieldRoot.ReturnValue['getRootProps'] = (externalProps) =>
    mergeReactProps(externalProps, {
      onFocus,
      onBlur,
    });

  // TODO: Memoize?
  const contextValue: PickersFieldProvider.ContextValue = {
    elements,
    contentEditable,
    contentRef,
    registerSectionRef,
    registerSectionContentRef,
    propsForwardedToContent,
    propsForwardedToHiddenInput: { value, onChange, readOnly, disabled },
  };

  // TODO: Memoize?
  return { getRootProps, contextValue };
}

export namespace UsePickersFieldRoot {
  export interface Parameters<TValueManager extends PickerAnyAccessibleValueManagerV8> {
    valueManager: TValueManager;
    internalProps: PickerValueManagerProperties<TValueManager>['internalProps'];
  }

  export interface ReturnValue {
    /**
     * Resolver for the root element's props.
     * @param {React.ComponentPropsWithRef<'div'>} externalProps custom props for the root element
     * @returns {React.ComponentPropsWithRef<'div'>} props that should be spread on the root element
     */
    getRootProps: (
      externalProps?: React.ComponentPropsWithRef<'div'>,
    ) => React.ComponentPropsWithRef<'div'>;

    contextValue: PickersFieldProvider.ContextValue;
  }
}
