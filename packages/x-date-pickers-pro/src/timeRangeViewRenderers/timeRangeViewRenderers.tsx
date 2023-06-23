import { BaseClockProps, TimeViewWithMeridiem } from '@mui/x-date-pickers/internals';
import {
  DigitalClockProps,
  TimePickerProps,
} from '@mui/x-date-pickers/DigitalClock';
import { TimeView } from '@mui/x-date-pickers/models'

export type TimeRangeViewRendererProps<
  TView extends TimeViewWithMeridiem,
  TComponentProps extends BaseClockProps<any, any>,
> = Omit<TComponentProps, 'views' | 'openTo' | 'view' | 'onViewChange'> & {
  view: TView;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
};

export const renderDigitalClockTimeRangeView = <TDate extends unknown>({}: TimeRangeViewRendererProps<
  Extract<TimeView, 'hours'>,
  Omit<DigitalClockProps<TDate>, 'timeStep'> & Pick<TimePickerProps<TDate>, 'timeSteps'>
>) => {
  return <div>HELLO</div>;
};
