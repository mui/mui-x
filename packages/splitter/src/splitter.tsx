import * as React from 'react';
import styled from 'styled-components';
import { SplitterPanel } from './splitterPanel';
import { SplitterHandler } from './splitterHandler';
import { validateChildren } from './splitterUtils';

export interface SplitterProps {
  minPanelSizes?: number[];
  sizesInPercent?: number[];
  invertHandler?: boolean;
  direction?: 'vertical' | 'horizontal';
  displayHandler?: 'none' | 'show' | 'fade';
}

const SplitterWrapper = styled.div<{ isResizing: boolean; direction: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${p => (p.direction === 'horizontal' ? 'column' : 'row')};
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  cursor: ${p => (p.isResizing ? 'row-resize' : '')};
`;

// Todo useReducer && debounce rendering
export const Splitter: React.FC<SplitterProps> = ({
  sizesInPercent,
  invertHandler,
  minPanelSizes,
  children,
  direction = 'horizontal',
  displayHandler = 'fade',
}) => {
  if (sizesInPercent && sizesInPercent.length !== 2) {
    throw new Error(
      'Material-UI: The Splitter component prop sizesInPercent needs to be an array of 2 numbers.',
    );
  }

  if (sizesInPercent && sizesInPercent[0] + sizesInPercent[1] > 100) {
    throw new Error(
      'Material-UI: The sum of the elements in sizesInPercent should be less or equal to 100.',
    );
  }
  const childrenArray = React.Children.toArray(children);
  validateChildren(childrenArray);

  // Todo validate minPanelSizes
  const topPanelSize = (minPanelSizes && minPanelSizes[0]) || 0;
  const bottomPanelSize = (minPanelSizes && minPanelSizes[1]) || 0;

  const isHorizontal = React.useCallback((): boolean => direction === 'horizontal', [direction]);
  const container = React.useRef<HTMLDivElement>(null);
  const panelAvailableSize = React.useRef<number>();
  const containerTop = React.useRef<number>();
  const clientY = React.useRef<number>();

  const [panelSizes, setPanelSizes] = React.useState<Array<number>>([]);
  const [isResizing, setIsResizing] = React.useState(false);

  const handleMouseDown = (): void => {
    setIsResizing(true);
  };

  const handleMouseUp = (): void => {
    setIsResizing(false);
  };

  const calculateSizes = React.useCallback((): void => {
    if (
      containerTop.current != null &&
      panelAvailableSize.current != null &&
      clientY.current != null
    ) {
      const splitterY = clientY.current - containerTop.current;
      if (splitterY < topPanelSize) {
        setPanelSizes([topPanelSize, panelAvailableSize.current - topPanelSize]);
      } else if (panelAvailableSize.current - splitterY < bottomPanelSize) {
        setPanelSizes([panelAvailableSize.current - bottomPanelSize, bottomPanelSize]);
      } else {
        setPanelSizes([splitterY, panelAvailableSize.current - splitterY]);
      }
    }
  }, [bottomPanelSize, topPanelSize]);

  const handleMouseMove = (ev: React.MouseEvent): void => {
    if (isResizing) {
      clientY.current = isHorizontal() ? ev.clientY : ev.clientX;
      calculateSizes();
    }
  };

  const onTouchMove = (ev: React.TouchEvent) => {
    if (isResizing) {
      clientY.current = isHorizontal() ? ev.targetTouches[0].clientY : ev.targetTouches[0].clientX;
      calculateSizes();
    }
  };

  const resetParentContainerSizes = React.useCallback(() => {
    if (container.current && panelAvailableSize && containerTop) {
      const containerClientRect = container.current.getBoundingClientRect();
      const containerHeight = isHorizontal()
        ? containerClientRect.height
        : containerClientRect.width;
      const splitterHeight = 1;

      containerTop.current = isHorizontal() ? containerClientRect.top : containerClientRect.left;
      panelAvailableSize.current = containerHeight - splitterHeight;

      if (clientY.current != null) {
        calculateSizes();
      }
    }
  }, [calculateSizes, isHorizontal]);

  React.useEffect(() => {
    window.addEventListener('resize', resetParentContainerSizes);
    return () => {
      window.removeEventListener('resize', resetParentContainerSizes);
    };
  }, [resetParentContainerSizes]);

  React.useEffect(() => {
    if (container.current && panelAvailableSize && containerTop) {
      resetParentContainerSizes();

      if (sizesInPercent) {
        clientY.current = panelAvailableSize.current! * (sizesInPercent[0] / 100);
        setPanelSizes([clientY.current, panelAvailableSize.current! * (sizesInPercent[1] / 100)]);
      } else {
        clientY.current = panelAvailableSize.current! / 2;
        setPanelSizes([clientY.current, clientY.current]);
      }
    }
  }, [sizesInPercent, direction, resetParentContainerSizes]);

  return (
    <SplitterWrapper
      isResizing={isResizing}
      direction={direction}
      className={'splitter-container'}
      ref={container}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={handleMouseUp}
    >
      <SplitterPanel position={'top'} size={panelSizes[0]} direction={direction}>
        {childrenArray[0]}
      </SplitterPanel>
      <SplitterHandler
        onMouseDown={handleMouseDown}
        invertHandler={invertHandler}
        direction={direction}
        displayHandler={displayHandler}
      />
      <SplitterPanel position={'bottom'} size={panelSizes[1]} direction={direction}>
        {childrenArray[1]}
      </SplitterPanel>
    </SplitterWrapper>
  );
};
Splitter.displayName = 'Splitter';
