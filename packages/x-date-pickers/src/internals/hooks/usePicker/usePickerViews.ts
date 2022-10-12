import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { CalendarOrClockPickerView } from '../../models';
import { useViews } from '../useViews';
import { PickerSelectionState } from '../usePickerState';
import { UseFieldInternalProps } from '../useField';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';
import type { UsePickerValueActions } from './usePickerValue';

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
  /**
   * Do not render open picker button (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
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
  wrapperVariant: WrapperVariant;
  actions: UsePickerValueActions;
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
  Pick<UsePickerViewsProps<TValue, TView>, 'value' | 'onChange' | 'views' | 'autoFocus'> & {
    view: TView;
    onViewChange: (view: TView) => void;
    value: TValue;
    wrapperVariant: WrapperVariant;
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
  wrapperVariant,
  actions,
  open,
  onClose,
  onSelectedSectionsChange,
}: UsePickerViewParams<TValue, TView, TViewProps>): UsePickerViewsResponse => {
  const { views, openTo, onViewChange, onChange, disableOpenPicker, ...other } = props;

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
  const { openView, setOpenView, handleChangeAndOpenNext } = useViews({
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
      let viewMode: 'field' | 'popper';
      if (disableOpenPicker) {
        viewMode = 'field';
      } else {
        viewMode = inputSectionModelLookup?.[view] ?? 'popper';
      }

      if (viewMode === 'popper') {
        hasPopperView = true;
      }

      sectionModeLookup[view] = viewMode;
    });

    return {
      hasPopperView,
      sectionModeLookup,
    };
  }, [disableOpenPicker, inputSectionModelLookup, views]);

  const currentViewMode = viewModeResponse.sectionModeLookup[openView];
  const shouldRestoreFocus = useEventCallback(() => currentViewMode === 'popper');

  const [popperView, setPopperView] = React.useState<TView | null>(
    currentViewMode === 'popper' ? openView : null,
  );
  if (popperView !== openView && viewModeResponse.sectionModeLookup[openView] === 'popper') {
    setPopperView(openView);
  }

  useEnhancedEffect(() => {
    if (currentViewMode === 'field' && open) {
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

    if (currentViewMode === 'field' && popperView != null) {
      setOpenView(popperView);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...viewModeResponse,
    shouldRestoreFocus,
    renderViews: () => {
      if (popperView == null) {
        return null;
      }

      return renderViews({
        view: popperView,
        onViewChange: setOpenView,
        onChange: handleChangeAndOpenNext,
        views,
        wrapperVariant,
        ...actions,
        ...other,
        ...additionalViewProps,
      });
    },
  };
};
