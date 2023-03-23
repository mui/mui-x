import * as React from 'react';
import { TooltipContext } from '../context/TooltipProvider';

export const useTooltipItemProps = () => {
  const { trigger, dispatch } = React.useContext(TooltipContext);

  if (trigger === 'axis') {
    //  The tooltip is based on axis, no need to listen element events
    return () => {};
  }

  const getItemProps = ({ seriesType, seriesId, dataIndex }) => {
    const onMouseEnter = (event) => {
      dispatch({ type: 'enter', data: { seriesType, seriesId, dataIndex, target: event.target } });
    };
    const onMouseLeave = () => {
      dispatch({ type: 'leave', data: { seriesType, seriesId, dataIndex } });
    };
    return {
      onMouseEnter,
      onMouseLeave,
    };
  };
  return getItemProps;
};
