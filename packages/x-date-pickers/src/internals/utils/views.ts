import { DateOrTimeViewWithMeridiem } from '../models';

export const areViewsEqual = <TView extends DateOrTimeViewWithMeridiem>(
  views: ReadonlyArray<DateOrTimeViewWithMeridiem>,
  expectedViews: TView[],
): views is ReadonlyArray<TView> => {
  if (views.length !== expectedViews.length) {
    return false;
  }

  return expectedViews.every((expectedView) => views.includes(expectedView));
};

export const applyDefaultViewProps = <TView extends DateOrTimeViewWithMeridiem>({
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
    throw new Error(
      'MUI X Date Pickers: The `views` prop must contain at least one view. ' +
        'The date picker needs at least one view to display. ' +
        'Add a valid view to the views array (e.g., ["year", "month", "day"]).',
    );
  }

  return {
    views: viewsWithDefault,
    openTo: openToWithDefault,
  };
};
