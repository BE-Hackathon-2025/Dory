'use client';
import {MicrophoneIcon, ArrowUpTrayIcon, PaperAirplaneIcon} from '@heroicons/react/24/outline';

export default function StudentPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Input Card */}
        <div className="flex flex-col items-center">
          {/* Paste box + controls */}
          <div className="w-full max-w-2xl">
            <div className="border rounded-md bg-white shadow-sm p-0">
              {/* Editable textarea (uncontrolled) */}
              <textarea
                placeholder="Paste your content here"
                className="w-full px-5 py-5 text-lg text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent resize-y min-h-[140px]"
                aria-label="Paste your content"
              />

              {/* control row (visual only) */}
              <div className="flex items-center justify-between px-3 py-2 border-t">
                <div className="flex items-center gap-3 text-gray-700">
                  {/* mic (visual) */}
                    <button className="text-gray-700 p-2">
                    <MicrophoneIcon className="h-5 w-5" />
                    </button>

                  {/* upload (visual) */}
                    <button
                        type="button"
                        aria-label="Upload"
                        title="Upload"
                        className="text-gray-700 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-doryblue"
                    >
                        <ArrowUpTrayIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Summarize (visual only) */}
                {/* Wire an onClick here later to call your summarization API */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Summarize content"
                        title="Summarize"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-doryblue text-white shadow-sm hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-doryblue"
                    >
                        <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
                        <span>Summarize</span>
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons row (always below the textarea) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full max-w-2xl mt-8">
            <button
              type="button"
              className="mx-auto px-4 py-2 rounded-lg bg-doryblue text-white shadow-sm hover:opacity-90"
              aria-label="Self Check (not wired)"
            >
              Self Check
            </button>

            <button
              type="button"
              className="mx-auto px-4 py-2 rounded-lg bg-doryblue text-white shadow-sm hover:opacity-90"
              aria-label="Visualize (not wired)"
            >
              Visualize
            </button>

            <button
              type="button"
              className="mx-auto px-4 py-2 rounded-lg bg-doryblue text-white shadow-sm hover:opacity-90"
              aria-label="Read Original (not wired)"
            >
              Read Original
            </button>

            <button
              type="button"
              className="mx-auto px-4 py-2 rounded-lg bg-doryblue text-white shadow-sm hover:opacity-90"
              aria-label="Read Summary (not wired)"
            >
              Read Summary
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}