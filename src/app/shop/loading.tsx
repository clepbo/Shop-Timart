export default function ShopLoading() {
  return (
    <div className="container-x pb-24 pt-10" aria-busy="true" aria-label="Loading products">
      <div className="skeleton h-3 w-16" />
      <div className="skeleton mt-4 h-12 w-72 max-w-full" />
      <div className="skeleton mt-4 h-4 w-[28rem] max-w-full" />
      <div className="mt-10 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-24" />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5] w-full" style={{ animationDelay: `${i * 90}ms` }} />
            <div className="skeleton mt-4 h-4 w-3/4" />
            <div className="skeleton mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
