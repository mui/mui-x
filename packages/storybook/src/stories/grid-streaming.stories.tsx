import React from 'react';
import { action } from '@storybook/addon-actions';
import { GridOptionsProp } from '@material-ui-x/grid';
import { PricingGrid } from '../components/pricing-grid';
import {FeedGrid} from "../components/feed-grid";

export default {
  title: 'Grid Streaming',
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
        One Subscription per row!
        So every rows should update independently at a rate between {rate.min} - {rate.max} ms!
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
        One Subscription per row!
        So every rows should update independently at a rate between {rate.min} - {rate.max} ms!
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
        One Subscription for the whole feed! The grid updates just the changed values.
        So every rows should update independently at a rate between {rate.min} - {rate.max} ms!
      </p>
      <FeedGrid options={options} {...rate} />
    </>
  );
};