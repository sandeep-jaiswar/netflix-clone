// app/loading.tsx
import React from 'react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  // This will be displayed while the main page.tsx content is loading.
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-netflix-red"></div>
      <p className="mt-4 text-lg">Loading Netflix...</p>
    </div>
  );
}
