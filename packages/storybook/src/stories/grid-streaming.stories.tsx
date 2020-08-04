import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { GridOptionsProp, XGrid, useApiRef } from '@material-ui/x-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { interval } from 'rxjs';
import { randomInt, randomUserName } from '@material-ui/x-grid-data-generator';
import { FeedGrid } from '../components/feed-grid';
import { PricingGrid } from '../components/pricing-grid';

export default {
  title: 'X-Grid Tests/Streaming',
  component: XGrid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

export const SlowUpdateGrid = () => {
  const options: GridOptionsProp = {
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onRowSelected: (params) => action('onRowSelected')(params),
  };
  const rate = { min: 1000, max: 5000 };
  return (
    <React.Fragment>
      <p>
        One Subscription per row! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <PricingGrid options={options} {...rate} />
    </React.Fragment>
  );
};
export const FastUpdateGrid = () => {
  const options: GridOptionsProp = {
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onRowSelected: (params) => action('onRowSelected')(params),
  };
  const rate = { min: 100, max: 500 };
  return (
    <React.Fragment>
      <p>
        One Subscription per row! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <PricingGrid options={options} {...rate} />
    </React.Fragment>
  );
};
export const SingleSubscriptionFast = () => {
  const options: GridOptionsProp = {
    onSelectionChange: (params) => action('onSelectionChange', { depth: 1 })(params),
    onRowSelected: (params) => action('onRowSelected')(params),
  };
  const rate = { min: 100, max: 500 };
  return (
    <React.Fragment>
      <p>
        One Subscription for the whole feed! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <FeedGrid options={options} {...rate} />
    </React.Fragment>
  );
};

export function SimpleRxUpdate() {
  const apiRef = useApiRef();
  const columns = [{ field: 'id' }, { field: 'username', width: 150 }, { field: 'age', width: 80 }];

  React.useEffect(() => {
    const subscription = interval(100).subscribe(() =>
      apiRef.current.updateRowData([
        { id: 1, username: randomUserName(), age: randomInt(10, 80) },
        { id: 2, username: randomUserName(), age: randomInt(10, 80) },
        { id: 3, username: randomUserName(), age: randomInt(10, 80) },
        { id: 4, username: randomUserName(), age: randomInt(10, 80) },
      ]),
    );

    return () => subscription.unsubscribe();
  }, [apiRef]);

  return <XGrid rows={[]} columns={columns} apiRef={apiRef} options={{ autoHeight: true }} />;
}
