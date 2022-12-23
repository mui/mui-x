import { DateOrTimeView, DateView } from '../models/views';

export const isYearOnlyView = (views: readonly DateView[]): views is ReadonlyArray<'year'> =>
  views.length === 1 && views[0] === 'year';

export const isYearAndMonthViews = (
  views: readonly DateView[],
): views is ReadonlyArray<'month' | 'year'> =>
  views.length === 2 && views.indexOf('month') !== -1 && views.indexOf('year') !== -1;

export const applyDefaultViewProps = <TView extends DateOrTimeView>({
  openTo,
  defaultOpenTo,
  views,
  defaultViews,
}: {
  openTo: TView | undefined;
  defaultOpenTo: TView;
  views: readonly TView[] | undefined;
  defaultViews: readonly TView[];
}) => {
  const viewsWithDefault: readonly TView[] = views ?? defaultViews;
  let openToWithDefault: TView;
  if (openTo != null) {
    openToWithDefault = openTo;
  } else if (viewsWithDefault.includes(defaultOpenTo)) {
    openToWithDefault = defaultOpenTo;
  } else if (viewsWithDefault.length > 0) {
    openToWithDefault = viewsWithDefault[0];
  } else {
    throw new Error('MUI: The `views` prop must contain at least one view');
  }

  return {
    views: viewsWithDefault,
    openTo: openToWithDefault,
  };
};
