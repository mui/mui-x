'use client';
import * as React from 'react';
import { ChartPlugin } from '../../models';
import { UseChartInteractionSignature, AddInteractionListener } from './useChartInteraction.types';

export const useChartInteraction: ChartPlugin<UseChartInteractionSignature> = ({ svgRef }) => {
  const addInteractionListener: AddInteractionListener = React.useCallback(
    (interaction, callback, options) => {
      svgRef.current?.addEventListener(interaction, callback, options);
    },
    [svgRef],
  );

  return {
    instance: {
      addInteractionListener,
    },
  };
};

useChartInteraction.params = {};

useChartInteraction.getDefaultizedParams = ({ params }) => ({
  ...params,
});

useChartInteraction.getInitialState = () => {
  return {};
};
