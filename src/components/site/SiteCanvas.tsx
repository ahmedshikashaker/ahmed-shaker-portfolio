/** Fixed backdrop behind every page: ambient glow, paper/film grain and the drafting-sheet margins. */
export function SiteCanvas() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
      <div className="site-glow absolute inset-0" />
      <div className="site-grain absolute inset-0" />
      <div className="shell absolute inset-y-0 inset-x-0 hidden lg:block">
        <div className="h-full border-x border-[var(--c-grid)]" />
      </div>
    </div>
  );
}
