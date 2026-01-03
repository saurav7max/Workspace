interface SearchTriggerProps {
  onOpenPalette: () => void;
}

export function SearchTrigger({ onOpenPalette }: SearchTriggerProps) {
  return (
    <button
      onClick={onOpenPalette}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 flex items-center gap-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      title="Search commands (⌘K)"
    >
      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="text-gray-500 text-sm flex-1 group-hover:text-gray-600 transition-colors">Search commands...</span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-500 font-mono group-hover:border-gray-300 transition-colors">
          ⌘
        </kbd>
        <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-500 font-mono group-hover:border-gray-300 transition-colors">
          K
        </kbd>
      </div>
    </button>
  );
}
