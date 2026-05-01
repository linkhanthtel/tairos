import { IS_DEMO_BUILD } from "../config"

export default function DemoBanner() {
  if (!IS_DEMO_BUILD) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[45] flex items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium text-white shadow-md sm:text-sm"
      style={{
        background: "linear-gradient(90deg, rgb(15 23 42) 0%, rgb(30 58 138) 50%, rgb(15 23 42) 100%)",
        borderBottom: "1px solid rgba(6, 182, 212, 0.35)",
      }}
      role="status"
    >
      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-cyan-300 ring-1 ring-cyan-400/40">Demo</span>
      <span className="text-slate-200">
        Sample data and UI preview only. No backend or long-term persistence.
      </span>
    </div>
  )
}
