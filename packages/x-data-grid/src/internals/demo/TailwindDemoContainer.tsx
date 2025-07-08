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

let tailwindLoaded = false;
let tailwindLoading = false;
let tailwindPromise: Promise<void> | null = null;

export function TailwindDemoContainer(props: TailwindDemoContainerProps) {
  const { children, documentBody } = props;
  const [isLoaded, setIsLoaded] = React.useState(tailwindLoaded);

  React.useEffect(() => {
    if (tailwindLoaded) {
      setIsLoaded(true);
      return;
    }

    if (tailwindLoading && tailwindPromise) {
      tailwindPromise.then(() => setIsLoaded(true));
      return;
    }

    tailwindLoading = true;
    tailwindPromise = new Promise<void>((resolve) => {
      const body = documentBody ?? document.body;

      const existingScript = body.querySelector(
        'script[src="https://unpkg.com/@tailwindcss/browser@4"]',
      );
      if (existingScript) {
        tailwindLoaded = true;
        tailwindLoading = false;
        setIsLoaded(true);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@tailwindcss/browser@4';
      script.onload = () => {
        tailwindLoaded = true;
        tailwindLoading = false;
        setIsLoaded(true);
        resolve();
      };
      body.appendChild(script);
    });
  }, [documentBody]);

  return isLoaded ? (
    children
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress />
    </Box>
  );
}
