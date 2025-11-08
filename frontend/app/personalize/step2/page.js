'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonalize } from '@/lib/personalizeStore';
import { speak, stopSpeech, isSpeaking } from '@/lib/speech';

function Pill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full sm:w-auto px-5 py-2 rounded-full border transition text-center outline-offset-2
        ${selected
          ? 'bg-white text-blue-700 border-white shadow-sm'
          : 'bg-white/90 text-gray-800 border-gray-300 hover:bg-white'}`}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}

function SpeakerButton({ text }) {
  const [active, setActive] = useState(false);
  useEffect(() => () => stopSpeech(), []);
  const handleClick = () => {
    if (isSpeaking() || active) { stopSpeech(); setActive(false); }
    else { speak(text, () => setActive(true), () => setActive(false)); }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-1.5 rounded-full transition ${active ? 'bg-white/30' : 'hover:bg-white/20'}`}
      aria-label="Read aloud"
      title="Read aloud"
    >
      {active ? '⏹️' : '🔊'}
    </button>
  );
}

export default function Step2() {
  const router = useRouter();
  const { profile, setProfile } = usePersonalize();

  const [answer, setAnswer] = useState(null); 
  const [showDyslexiaPreview, setShowDyslexiaPreview] = useState(false);

  const choose = (opt) => {
    setAnswer(opt);
    if (opt === 'Often' || opt === 'Sometimes') {
      setProfile({ font: 'OpenDyslexic' }); 
    } else {
      setProfile({ font: null });
      setShowDyslexiaPreview(false);
    }
  };

  const dyslexiaMode = showDyslexiaPreview || answer === 'Often' || answer === 'Sometimes';

  const previewClass = useMemo(() => {
    return [
      'rounded-2xl bg-white/95 text-gray-900 p-5 shadow-sm',
      'transition-all',
      dyslexiaMode ? 'leading-8 tracking-wide' : 'leading-7',
    ].join(' ');
  }, [dyslexiaMode]);

  const nextEnabled = !!answer;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-doryblue" />
            <h1 className="text-xl font-semibold text-gray-900">Personalization</h1>
          </div>
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/')}
          >
            Exit
          </button>
        </header>

        <section className="bg-doryblue text-white rounded-3xl p-10 shadow-lg space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Do words ever look jumbled or move around?
            </h2>
            <SpeakerButton text="Do words ever look jumbled or move around?" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Often', 'Sometimes', 'No'].map((opt) => (
              <Pill
                key={opt}
                label={opt}
                selected={answer === opt}
                onClick={() => choose(opt)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-white/90">Preview</p>
            <label className="flex items-center gap-3 text-sm">
              <span className="text-white/90">Show with Dyslexia Mode</span>
              <button
                type="button"
                onClick={() => setShowDyslexiaPreview((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                  ${showDyslexiaPreview ? 'bg-white' : 'bg-white/40'}`}
                aria-pressed={showDyslexiaPreview}
                aria-label="Toggle Dyslexia Mode preview"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-doryblue transition
                    ${showDyslexiaPreview ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </label>
          </div>

          <div
            className={previewClass}
            style={{
                fontFamily: dyslexiaMode
                    ? 'var(--font-open-dyslexic), var(--font-geist-sans), system-ui'
                    : 'var(--font-geist-sans), system-ui',
                }}
          >
            Dense text can be tough to track. In Dyslexia Mode, Dory increases spacing
            and uses a friendly font to reduce visual crowding. Try reading this
            sentence and see which setting feels best.
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-white/80">
              <span>○</span><span>●</span><span>○</span><span>○</span><span>○</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  router.push('/personalize/step1');
                }}
                className="px-4 py-2 rounded-lg font-medium bg-white/20 text-white hover:bg-white/30"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!nextEnabled}
                onClick={() => {
                  stopSpeech();
                  router.push('/personalize/step3');
                }}
                className={`px-5 py-2 rounded-lg font-medium transition
                  ${
                    nextEnabled
                      ? 'bg-white text-blue-700 hover:bg-gray-100'
                      : 'bg-white/40 text-white/70 cursor-not-allowed'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <p className="mt-4 text-sm text-gray-500">
          Tip: Toggle Dyslexia Mode to compare before choosing. Selecting “Often” or “Sometimes”
          will enable this mode by default for the rest of your setup.
        </p>
      </div>
    </main>
  );
}
