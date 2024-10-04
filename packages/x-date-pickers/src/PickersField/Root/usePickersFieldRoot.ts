import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { getStyleHookProps } from '@base_ui/react/utils/getStyleHookProps';
import {
  useFieldState,
  useFieldValidation,
  useFieldCharacterEditing,
  useFieldAccessibleDOMInteractions,
  useFieldAccessibleContainerProps,
  UseFieldAccessibleDOMGetters,
} from '../../internals/hooks/useField';
import type { PickersFieldProvider } from './PickersFieldProvider';
import { PickerManagerProperties, PickerAnyAccessibleValueManagerV8 } from '../../models';
import { useLocalizationContext } from '../../internals/hooks/useUtils';

function usePickersFieldRootDOMGetters() {
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

  // We should be able to drop `sectionListRef` and pass a param to `useField` instead.
  const domGetters = React.useMemo<UseFieldAccessibleDOMGetters>(
    () => ({
      // TODO: Rename "getContent" to match the component name in PickersField instead of the one in PickersSectionList.
      getRoot: () => {
        if (!contentRef.current) {
          throw new Error(
            `MUI X: Cannot call sectionListRef.getRoot before the mount of the component.`,
          );
        }

        return contentRef.current;
      },
      // TODO: Rename "getSection" to match the component name in PickersField instead of the one in PickersSectionList.
      getSectionContainer: (index) => {
        const sectionRef = sectionsRef.current[index];
        if (!sectionRef) {
          throw new Error(
            `MUI X: Cannot call sectionListRef.getSectionContainer before the mount of the component.`,
          );
        }

        return sectionRef;
      },
      getSectionContent: (index) => {
        const sectionContentRef = sectionsContentRef.current[index];
        if (!contentRef.current) {
          throw new Error(
            `MUI X: Cannot call sectionListRef.getSectionContent before the mount of the component.`,
          );
        }

        return sectionContentRef;
      },
      getSectionIndexFromDOMElement: (element) => {
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
    }),
    [],
  );

  return {
    domGetters,
    contentRef,
    registerSectionRef,
    registerSectionContentRef,
  };
}

export function usePickersFieldRoot<TManager extends PickerAnyAccessibleValueManagerV8>(
  params: UsePickersFieldRoot.Parameters<TManager>,
): UsePickersFieldRoot.ReturnValue {
  type ManagerProperties = PickerManagerProperties<TManager>;
  type TDate = ManagerProperties['date'];
  type TInternalPropsWithDefaults = ManagerProperties['internalPropsWithDefaults'];

  const { valueManager, internalProps, inputRef } = params;

  const [focused, setFocused] = React.useState(false);

  const localizationContext = useLocalizationContext<TDate>();

  const internalPropsWithDefaults: TInternalPropsWithDefaults =
    valueManager.applyDefaultsToFieldInternalProps({
      ...localizationContext,
      internalProps,
    });

  const forwardedProps = {};

  const { domGetters, contentRef, registerSectionRef, registerSectionContentRef } =
    usePickersFieldRootDOMGetters();

  const stateResponse = useFieldState({
    valueManager,
    forwardedProps,
    internalPropsWithDefaults,
  });

  const error = useFieldValidation({
    internalPropsWithDefaults,
    forwardedProps,
    valueManager,
    stateResponse,
  });

  const characterEditingResponse = useFieldCharacterEditing({
    error,
    stateResponse,
  });

  const interactions = useFieldAccessibleDOMInteractions({
    forwardedProps,
    internalPropsWithDefaults,
    stateResponse,
    focused,
    setFocused,
    domGetters,
  });

  const containerProps = useFieldAccessibleContainerProps({
    valueManager,
    internalPropsWithDefaults,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
    interactions,
    domGetters,
    focused,
    setFocused,
  });

  const status: UsePickersFieldRoot.ReturnValue['status'] = { focused };

  const getRootProps: UsePickersFieldRoot.ReturnValue['getRootProps'] = (externalProps) =>
    mergeReactProps(externalProps, {
      ...getStyleHookProps(status),
      onFocus,
      onBlur,
    });

  // TODO: Memoize?
  const contextValue: PickersFieldProvider.ContextValue = {
    elements,
    contentRef,
    contentEditable,
    sectionListRef,
    registerSectionRef,
    registerSectionContentRef,
    propsForwardedToContent,
    propsForwardedToHiddenInput: { value, onChange, readOnly, disabled, ref: inputRef },
  };

  // TODO: Memoize?
  return { getRootProps, contextValue, status };
}

export namespace UsePickersFieldRoot {
  export interface Parameters<TManager extends PickerAnyAccessibleValueManagerV8> {
    valueManager: TManager;
    internalProps: PickerManagerProperties<TManager>['internalProps'];
    inputRef: React.Ref<HTMLInputElement>;
  }

  export interface Status {
    focused: boolean;
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

    status: UsePickersFieldRoot.Status;
  }
}
