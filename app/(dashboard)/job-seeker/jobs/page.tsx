import React, { Suspense } from 'react'
import ExplorePage from '@/components/explore-jobs/explore'

export default function JobPage() {
  return (
    <Suspense fallback={null}>
      <ExplorePage />
    </Suspense>
  )
}