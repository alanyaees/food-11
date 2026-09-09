import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-full py-16">
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="aspect-4/5 w-full rounded-xl" />
        ))}
      </div>
      <span className="sr-only" role="status">
        Loading
      </span>
    </div>
  );
}
