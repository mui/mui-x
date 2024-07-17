import { ChartsTextStyle } from '../ChartsText';
import { GetItemSpaceType, LegendItemParams, LegendItemWithPosition } from './chartsLegend.types';

export function legendItemPlacements(
  itemsToDisplay: LegendItemParams[],
  getItemSpace: GetItemSpaceType,
  labelStyle: ChartsTextStyle,
  direction: string,
  availableWidth: number,
  availableHeight: number,
  itemGap: number,
): [LegendItemWithPosition[], number, number] {
  // Start at 0, 0. Will be modified later by padding and position.
  let x = 0;
  let y = 0;

  // total values used to align legend later.
  let totalWidthUsed = 0;
  let totalHeightUsed = 0;
  let rowIndex = 0;
  const rowMaxHeight = [0];

  const seriesWithRawPosition = itemsToDisplay.map(({ label, ...other }) => {
    const itemSpace = getItemSpace(label, labelStyle);
    const rep = {
      ...other,
      label,
      positionX: x,
      positionY: y,
      innerHeight: itemSpace.innerHeight,
      innerWidth: itemSpace.innerWidth,
      outerHeight: itemSpace.outerHeight,
      outerWidth: itemSpace.outerWidth,
      rowIndex,
    };

    if (direction === 'row') {
      if (x + itemSpace.innerWidth > availableWidth) {
        // This legend item would create overflow along the x-axis, so we start a new row.
        x = 0;
        y += rowMaxHeight[rowIndex];
        rowIndex += 1;
        if (rowMaxHeight.length <= rowIndex) {
          rowMaxHeight.push(0);
        }
        rep.positionX = x;
        rep.positionY = y;
        rep.rowIndex = rowIndex;
      }
      totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.outerWidth);
      totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.outerHeight);
      rowMaxHeight[rowIndex] = Math.max(rowMaxHeight[rowIndex], itemSpace.outerHeight);

      x += itemSpace.outerWidth;
    }

    if (direction === 'column') {
      if (y + itemSpace.innerHeight > availableHeight) {
        // This legend item would create overflow along the y-axis, so we start a new column.
        x = totalWidthUsed + itemGap;
        y = 0;
        rowIndex = 0;
        rep.positionX = x;
        rep.positionY = y;
        rep.rowIndex = rowIndex;
      }
      if (rowMaxHeight.length <= rowIndex) {
        rowMaxHeight.push(0);
      }
      totalWidthUsed = Math.max(totalWidthUsed, x + itemSpace.outerWidth);
      totalHeightUsed = Math.max(totalHeightUsed, y + itemSpace.outerHeight);

      rowIndex += 1;
      y += itemSpace.outerHeight;
    }

    return rep;
  });

  return [
    seriesWithRawPosition.map((item) => ({
      ...item,
      positionY:
        item.positionY +
        (direction === 'row'
          ? rowMaxHeight[item.rowIndex] / 2 // Get the center of the entire row
          : item.outerHeight / 2), // Get the center of the item
    })),
    totalWidthUsed,
    totalHeightUsed,
  ];
}
