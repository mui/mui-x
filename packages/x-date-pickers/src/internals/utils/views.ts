import { DateOrTimeView } from '../../models';
import { DateOrTimeViewWithMeridiem } from '../models';

export const areViewsEqual = <TView extends DateOrTimeView>(
  views: ReadonlyArray<DateOrTimeView>,
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
    throw new Error('MUI X: The `views` prop must contain at least one view.');
  }

  return {
    views: viewsWithDefault,
    openTo: openToWithDefault,
  };
};
