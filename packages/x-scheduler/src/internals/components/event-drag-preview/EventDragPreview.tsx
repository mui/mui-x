import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import './EventDragPreview.css';
import { RenderDragPreviewParameters } from '@mui/x-scheduler-headless/models';
// TODO: Expose Scheduler selectors from the headless package
import { selectors } from '@mui/x-scheduler-headless/use-event-calendar';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { getColorClassName } from '../../utils/color-utils';

export function EventDragPreview(props: RenderDragPreviewParameters) {
  const store = useSchedulerStoreContext(true);
  // eslint-disable-next-line react-compiler/react-compiler, react-hooks/rules-of-hooks
  const color = store ? useStore(store, selectors.eventColor, props.data.id) : 'jade';

  return (
    <div className={clsx('EventDragPreview', getColorClassName(color))}>{props.data.title}</div>
  );
}
