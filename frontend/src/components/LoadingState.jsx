export default function LoadingState({ label = 'Loading data...', compact = false }) {
  return (
    <div
      className={`flex items-center justify-center ${compact ? 'py-8' : 'py-16'}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  )
}
