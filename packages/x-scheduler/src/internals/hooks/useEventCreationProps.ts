import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerEventCreationConfig } from '@mui/x-scheduler-headless/models';

export function useEventCreationProps(
  onCreate: (parameters: {
    event: React.MouseEvent<HTMLDivElement>;
    creationConfig: SchedulerEventCreationConfig;
  }) => void,
) {
  const store = useSchedulerStoreContext();
  const creationConfig = useStore(store, schedulerEventSelectors.creationConfig);

  if (creationConfig === false) {
    return null;
  }

  if (creationConfig.interaction === 'double-click') {
    return {
      onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) =>
        onCreate({ event, creationConfig }),
    };
  }

  return {
    onClick: (event: React.MouseEvent<HTMLDivElement>) => onCreate({ event, creationConfig }),
  };
}
