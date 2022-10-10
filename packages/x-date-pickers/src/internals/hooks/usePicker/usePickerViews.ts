import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { CalendarOrClockPickerView } from '../../models';
import { useViews } from '../useViews';
import { PickerSelectionState } from '../usePickerState';
import { useIsLandscape } from '../useIsLandscape';
import { UseFieldInternalProps } from '../useField';

type PickerViewRenderer<TValue, TView extends CalendarOrClockPickerView, TViewProps extends {}> = (
  props: PickerViewsRendererProps<TValue, TView, TViewProps>,
) => React.ReactElement;

export type PickerDateSectionModeLookup<TView extends CalendarOrClockPickerView> = Record<
  TView,
  'field' | 'popper'
>;

export interface ExportedUsePickerViewProps<TView extends CalendarOrClockPickerView> {
  autoFocus?: boolean;
  /**
   * Make picker read only.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
  /**
   * First view to show.
   */
  openTo: TView;
  /**
   * Callback fired on view change.
   * @template View
   * @param {View} view The new view.
   */
  onViewChange?: (view: TView) => void;
  /**
   * Array of views to show.
   */
  views: readonly TView[];
}

export interface UsePickerViewsProps<TValue, TView extends CalendarOrClockPickerView>
  extends ExportedUsePickerViewProps<TView> {
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
  value: TValue;
}

export interface UsePickerViewParams<
  TValue,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
> {
  props: UsePickerViewsProps<TValue, TView>;
  renderViews: PickerViewRenderer<TValue, TView, TViewProps>;
  sectionModeLookup?: PickerDateSectionModeLookup<TView>;
  additionalViewProps: TViewProps;
  inputRef?: React.RefObject<HTMLInputElement>;
  open: boolean;
  onClose: () => void;
  onSelectedSectionsChange: NonNullable<
    UseFieldInternalProps<TValue, unknown>['onSelectedSectionsChange']
  >;
}

export interface UsePickerViewsResponse {
  hasPopperView: boolean;
  renderViews: () => React.ReactNode;
  shouldRestoreFocus: () => boolean;
}

export type PickerViewsRendererProps<
  TValue,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
> = TViewProps &
  Pick<
    UsePickerViewsProps<TValue, TView>,
    'value' | 'onChange' | 'views' | 'onViewChange' | 'autoFocus'
  > & {
    view: TView;
    value: TValue;
    isLandscape: boolean;
  };

let warnedOnceNotValidOpenTo = false;

export const usePickerViews = <
  TValue,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
>({
  props,
  renderViews,
  sectionModeLookup: inputSectionModelLookup,
  additionalViewProps,
  inputRef,
  open,
  onClose,
  onSelectedSectionsChange,
}: UsePickerViewParams<TValue, TView, TViewProps>): UsePickerViewsResponse => {
  const { views, openTo, onViewChange, onChange, orientation, ...other } = props;

  const isLandscape = useIsLandscape(views, orientation);

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidOpenTo && !views.includes(openTo)) {
      console.warn(
        `MUI: \`openTo="${openTo}"\` is not a valid prop.`,
        `It must be an element of \`views=["${views.join('", "')}"]\`.`,
      );
      warnedOnceNotValidOpenTo = true;
    }
  }

  // TODO: Stop using `useViews` ?
  const { openView, setOpenView, handleChangeAndOpenNext } = useViews<TValue, TView>({
    view: undefined,
    views,
    openTo,
    onChange,
    onViewChange,
  });

  const viewModeResponse = React.useMemo(() => {
    let hasPopperView = false;
    const sectionModeLookup = {} as PickerDateSectionModeLookup<TView>;

    views.forEach((view) => {
      const viewMode: 'field' | 'popper' = inputSectionModelLookup?.[view] ?? 'popper';
      if (viewMode === 'popper') {
        hasPopperView = true;
      }

      sectionModeLookup[view] = viewMode;
    });

    return {
      hasPopperView,
      sectionModeLookup,
    };
  }, [inputSectionModelLookup, views]);

  const isFieldView = viewModeResponse.sectionModeLookup[openView] === 'field';

  const shouldRestoreFocus = useEventCallback(() => !isFieldView);

  useEnhancedEffect(() => {
    if (isFieldView && open) {
      onClose();
      onSelectedSectionsChange('hour');

      setTimeout(() => {
        inputRef?.current!.focus();
      });
    }
  }, [openView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (!open) {
      return;
    }

    if (!isFieldView && viewModeResponse.hasPopperView) {
      setOpenView(openTo);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastOpenView = React.useRef(openTo);

  const viewInPopper = React.useMemo(() => {
    if (viewModeResponse.sectionModeLookup[openView] === 'field') {
      return lastOpenView.current;
    }

    lastOpenView.current = openView;
    return openView;
  }, [openView, viewModeResponse.sectionModeLookup]);

  return {
    ...viewModeResponse,
    shouldRestoreFocus,
    renderViews: () =>
      renderViews({
        view: viewInPopper,
        onViewChange: setOpenView,
        onChange: handleChangeAndOpenNext,
        views,
        isLandscape,
        ...other,
        ...additionalViewProps,
      }),
  };
};
