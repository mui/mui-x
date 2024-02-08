import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { GaugeContainer, GaugeContainerProps } from './GaugeContainer';
import { GaugeValueArc } from './GaugeValueArc';
import { GaugeReferenceArc } from './GaugeReferenceArc';
import { GaugeClasses, getGaugeUtilityClass } from './gaugeClasses';

export interface GaugeProps extends GaugeContainerProps {
  classes?: Partial<GaugeClasses>;
}

const useUtilityClasses = (props: GaugeProps) => {
  const { classes } = props;

  const slots = {
    root: ['root'],
    valueArc: ['valueArc'],
    referenceArc: ['referenceArc'],
  };

  return composeClasses(slots, getGaugeUtilityClass, classes);
};

function Gauge(props: GaugeProps) {
  const classes = useUtilityClasses(props);
  return (
    <GaugeContainer width={200} height={200} {...props} className={classes.root}>
      <GaugeReferenceArc className={classes.referenceArc} />
      <GaugeValueArc className={classes.valueArc} />
    </GaugeContainer>
  );
}

export { Gauge };
