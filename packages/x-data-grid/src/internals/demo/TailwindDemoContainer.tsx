'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface TailwindDemoContainerProps {
  children: React.ReactNode;
  documentBody?: HTMLElement;
}

/**
 * WARNING: This is an internal component used in documentation to inject the Tailwind script.
 * Please do not use it in your application.
 */

export function TailwindDemoContainer(props: TailwindDemoContainerProps) {
  const { children, documentBody } = props;
  const [isLoaded, setIsLoaded] = React.useState(false);

  const tailwindPromiseRef = React.useRef<Promise<void>>(null);

  React.useEffect(() => {
    if (!tailwindPromiseRef.current) {
      tailwindPromiseRef.current = new Promise<void>((resolve) => {
        const body = documentBody ?? document.body;

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@tailwindcss/browser@4';
        script.onload = () => resolve();
        body.appendChild(script);
      });
    }

    tailwindPromiseRef.current.then(() => setIsLoaded(true));
  }, [documentBody]);

  return isLoaded ? (
    children
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress />
    </Box>
  );
}
