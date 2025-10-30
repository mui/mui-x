import clsx from 'clsx';
import { Store, useStore } from '@base-ui-components/utils/store';
import './EventDragPreview.css';
import { RenderDragPreviewParameters } from '@mui/x-scheduler-headless/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { getColorClassName } from '../../utils/color-utils';

const fakeStore = {
  subscribe: () => {},
  getSnapshot: () => ({}),
} as unknown as Store<any>;

export function EventDragPreview(props: RenderDragPreviewParameters) {
  const store = useSchedulerStoreContext(true);
  const color = useStore(
    store ?? fakeStore,
    store ? schedulerEventSelectors.color : () => 'jade' as const,
    props.data.id,
  );

  return (
    <div className={clsx('EventDragPreview', getColorClassName(color))}>{props.data.title}</div>
  );
}
