import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@mui/x-data-grid-generator';
import { FeedGrid } from '../components/feed-grid';
import { PricingGrid } from '../components/pricing-grid';

export default {
  title: 'DataGridPro Test/Streaming',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const SlowUpdateGrid = () => {
  const rate = { min: 1000, max: 5000 };

  return (
    <React.Fragment>
      <p>
        One Subscription per row! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <PricingGrid
        onSelectionModelChange={(params) => action('onSelectionChange', { depth: 1 })(params)}
        throttleRowsMs={100}
        {...rate}
      />
    </React.Fragment>
  );
};

export const FastUpdateGrid = () => {
  const rate = { min: 100, max: 500 };

  return (
    <React.Fragment>
      <p>
        One Subscription per row! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <PricingGrid
        onSelectionModelChange={(params) => action('onSelectionChange', { depth: 1 })(params)}
        throttleRowsMs={100}
        {...rate}
      />
    </React.Fragment>
  );
};

export const SingleSubscriptionFast = () => {
  const rate = { min: 50, max: 500 };
  return (
    <React.Fragment>
      <p>
        One Subscription for the whole feed! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <FeedGrid
        onSelectionModelChange={(params) => action('onSelectionChange', { depth: 1 })(params)}
        {...rate}
      />
    </React.Fragment>
  );
};

export const SingleSubscriptionFastWithThrottle = () => {
  const rate = { min: 50, max: 500 };
  return (
    <React.Fragment>
      <p>
        One Subscription for the whole feed! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <FeedGrid
        onSelectionModelChange={(params) => action('onSelectionChange', { depth: 1 })(params)}
        throttleRowsMs={500}
        {...rate}
      />
    </React.Fragment>
  );
};

export function SimpleRxUpdate() {
  const apiRef = useGridApiRef();
  const columns = [{ field: 'id' }, { field: 'username', width: 150 }, { field: 'age', width: 80 }];

  React.useEffect(() => {
    const subscription = interval(100).subscribe(() =>
      apiRef.current.updateRows([
        { id: 1, username: randomUserName(), age: randomInt(10, 80) },
        { id: 2, username: randomUserName(), age: randomInt(10, 80) },
        { id: 3, username: randomUserName(), age: randomInt(10, 80) },
        { id: 4, username: randomUserName(), age: randomInt(10, 80) },
      ]),
    );

    return () => subscription.unsubscribe();
  }, [apiRef]);

  return <DataGridPro rows={[]} columns={columns} apiRef={apiRef} autoHeight />;
}
