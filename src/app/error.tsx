"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-zinc-800">500</div>
        <h1 className="mt-4 text-2xl font-bold text-white">Something went wrong</h1>
        <p className="mt-2 text-zinc-400">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
