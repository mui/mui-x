/* eslint-disable no-restricted-imports */
import * as React from 'react';
import { Position } from '@mui/x-charts/models';
import { Position as LegendPositionPro } from '@mui/x-charts-pro/models';

const legendPosition: Position = {};
type LegendPositionType = {} & Position;
interface LegendPositionProps extends Position {}

const legendPositionPro: LegendPositionPro = {};
type LegendPositionProType = {} & LegendPositionPro;
interface LegendPositionProProps extends LegendPositionPro {}
