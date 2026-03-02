'use client';
import { useFocusedItem } from '../hooks/useFocusedItem';
import { useChartContext } from '../context/ChartProvider';

function ChartsVoiceover() {
  const { instance } = useChartContext();

  const focusedItem = useFocusedItem();

  const focusedValues = instance?.getFocusedValues?.(focusedItem);

  return (
    <div>
      {JSON.stringify(focusedItem)}
      <br />
      {JSON.stringify(focusedValues)}
    </div>
  );
}

export { ChartsVoiceover };
