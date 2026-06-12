export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#151B2E] border border-white/[0.06] overflow-hidden animate-pulse">
      <div className="h-44 bg-white/5" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-white/5 rounded-lg w-3/4" />
        <div className="h-3 bg-white/5 rounded-lg w-1/2" />
        <div className="h-3 bg-white/5 rounded-lg w-2/3" />
      </div>
    </div>
  )
}
