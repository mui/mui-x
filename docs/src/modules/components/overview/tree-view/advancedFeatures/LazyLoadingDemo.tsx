import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { randomInt, randomName, randomId, randomBoolean } from '@mui/x-data-grid-generator';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import DemoWrapper from '../../DemoWrapper';

type ItemType = TreeViewBaseItem<{
  id: string;
  label: string;
  childrenCount?: number;
}>;

export const initialItems: ItemType[] = [
  { id: '1', label: 'Amy Harris', childrenCount: randomInt(1, 5) },
  { id: '2', label: 'Sam Smith', childrenCount: randomInt(1, 5) },
  { id: '3', label: 'Jordan Miles', childrenCount: randomInt(1, 5) },
  { id: '4', label: 'Amalia Brown', childrenCount: randomInt(1, 5) },
];

export default function LazyLoadingDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  const fetchData = async (): Promise<ItemType[]> => {
    const length: number = randomInt(5, 10);
    const rows = Array.from({ length }, () => ({
      id: randomId(),
      label: randomName({}, {}),
      ...(randomBoolean() ? { childrenCount: length } : {}),
    }));

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rows);
      }, 500);
    });
  };

  return (
    <DemoWrapper link="/x/react-tree-view/rich-tree-view/editing/">
      <Stack
        spacing={1}
        sx={{ width: '100%', padding: 2, minHeight: '600px' }}
        justifyContent="space-between"
      >
        <Box
          sx={{
            height: 352,
            overflow: 'auto',
            minWidth: 260,
            padding: 2,
            width: 'fit-content',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <RichTreeViewPro
              items={initialItems}
              experimentalFeatures={{ lazyLoading: true }}
              dataSource={{
                getChildrenCount: (item) => item?.childrenCount as number,
                getTreeItems: fetchData,
              }}
            />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={
            '\n<RichTreeViewPro\n  items={[]}\n  experimentalFeatures={{ lazyLoading: true }}\n  dataSource={{\n    getChildrenCount: (item) => item?.childrenCount as number,\n    getTreeItems: fetchData,\n  }}\n/>'
          }
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
