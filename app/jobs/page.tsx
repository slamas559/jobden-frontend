// app/jobs/page.tsx
// Public "Explore Jobs" page. Anyone can browse and search jobs here without
// logging in. Apply / bookmark actions inside ExplorePage redirect guests to
// /login and bring them back afterwards.
import React, { Suspense } from 'react';
import ExplorePage from '@/components/explore-jobs/explore';

export default function PublicJobsPage() {
  return (
    <Suspense fallback={null}>
      <ExplorePage basePath="/jobs" />
    </Suspense>
  );
}
