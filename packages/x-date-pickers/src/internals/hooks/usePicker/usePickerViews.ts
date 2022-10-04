import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { CalendarOrClockPickerView } from '../../models';
import { useViews } from '../useViews';
import { PickerSelectionState } from '../usePickerState';
import { useIsLandscape } from '../useIsLandscape';
import { UseFieldInternalProps } from '../useField';

function raf() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

export type PickerViewRenderer<TValue, TView extends CalendarOrClockPickerView> = (
  props: PickerViewsRendererProps<TValue, TView>,
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

interface UsePickerViewParams<TValue, TView extends CalendarOrClockPickerView> {
  props: UsePickerViewsProps<TValue, TView>;
  renderViews: PickerViewRenderer<TValue, TView>;
  sectionModeLookup?: PickerDateSectionModeLookup<TView>;
  open: boolean;
  onClose: () => void;
  onSelectedSectionsChange: NonNullable<
    UseFieldInternalProps<TValue, unknown>['onSelectedSectionsChange']
  >;
}

export interface UsePickerViewsResponse {
  hasFieldView: boolean;
  hasPopperView: boolean;
  renderViews: () => React.ReactNode;
  shouldRestoreFocus: () => boolean;
}

export interface PickerViewsRendererProps<TValue, TView extends CalendarOrClockPickerView>
  extends Pick<
    UsePickerViewsProps<TValue, TView>,
    'value' | 'onChange' | 'views' | 'onViewChange' | 'autoFocus'
  > {
  view: TView;
  value: TValue;
  isLandscape: boolean;
}

let warnedOnceNotValidOpenTo = false;

export const usePickerViews = <TValue, TView extends CalendarOrClockPickerView>({
  props,
  renderViews,
  sectionModeLookup: inputSectionModelLookup,
  open,
  onClose,
  onSelectedSectionsChange,
}: UsePickerViewParams<TValue, TView>): UsePickerViewsResponse => {
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
    let hasFieldView = false;
    let hasPopperView = false;
    const sectionModeLookup = {} as PickerDateSectionModeLookup<TView>;

    views.forEach((view) => {
      const viewMode: 'field' | 'popper' = inputSectionModelLookup?.[view] ?? 'popper';
      if (viewMode === 'field') {
        hasFieldView = true;
      } else {
        hasPopperView = true;
      }

      sectionModeLookup[view] = viewMode;
    });

    return {
      hasFieldView,
      hasPopperView,
      sectionModeLookup,
    };
  }, [inputSectionModelLookup, views]);

  const shouldRestoreFocus = useEventCallback(() => {
    const openViewMode = viewModeResponse.sectionModeLookup[openView];
    return openViewMode !== 'field';
  });

  useEnhancedEffect(() => {
    const openViewMode = viewModeResponse.sectionModeLookup[openView];
    if (openViewMode === 'field' && open) {
      onClose();
      onSelectedSectionsChange('hour');

      raf().then(() => {
        document.querySelectorAll('input')[1]!.focus();
      });

      // TODO: Remove setTimeout and stop hard-coding the section to select
      setTimeout(() => {}, 100);
    }
  }, [openView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
    if (!open) {
      return;
    }

    const openViewMode = viewModeResponse.sectionModeLookup[openView];
    if (openViewMode === 'field' && viewModeResponse.hasPopperView) {
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
      }),
  };
};
