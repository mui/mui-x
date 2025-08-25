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

  const tailwindPromiseRef = React.useRef<Promise<HTMLScriptElement>>(null);

  React.useEffect(() => {
    const body = documentBody ?? document.body;
    if (!tailwindPromiseRef.current) {
      tailwindPromiseRef.current = new Promise<HTMLScriptElement>((resolve) => {
        const script = document.createElement('script');
        script.onload = () => resolve(script);
        script.src = 'https://unpkg.com/@tailwindcss/browser@4';
        body.appendChild(script);
      });
    }

    tailwindPromiseRef.current.then(() => setIsLoaded(true));

    const cleanup = () => {
      tailwindPromiseRef.current?.then((el) => el.remove());

      const head = body?.ownerDocument.head;
      if (!head) {
        return;
      }

      const styles = head.querySelectorAll('style:not([data-emotion])');
      styles.forEach((style) => {
        const styleText = style.textContent?.substring(0, 100);
        const isTailwindStylesheet = styleText?.includes('tailwind');
        if (isTailwindStylesheet) {
          style.remove();
        }
      });
    };

    return cleanup;
  }, [documentBody]);

  return isLoaded ? (
    children
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress />
    </Box>
  );
}
