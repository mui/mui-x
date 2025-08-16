import useEventCallback from '@mui/utils/useEventCallback';
import {
  executeInTheNextEventLoopTick,
  getActiveElement,
  useNullablePickerContext,
  usePickerPrivateContext,
} from '@mui/x-date-pickers/internals';

/**
 * @ignore - internal hook.
 */
export function useMultiInputRangeFieldRootProps<TForwardedProps extends { [key: string]: any }>(
  forwardedProps: TForwardedProps,
): UseMultiInputRangeFieldRootPropsReturnValue<TForwardedProps> {
  const pickerContext = useNullablePickerContext();
  const privatePickerContext = usePickerPrivateContext();

  const handleBlur = useEventCallback(() => {
    if (!pickerContext || privatePickerContext.viewContainerRole !== 'tooltip') {
      return;
    }

    executeInTheNextEventLoopTick(() => {
      if (
        privatePickerContext.rootRefObject.current?.contains(
          getActiveElement(privatePickerContext.rootRefObject.current),
        ) ||
        pickerContext.popupRef.current?.contains(getActiveElement(pickerContext.popupRef.current))
      ) {
        return;
      }

      privatePickerContext.dismissViews();
    });
  });

  return { ...forwardedProps, onBlur: handleBlur };
}

export type UseMultiInputRangeFieldRootPropsReturnValue<
  TForwardedProps extends { [key: string]: any },
> = Omit<TForwardedProps, 'onBlur'> & {
  onBlur: () => void;
};
