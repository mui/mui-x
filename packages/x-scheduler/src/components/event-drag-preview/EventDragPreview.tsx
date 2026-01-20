import { styled } from '@mui/material/styles';
import { Store, useStore } from '@base-ui/utils/store';
import { RenderDragPreviewParameters } from '@mui/x-scheduler-headless/models';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { getDataPaletteProps } from '../../utils/color-utils';
import { schedulerPaletteStyles } from '../../internals/utils/tokens';

const EventDragPreviewRoot = styled('div', {
  name: 'MuiEventDragPreview',
  slot: 'Root',
})(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
  fontSize: theme.typography.body2.fontSize,
  backgroundColor: 'var(--event-color-8)',
  color: 'var(--event-color-1)',
  ...schedulerPaletteStyles,
}));

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
    <EventDragPreviewRoot {...getDataPaletteProps(color)}>{props.data.title}</EventDragPreviewRoot>
  );
}
