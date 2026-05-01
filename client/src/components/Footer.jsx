export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-auto border-t border-slate-800/70 bg-slate-950"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-100">
            TAIROS
          </p>
          <p className="mt-3 text-xs font-normal leading-relaxed text-slate-500 sm:text-sm">
            © {year} TAIROS.{" "}
            <span className="text-slate-600">All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
