'use client';
import * as React from 'react';
import clsx from 'clsx';
import { type ChartsRotationAxisClasses, useUtilityClasses } from './chartsRotationAxisClasses';

export interface ChartsRotationAxisProps extends React.HTMLAttributes<HTMLDivElement> {
  classes?: Partial<ChartsRotationAxisClasses>;
}

function ChartsRotationAxis(props: ChartsRotationAxisProps) {
  const { className, classes: classesProp, ...other } = props;
  const classes = useUtilityClasses(classesProp);
  return <div className={clsx(classes.root, className)} {...other} />;
}

export { ChartsRotationAxis };
