'use client';
import { MicrophoneIcon, ArrowUpTrayIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { usePersonalize } from '@/lib/personalizeStore';
import { useEffect, useRef, useState, useMemo } from 'react';
import { speak, stopSpeech, isSpeaking } from '@/lib/speech';

export default function StudentPage() {
  const { draftText, setDraftText, profile } = usePersonalize();

  const trimmed = (draftText || '').trim();
  const canSummarize = Boolean(trimmed);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [speakingOriginal, setSpeakingOriginal] = useState(false);
  const [speakingSummary, setSpeakingSummary] = useState(false);

  const controllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      stopSpeech();
    };
  }, []);

  const bgColor = profile?.background?.color ?? null; 
  const dyslexiaOn = profile?.font === 'OpenDyslexic';
  const motionOff = Boolean(profile?.reducedMotion);

  const fontFamily = useMemo(() => {
    return dyslexiaOn
      ? 'var(--font-open-dyslexic), var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", Roboto'
      : 'var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", Roboto';
  }, [dyslexiaOn]);

  const pageStyle = useMemo(() => {
    if (!bgColor) return undefined;
    return { backgroundColor: bgColor };
  }, [bgColor]);

  const readerStyle = useMemo(() => ({
    fontFamily,
    letterSpacing: dyslexiaOn ? '0.01em' : undefined,
    lineHeight: dyslexiaOn ? 1.8 : 1.6,
    color: '#111827',
  }), [fontFamily, dyslexiaOn]);

  const BACKEND_URL = process.env.NEXT_PUBLIC_SUMMARIZE_URL || '/api/summarize';

  const handleSummarize = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }

    setError('');
    setResult(null);

    if (!canSummarize) {
      setError('Add some text before summarizing.');
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);

    try {
      const payload = {
        text: draftText,
        profile: profile || {},
        mode: 'summary',
      };

      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      controllerRef.current = null;

      if (!res.ok) {
        let bodyText = '';
        try {
          const jsonErr = await res.json();
          bodyText = jsonErr?.detail || JSON.stringify(jsonErr);
        } catch {
          bodyText = await res.text().catch(() => '');
        }
        throw new Error(`Server ${res.status}${bodyText ? `: ${bodyText}` : ''}`);
      }

      const data = await res.json().catch(() => null);
      if (!data) throw new Error('Invalid JSON response from server.');

      const normalized = {
        gist: Array.isArray(data.gist) ? data.gist : [],
        simplified_text: typeof data.simplified_text === 'string' ? data.simplified_text : (data.summary || ''),
        mermaid: typeof data.mermaid === 'string' ? data.mermaid : '',
        meta: typeof data.meta === 'object' && data.meta !== null ? data.meta : {},
      };

      if (!normalized.simplified_text && normalized.gist.length === 0) {
        throw new Error('Empty summary returned. Check model prompt/schema.');
      }

      setResult(normalized);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request cancelled.');
      } else {
        setError(err?.message || 'Unknown error while summarizing.');
        console.error('Summarize error:', err);
      }
    } finally {
      controllerRef.current = null;
      setLoading(false);
    }
  };

  const handleReadOriginal = () => {
    const text = (draftText || '').trim();
    if (!text) {
      setError('Nothing to read. Paste or type some text first.');
      return;
    }

    if (isSpeaking()) {
      stopSpeech();
      setSpeakingOriginal(false);
      setSpeakingSummary(false);
      return;
    }

    setError('');
    speak(
      text,
      () => {
        setSpeakingOriginal(true);
        setSpeakingSummary(false);
      },
      () => {
        setSpeakingOriginal(false);
      }
    );
  };

  const handleReadSummary = () => {
    const text = result?.simplified_text || result?.summary || '';
    if (!text || !text.trim()) {
      setError('No summary to read. Generate a summary first.');
      return;
    }

    if (isSpeaking()) {
      stopSpeech();
      setSpeakingOriginal(false);
      setSpeakingSummary(false);
      return;
    }

    setError('');
    speak(
      text,
      () => {
        setSpeakingSummary(true);
        setSpeakingOriginal(false);
      },
      () => {
        setSpeakingSummary(false);
      }
    );
  };

  return (
    <main className="min-h-screen" style={pageStyle}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <div className="border rounded-md bg-white shadow-sm p-0" style={{ fontFamily }}>
\              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Paste your content here"
                className="w-full px-5 py-5 text-lg placeholder:text-gray-400 focus:outline-none bg-transparent resize-y min-h-[140px]"
                aria-label="Paste your content"
                spellCheck={true}
                style={readerStyle}
              />

              <div className="flex items-center justify-between px-3 py-2 border-t">
                <div className="flex items-center gap-3 text-gray-700">
                  <button className="text-gray-700 p-2" title="Voice (disabled)">
                    <MicrophoneIcon className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    aria-label="Upload"
                    title="Upload"
                    className="text-gray-700 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-doryblue"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Summarize content"
                    title="Summarize"
                    onClick={handleSummarize}
                    disabled={!canSummarize || loading}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-sm focus:outline-none
                      ${canSummarize && !loading ? 'bg-doryblue text-white hover:brightness-95' : 'bg-white/40 text-gray-400 cursor-not-allowed'}`}
                  >
                    <PaperAirplaneIcon
                      className={`h-4 w-4 -rotate-45 ${(!motionOff && loading) ? 'animate-pulse' : ''}`}
                    />
                    <span>{loading ? 'Working…' : 'Summarize'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full max-w-2xl mt-8" style={{ fontFamily }}>
            <button
              type="button"
              onClick={() => { /* placeholder */ }}
              className="mx-auto px-4 py-2 rounded-lg bg-doryblue text-white shadow-sm hover:opacity-90"
              aria-label="Self Check (not wired)"
            >
              Self Check
            </button>

            <button
              type="button"
              onClick={() => { /* placeholder */ }}
              className="mx-auto px-4 py-2 rounded-lg bg-doryblue text-white shadow-sm hover:opacity-90"
              aria-label="Visualize (not wired)"
            >
              Visualize
            </button>

            <button
              type="button"
              onClick={handleReadOriginal}
              className={`mx-auto px-4 py-2 rounded-lg ${speakingOriginal ? 'bg-red-100 text-red-800' : 'bg-doryblue text-white'} shadow-sm hover:opacity-90`}
              aria-label="Read Original"
              title={speakingOriginal ? 'Stop reading' : 'Read original text aloud'}
            >
              {speakingOriginal ? 'Stop' : 'Read Original'}
            </button>

            <button
              type="button"
              onClick={handleReadSummary}
              disabled={!result}
              className={`mx-auto px-4 py-2 rounded-lg ${speakingSummary ? 'bg-red-100 text-red-800' : 'bg-doryblue text-white'} shadow-sm hover:opacity-90 ${!result ? 'opacity-60 cursor-not-allowed' : ''}`}
              aria-label="Read Summary"
              title={speakingSummary ? 'Stop reading' : 'Read summary aloud'}
            >
              {speakingSummary ? 'Stop' : 'Read Summary'}
            </button>
          </div>

          <div className="w-full max-w-2xl mt-8">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4 text-red-800">
                <strong>Error:</strong> {error}
              </div>
            )}

            {result ? (
              <div className="rounded-md bg-white shadow-sm p-5 border" style={{ fontFamily }}>
                {result.gist && result.gist.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Key points</h3>
                    <ul className="list-disc list-inside text-gray-800">
                      {result.gist.map((g, i) => (
                        <li key={i} className="mb-1">{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.simplified_text && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplified text</h3>
                    <div className="rounded-md bg-gray-50 p-4 text-gray-800 whitespace-pre-wrap" style={readerStyle}>
                      {result.simplified_text}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              !loading && (
                <div className="mt-4 rounded-md border border-dashed border-gray-200 p-6 text-center text-gray-500">
                  Click <strong>Summarize</strong> to generate a simplified version of the text.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
