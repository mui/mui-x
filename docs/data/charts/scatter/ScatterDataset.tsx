import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

export default function ScatterDataset() {
  return (
    <ScatterChart
      dataset={dataset}
      series={[
        { datasetKeys: { id: 'version', x: 'x1', y: 'y1' }, label: 'Series A' },
        { datasetKeys: { id: 'version', x: 'x2', y: 'y2' }, label: 'Series B' },
      ]}
      {...chartSetting}
    />
  );
}

const dataset = [
  { id: 'data-0', x1: 373, y1: 434, x2: 304, y2: 349 },
  { id: 'data-1', x1: 173, y1: 437, x2: 208, y2: 347 },
  { id: 'data-2', x1: 68, y1: 292, x2: 151, y2: 280 },
  { id: 'data-3', x1: 121, y1: 116, x2: 185, y2: 176 },
  { id: 'data-4', x1: 322, y1: 61, x2: 278, y2: 170 },
  { id: 'data-5', x1: 466, y1: 210, x2: 346, y2: 246 },
  { id: 'data-6', x1: 418, y1: 403, x2: 326, y2: 333 },
  { id: 'data-7', x1: 224, y1: 449, x2: 235, y2: 352 },
  { id: 'data-8', x1: 87, y1: 335, x2: 158, y2: 311 },
  { id: 'data-9', x1: 104, y1: 167, x2: 166, y2: 218 },
  { id: 'data-10', x1: 262, y1: 70, x2: 251, y2: 161 },
  { id: 'data-11', x1: 421, y1: 167, x2: 335, y2: 199 },
  { id: 'data-12', x1: 442, y1: 352, x2: 341, y2: 302 },
  { id: 'data-13', x1: 294, y1: 474, x2: 264, y2: 366 },
  { id: 'data-14', x1: 101, y1: 386, x2: 174, y2: 318 },
  { id: 'data-15', x1: 64, y1: 198, x2: 154, y2: 227 },
  { id: 'data-16', x1: 222, y1: 75, x2: 223, y2: 181 },
  { id: 'data-17', x1: 411, y1: 105, x2: 316, y2: 204 },
  { id: 'data-18', x1: 457, y1: 290, x2: 349, y2: 274 },
  { id: 'data-19', x1: 348, y1: 455, x2: 291, y2: 357 },
  { id: 'data-20', x1: 165, y1: 427, x2: 195, y2: 358 },
  { id: 'data-21', x1: 65, y1: 277, x2: 150, y2: 265 },
  { id: 'data-22', x1: 153, y1: 94, x2: 197, y2: 175 },
  { id: 'data-23', x1: 340, y1: 93, x2: 294, y2: 163 },
  { id: 'data-24', x1: 476, y1: 253, x2: 352, y2: 264 },
  { id: 'data-25', x1: 385, y1: 425, x2: 317, y2: 332 },
  { id: 'data-26', x1: 221, y1: 448, x2: 221, y2: 376 },
  { id: 'data-27', x1: 60, y1: 327, x2: 154, y2: 281 },
  { id: 'data-28', x1: 129, y1: 128, x2: 175, y2: 213 },
  { id: 'data-29', x1: 304, y1: 67, x2: 267, y2: 173 },
  { id: 'data-30', x1: 447, y1: 175, x2: 343, y2: 223 },
  { id: 'data-31', x1: 425, y1: 378, x2: 335, y2: 313 },
  { id: 'data-32', x1: 273, y1: 463, x2: 250, y2: 377 },
  { id: 'data-33', x1: 80, y1: 387, x2: 166, y2: 304 },
  { id: 'data-34', x1: 86, y1: 172, x2: 159, y2: 224 },
  { id: 'data-35', x1: 247, y1: 64, x2: 238, y2: 172 },
  { id: 'data-36', x1: 419, y1: 126, x2: 328, y2: 200 },
  { id: 'data-37', x1: 463, y1: 317, x2: 347, y2: 301 },
  { id: 'data-38', x1: 308, y1: 473, x2: 278, y2: 352 },
  { id: 'data-39', x1: 147, y1: 405, x2: 183, y2: 356 },
  { id: 'data-40', x1: 64, y1: 224, x2: 151, y2: 246 },
  { id: 'data-41', x1: 175, y1: 78, x2: 210, y2: 163 },
  { id: 'data-42', x1: 384, y1: 96, x2: 308, y2: 187 },
  { id: 'data-43', x1: 473, y1: 275, x2: 354, y2: 273 },
  { id: 'data-44', x1: 387, y1: 455, x2: 306, y2: 367 },
  { id: 'data-45', x1: 193, y1: 445, x2: 208, y2: 372 },
  { id: 'data-46', x1: 51, y1: 298, x2: 151, y2: 264 },
  { id: 'data-47', x1: 154, y1: 116, x2: 187, y2: 205 },
  { id: 'data-48', x1: 342, y1: 73, x2: 283, y2: 184 },
  { id: 'data-49', x1: 467, y1: 199, x2: 348, y2: 246 },
];

const chartSetting = {
  yAxis: [
    {
      label: 'rainfall (mm)',
      width: 60,
    },
  ],
  height: 300,
};
