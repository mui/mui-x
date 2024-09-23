import * as React from 'react';
import { useField } from '../../internals/hooks/useField';
import type { PickersFieldProvider } from './PickersFieldProvider';
import {
  InferFieldInternalProps,
  InferFieldSection,
  InferValueFromDate,
  PickerController,
} from '../../models';
import { useLocalizationContext } from '../../internals/hooks/useUtils';

type InferDateFromController<TController extends PickerController<any, any, any, any, any>> =
  TController extends PickerController<infer TDate, any, any, any, any> ? TDate : never;

type InferIsRangeFromController<TController extends PickerController<any, any, any, any, any>> =
  TController extends PickerController<any, infer TIsRange, any, any, any> ? TIsRange : never;

type InferValueFromController<TController extends PickerController<any, any, any, any, any>> =
  InferValueFromDate<InferDateFromController<TController>, InferIsRangeFromController<TController>>;

type InferFieldSectionFromController<
  TController extends PickerController<any, any, any, any, any>,
> = InferFieldSection<InferIsRangeFromController<TController>>;

type InferDefaultizedInternalPropsFromController<
  TController extends PickerController<any, any, any, any, any>,
> =
  TController extends PickerController<any, any, any, any, infer TDefaultizedInternalProps>
    ? TDefaultizedInternalProps
    : never;

export function usePickersFieldRoot<TController extends PickerController<any, any, any, any, any>>(
  params: UsePickersFieldRoot.Parameters<TController>,
): UsePickersFieldRoot.ReturnValue {
  const { controller, internalProps } = params;

  const adapter = useLocalizationContext<InferDateFromController<TController>>();
  const internalPropsWithDefault = controller.applyDefaultFieldInternalProps(
    adapter,
    internalProps,
  );

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
    ...otherPropsFromUseField
  } = useField<
    InferValueFromController<TController>,
    InferDateFromController<TController>,
    InferFieldSectionFromController<TController>,
    true,
    // TODO: Add forwaredProps
    {},
    InferDefaultizedInternalPropsFromController<TController>
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

  const getRootProps: UsePickersFieldRoot.ReturnValue['getRootProps'] = (externalProps = {}) => {
    return {
      children: externalProps.children,
      ...otherPropsFromUseField,
    };
  };

  // TODO: Memoize?
  const contextValue: PickersFieldProvider.ContextValue = {
    elements,
    contentEditable,
    contentRef,
    registerSectionRef,
    registerSectionContentRef,
  };

  // TODO: Memoize?
  return { getRootProps, contextValue };
}

export namespace UsePickersFieldRoot {
  export interface Parameters<TController extends PickerController<any, any, any, any, any>> {
    controller: TController;
    internalProps: InferFieldInternalProps<TController>;
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
