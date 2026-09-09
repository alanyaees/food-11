import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container-full py-14">
      <div className="max-w-xl space-y-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
        <div className="hidden space-y-6 lg:block">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          ))}
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">
        Loading meals
      </span>
    </div>
  );
}
