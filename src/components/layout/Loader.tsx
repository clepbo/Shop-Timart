/** Branded loading indicator: a swinging hanger and a thread running along the rail. */
export function Loader({ label = "Styling your page…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
      <svg viewBox="0 0 80 60" className="h-16 w-20 text-wine" aria-hidden>
        <g className="origin-[40px_6px] animate-[sway_1.2s_ease-in-out_infinite]">
          <path d="M40 6c4 0 6 3 4 6s-4 3-4 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M40 18 8 40c-2 1.5-1 4 1.5 4h61c2.5 0 3.5-2.5 1.5-4L40 18Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M18 44h44l-4 14H22z" className="fill-camel" />
        </g>
      </svg>
      <div className="relative h-[3px] w-40 overflow-hidden rounded-full bg-linen">
        <span className="absolute inset-y-0 left-0 w-2/5 animate-[thread_1.3s_ease-in-out_infinite] rounded-full bg-wine" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
    </div>
  );
}
