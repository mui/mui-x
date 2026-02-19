import {
  type KeyboardFocusHandler,
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
  //  ChartSeriesType,
  // createGetNextIndexFocusedItem,
  // createGetPreviousIndexFocusedItem,
  // createGetPreviousSeriesFocusedItem,
  // createGetNextSeriesFocusedItem,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';

// export function createCommonKeyboardFocusHandler<
//   TSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
// >(outSeriesTypes: Set<TSeriesType>, allowCycles?: boolean) {
//   const keyboardFocusHandler = (event: KeyboardEvent) => {
//     switch (event.key) {
//       case 'ArrowRight':
//         return createGetNextIndexFocusedItem(outSeriesTypes, allowCycles);
//       case 'ArrowLeft':
//         return createGetPreviousIndexFocusedItem(outSeriesTypes, allowCycles);
//       case 'ArrowDown':
//         return createGetPreviousSeriesFocusedItem(outSeriesTypes);
//       case 'ArrowUp':
//         return createGetNextSeriesFocusedItem(outSeriesTypes);
//       default:
//         return null;
//     }
//   };
//   return keyboardFocusHandler;
// }

const keyboardFocusHandler: KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler(
    composableCartesianSeriesTypes,
  ) as KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType>;

export default keyboardFocusHandler;
