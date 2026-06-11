export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="h-7 w-36 bg-border rounded-lg" />
        <div className="h-8 w-20 bg-border rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-4 flex items-center gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-border rounded w-2/3" />
                <div className="h-3 bg-border rounded w-1/3" />
              </div>
              <div className="h-5 w-16 bg-border rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
