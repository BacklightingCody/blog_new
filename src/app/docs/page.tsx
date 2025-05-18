import { Suspense } from "react"
import BlogList from "@/components/features/blog-list"
import TimeStats from "@/components/features/time-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPage() {
  return (
    <div className="mx-auto px-4 py-8">
      <TimeStats />
      <div className="mt-8">
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </div>
    </div>
  )
}

function BlogListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="p-6 rounded-lg">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
    </div>
  )
}
