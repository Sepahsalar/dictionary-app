export function Skeleton() {
  return (
    <div className="mt-6 space-y-3">
      <div className="h-8 w-56 rounded-lg bg-slate-200 animate-pulse dark:bg-slate-800/70" />
      <div className="h-4 w-40 rounded bg-slate-200 animate-pulse dark:bg-slate-800/70" />
      <div className="h-24 w-full rounded-xl bg-slate-200 animate-pulse dark:bg-slate-800/70" />
      <div className="h-24 w-full rounded-xl bg-slate-200 animate-pulse dark:bg-slate-800/70" />
    </div>
  );
}
