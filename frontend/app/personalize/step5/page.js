'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonalize } from '@/lib/personalizeStore';
import { speak, stopSpeech, isSpeaking } from '@/lib/speech';

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

export default function Step5() {
  const router = useRouter();
  const { profile } = usePersonalize();

  const bg = profile.background?.color ?? '#FFFFFF';
  const dyslexiaOn = profile.font === 'OpenDyslexic';
  const motionOff = profile.reducedMotion === true;

  const previewStyle = useMemo(() => ({
    backgroundColor: bg,
    color: '#111827',
    fontFamily: dyslexiaOn
      ? 'var(--font-open-dyslexic), var(--font-sans), system-ui'
      : 'var(--font-sans), system-ui',
    letterSpacing: dyslexiaOn ? '0.02em' : undefined,
    lineHeight: dyslexiaOn ? 1.9 : 1.7,
  }), [bg, dyslexiaOn]);

  const summary = [
    { label: 'Age', value: profile.ageGroup || '—' },
    { label: 'Grade', value: profile.gradeLevel || '—' },
    { label: 'Learning Support', value: profile.learningNeed || '—' },
    { label: 'Reading Font', value: dyslexiaOn ? 'OpenDyslexic' : 'Default' },
    { label: 'Background', value: profile.background?.label || 'Default' },
    { label: 'Motion', value: motionOff ? 'Reduced' : 'Normal' },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl p-6">
        {/* header */}
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

        {/* card */}
        <section className="bg-doryblue text-white rounded-3xl p-10 shadow-lg space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Awesome, we’ve built your learning profile!</h2>
            <SpeakerButton text="Awesome, we've built your learning profile!" />
          </div>

          {/* summary list */}
          <div className="rounded-2xl bg-white/95 text-gray-900 p-5 shadow-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {summary.map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">{row.label}</dt>
                  <dd className="text-sm font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* final preview */}
          <div className="space-y-2">
            <p className="text-sm text-white/90">Your reading preview</p>
            <div className="rounded-2xl p-5 shadow-sm transition-all" style={previewStyle}>
              This is how Dory will show text for you. You can change these settings anytime.
              {motionOff && (
                <span className="block mt-2 text-gray-700">
                  Motion is minimized for comfort.
                </span>
              )}
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between pt-4">
            {/* progress: step 5 of 5 */}
            <div className="flex items-center gap-2 text-white/80">
              <span>○</span><span>○</span><span>○</span><span>○</span><span>●</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  router.push('/personalize/step4');
                }}
                className="px-4 py-2 rounded-lg font-medium bg-white/20 text-white hover:bg-white/30"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  // TODO: route to your main reading page
                  router.push('/student'); // or '/read'
                }}
                className="px-5 py-2 rounded-lg font-medium bg-white text-blue-700 hover:bg-gray-100"
              >
                Start Learning
              </button>
            </div>
          </div>
        </section>

        <p className="mt-4 text-sm text-gray-500">
          Tip: You can revisit personalization anytime from Settings.
        </p>
      </div>
    </main>
  );
}
