import * as React from 'react';

interface TailwindDemoContainerProps {
  children: React.ReactNode;
}

/**
 * WARNING: This is an internal component used in documentation to inject the Tailwind script.
 * Please do not use it in your application.
 */
export function TailwindDemoContainer(props: TailwindDemoContainerProps) {
  const { children } = props;

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    document.body.appendChild(script);
  }, []);

  return children;
}
