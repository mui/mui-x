import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { useField } from '../../internals/hooks/useField';
import type { PickersFieldProvider } from './PickersFieldProvider';
import { PickerControllerProperties, PickerAnyController } from '../../models';
import { useLocalizationContext } from '../../internals/hooks/useUtils';

export function usePickersFieldRoot<TController extends PickerAnyController>(
  params: UsePickersFieldRoot.Parameters<TController>,
): UsePickersFieldRoot.ReturnValue {
  type ControllerProperties = PickerControllerProperties<TController>;
  type TValue = ControllerProperties['value'];
  type TDate = ControllerProperties['date'];
  type TSection = ControllerProperties['section'];
  type TInternalProps = ControllerProperties['internalProps'];
  type TInternalPropsWithDefaults = ControllerProperties['internalProps'];

  const { controller, internalProps } = params;

  const adapter = useLocalizationContext<TDate>();
  const internalPropsWithDefault: TInternalPropsWithDefaults =
    controller.applyDefaultsToFieldInternalProps({
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
    valueManager: controller.valueManager,
    fieldValueManager: controller.fieldValueManager,
    validator: controller.validator,
    valueType: controller.valueType,
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
  export interface Parameters<TController extends PickerAnyController> {
    controller: TController;
    internalProps: PickerControllerProperties<TController>['internalProps'];
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
