'use client';

import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </ThemeProvider>
  );
}
