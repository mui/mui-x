import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import Typography from '@mui/material/Typography';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';

const minHeight = 200;
const maxHeight = 400;

const INITIAL_ITEMS: TreeViewDefaultItemModelProperties[] = Array.from(
  { length: 100 },
  (_1, i) => ({
    id: `item-${i + 1}`,
    label: `Item ${i + 1}`,
  }),
);

export default function MinMaxHeightRichTreeView() {
  const [nbItems, setNbItems] = React.useState(3);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const removeItem = () => setNbItems((x) => Math.max(0, x - 1));
  const addItem = () => setNbItems((x) => Math.min(100, x + 1));

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeItem}>
          Remove an item
        </Button>
        <Button size="small" onClick={addItem}>
          Add an item
        </Button>
      </Stack>
      <div style={{ position: 'relative' }} ref={containerRef}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight,
            minHeight,
          }}
        >
          <RichTreeViewPro items={INITIAL_ITEMS.slice(0, nbItems)} />
        </div>

        {/** Visualize max and min container height */}
        <ContainerMeasurements containerRef={containerRef} />
      </div>
    </Box>
  );
}

function ContainerMeasurements({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [containerHeight, setContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const target = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    if (target) {
      observer.observe(target);
    }
    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  const label = `${containerHeight}px`;

  if (containerHeight === 0) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: 0,
        left: -20,
        width: 20,
        height: containerHeight,
        borderColor: theme.palette.text.secondary,
        borderStyle: 'dashed',
        borderTopWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
      })}
    >
      <Typography
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'rotate(180deg) translate(0, 50%)',
          writingMode: 'vertical-lr',
          color: theme.palette.text.secondary,
          textWrap: 'nowrap',
          lineHeight: 1.2,
          fontSize: '15px',
        })}
      >
        {label}
      </Typography>
    </Box>
  );
}
