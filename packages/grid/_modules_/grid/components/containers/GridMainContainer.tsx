import * as React from 'react';
import { GRID_CONTAINER_KEYDOWN } from '../../constants/eventsConstants';
import { GridApiContext } from '../GridApiContext';

export function GridMainContainer(props: React.PropsWithChildren<{}>) {
  const apiRef = React.useContext(GridApiContext);

  const publish = React.useCallback(
    (eventName: string) => (event: React.SyntheticEvent) => {
      apiRef!.current.publishEvent(eventName, event);
    },
    [apiRef],
  );

  const eventsHandlers = React.useMemo(
    () => ({
      onKeyDown: publish(GRID_CONTAINER_KEYDOWN),
    }),
    [publish],
  );

  return (
    <div
      className="MuiDataGrid-main"
      role="rowgroup"
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      {...eventsHandlers}
    >
      {props.children}
    </div>
  );
}
