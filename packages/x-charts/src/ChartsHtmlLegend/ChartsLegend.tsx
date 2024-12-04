'use client';
import * as React from 'react';
import { useLegend } from '../hooks/useLegend';
import { ChartsLegendItem } from './ChartsLegendItem';

export default function ChartsLegend() {
  const data = useLegend();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {data.itemsToDisplay.map((item) => {
        return (
          <ChartsLegendItem
            key={item.id}
            gap={8}
            mark={{
              color: item.color,
              type: item.type,
            }}
          >
            {item.label}
          </ChartsLegendItem>
        );
      })}
    </div>
  );
}

export { ChartsLegend };
