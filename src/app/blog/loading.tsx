export default function BlogLoading() {
  return (
    <div className="shell pt-32 sm:pt-40" aria-busy="true">
      <span className="sr-only" role="status">
        Loading articles…
      </span>
      <div className="skeleton h-3 w-40 rounded-full" />
      <div className="skeleton mt-7 h-14 w-full max-w-2xl rounded-lg" />
      <div className="skeleton mt-4 h-14 w-2/3 max-w-xl rounded-lg" />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border border-line p-0">
            <div className="skeleton aspect-[1.9]" />
            <div className="space-y-3 p-6">
              <div className="skeleton h-3 w-24 rounded-full" />
              <div className="skeleton h-6 w-5/6 rounded-md" />
              <div className="skeleton h-4 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
