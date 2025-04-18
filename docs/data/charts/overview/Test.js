import * as React from 'react';
import { Stack } from '@mui/system';

export default function Test() {
  const [pointerSVG, setPointerSVG] = React.useState({ react: {}, native: {} });
  const [pointerHTML, setPointerHTML] = React.useState({ react: {}, native: {} });

  return (
    <Stack>
      <svg
        width={500}
        height={500}
        viewBox="0 0 500 500"
        onPointerMove={(event) =>
          setPointerSVG({
            react: { width: event.width, height: event.height },
            native: {
              width: event.nativeEvent.width,
              height: event.nativeEvent.height,
            },
          })
        }
      >
        <rect x={0} y={0} width={500} height={500} fill="blue" />
      </svg>
      <div
        style={{ width: 500, height: 500, backgroundColor: 'green' }}
        onPointerMove={(event) =>
          setPointerHTML({
            react: { width: event.width, height: event.height },
            native: {
              width: event.nativeEvent.width,
              height: event.nativeEvent.height,
            },
          })
        }
      />
      <pre>{JSON.stringify(pointerSVG, null, 2)}</pre>
      <pre>{JSON.stringify(pointerHTML, null, 2)}</pre>
    </Stack>
  );
}
