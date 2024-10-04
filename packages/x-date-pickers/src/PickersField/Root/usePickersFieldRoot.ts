import * as React from 'react';
import { mergeReactProps } from '@base_ui/react/utils/mergeReactProps';
import { getStyleHookProps } from '@base_ui/react/utils/getStyleHookProps';
import {
  useFieldState,
  useFieldValidation,
  useFieldCharacterEditing,
  useFieldAccessibleDOMInteractions,
  useFieldAccessibleContainerProps,
} from '../../internals/hooks/useField';
import type { PickersFieldProvider } from './PickersFieldProvider';
import { PickerManagerProperties, PickerAnyAccessibleValueManagerV8 } from '../../models';
import { useLocalizationContext } from '../../internals/hooks/useUtils';

export function usePickersFieldRoot<TManager extends PickerAnyAccessibleValueManagerV8>(
  params: UsePickersFieldRoot.Parameters<TManager>,
): UsePickersFieldRoot.ReturnValue {
  type ManagerProperties = PickerManagerProperties<TManager>;
  type TValue = ManagerProperties['value'];
  type TDate = ManagerProperties['date'];
  type TSection = ManagerProperties['section'];
  type TInternalProps = ManagerProperties['internalProps'];
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

  const domGetters = {};

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
    contentEditable,
    sectionListRef,
    registerSectionRef,
    registerSectionContentRef,
    sectionsRef,
    sectionsContentRef,
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
