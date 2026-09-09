import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container-full py-10">
      <Skeleton className="h-3 w-40" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <div>
          <Skeleton className="aspect-4/5 w-full rounded-2xl sm:aspect-square" />
          <div className="mt-3 flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <Skeleton key={index} className="size-20 rounded-lg sm:size-24" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-16 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-full" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
      <span className="sr-only" role="status">
        Loading meal
      </span>
    </div>
  );
}
