import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { GridOptionsProp } from '@material-ui/x-grid';
import { PricingGrid } from '../components/pricing-grid';
import { FeedGrid } from '../components/feed-grid';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { XGrid } from '@material-ui/x-grid';

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
    onSelectionChanged: params => action('onSelectionChanged')(params),
    onRowSelected: params => action('onRowSelected')(params),
  };
  const rate = { min: 1000, max: 5000 };
  return (
    <>
      <p>
        One Subscription per row! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <PricingGrid options={options} {...rate} />
    </>
  );
};
export const FastUpdateGrid = () => {
  const options: GridOptionsProp = {
    onSelectionChanged: params => action('onSelectionChanged')(params),
    onRowSelected: params => action('onRowSelected')(params),
  };
  const rate = { min: 100, max: 500 };
  return (
    <>
      <p>
        One Subscription per row! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <PricingGrid options={options} {...rate} />
    </>
  );
};
export const SingleSubscriptionFast = () => {
  const options: GridOptionsProp = {
    onSelectionChanged: params => action('onSelectionChanged')(params),
    onRowSelected: params => action('onRowSelected')(params),
  };
  const rate = { min: 100, max: 500 };
  return (
    <>
      <p>
        One Subscription for the whole feed! Update rate between {rate.min} - {rate.max} ms!
      </p>
      <FeedGrid options={options} {...rate} />
    </>
  );
};
