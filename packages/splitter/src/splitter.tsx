/* eslint-disable react-hooks/exhaustive-deps */
import React, { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import { SplitterPanel } from './splitterPanel';
import { SplitterHandler } from './splitterHandler';
import { validateChildren } from './splitterUtils';
import styled from 'styled-components';

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

//todo useReducer && debounce rendering
export const Splitter: React.FC<SplitterProps> = ({
  sizesInPercent,
  invertHandler,
  minPanelSizes,
  children,
  direction = 'horizontal',
  displayHandler = 'fade',
}) => {
  if (sizesInPercent && sizesInPercent.length !== 2) {
    throw new Error('The Splitter component prop sizesInPercent needs to be an array of 2 numbers');
  }

  if (sizesInPercent && sizesInPercent[0] + sizesInPercent[1] > 100) {
    throw new Error('The sum of the elements in sizesInPercent should be less or equal to 100 ');
  }
  const childrenArray = React.Children.toArray(children);
  validateChildren(childrenArray);

  //Todo validate minPanelSizes
  const topPanelSize = (minPanelSizes && minPanelSizes[0]) || 0;
  const bottomPanelSize = (minPanelSizes && minPanelSizes[1]) || 0;

  const isHorizontal = (): boolean => direction === 'horizontal';
  const container = useRef<HTMLDivElement>(null);
  const panelAvailableSize = useRef<number>();
  const containerTop = useRef<number>();
  const clientY = useRef<number>();

  const [panelSizes, setPanelSizes] = useState<Array<number>>([]);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (): void => {
    setIsResizing(true);
  };

  const handleMouseUp = (): void => {
    setIsResizing(false);
  };

  const calculateSizes = (): void => {
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
  };

  const handleMouseMove = (ev: MouseEvent): void => {
    if (isResizing) {
      clientY.current = isHorizontal() ? ev.clientY : ev.clientX;
      calculateSizes();
    }
  };

  const onTouchMove = (ev: TouchEvent) => {
    if (isResizing) {
      clientY.current = isHorizontal() ? ev.targetTouches[0].clientY : ev.targetTouches[0].clientX;
      calculateSizes();
    }
  };

  const resetParentContainerSizes = () => {
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
  };

  useEffect(() => {
    window.addEventListener('resize', resetParentContainerSizes);
    return () => {
      window.removeEventListener('resize', resetParentContainerSizes);
    };
  }, [container, direction]);

  useEffect(() => {
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
  }, [sizesInPercent, direction]);

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
