export default function ProductLoading() {
  return (
    <div className="container-x pb-24 pt-6" aria-busy="true" aria-label="Loading product">
      <div className="skeleton h-3 w-56" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <div className="skeleton h-8 w-60" />
          <div className="skeleton mt-3 aspect-[3/4] w-full" />
        </div>
        <div>
          <div className="skeleton h-3 w-40" />
          <div className="skeleton mt-4 h-12 w-4/5" />
          <div className="skeleton mt-4 h-6 w-28" />
          <div className="skeleton mt-6 h-20 w-full" />
          <div className="mt-8 flex gap-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton size-11 rounded-full" />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-16" />
            ))}
          </div>
          <div className="skeleton mt-8 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
