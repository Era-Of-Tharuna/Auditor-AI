export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Analyzing contract...</p>
          <p className="text-sm text-gray-500">Running security audit</p>
        </div>
      </div>
    </div>
  );
}
