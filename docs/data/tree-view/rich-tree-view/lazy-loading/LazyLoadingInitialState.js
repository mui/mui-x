import {
  randomInt,
  randomName,
  randomId,
  randomBoolean,
} from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { initialItems } from './items';

const fetchData = async () => {
  const length = randomInt(2, 10);
  const rows = Array.from({ length }, () => ({
    id: randomId(),
    label: randomName({}, {}),
    ...(randomBoolean() ? { childrenCount: length } : {}),
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rows);
    }, 1000);
  });
};

export default function LazyLoadingInitialState() {
  return (
    <div style={{ width: 300, height: 240 }}>
      <RichTreeViewPro
        items={initialItems}
        dataSource={{
          getChildrenCount: (item) => item?.childrenCount,
          getTreeItems: fetchData,
        }}
      />
    </div>
  );
}
