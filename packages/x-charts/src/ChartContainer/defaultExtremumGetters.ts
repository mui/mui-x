import {
  getExtremumX as getBarExtremumX,
  getExtremumY as getBarExtremumY,
} from '../BarChart/extremums';
import {
  getExtremumX as getScatterExtremumX,
  getExtremumY as getScatterExtremumY,
} from '../ScatterChart/extremums';
import {
  getExtremumX as getLineExtremumX,
  getExtremumY as getLineExtremumY,
} from '../LineChart/extremums';
import { ExtremumGettersConfig } from '../context/CartesianContextProvider';

export const xExtremumGetters: ExtremumGettersConfig = {
  bar: getBarExtremumX,
  scatter: getScatterExtremumX,
  line: getLineExtremumX,
};

export const yExtremumGetters: ExtremumGettersConfig = {
  bar: getBarExtremumY,
  scatter: getScatterExtremumY,
  line: getLineExtremumY,
};
