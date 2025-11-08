'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonalize } from '@/lib/personalizeStore';
import { speak, stopSpeech, isSpeaking } from '@/lib/speech';

function PageColor({ label, color, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full sm:w-auto px-4 py-3 rounded-full bg-white/90 border transition outline-offset-2
        ${selected ? 'border-white shadow-sm' : 'border-gray-300 hover:bg-white'}`}
      aria-pressed={selected}
    >
      <span
        className="inline-block h-9 w-9 rounded-full border border-black/10"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-gray-900">{label}</span>
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

export default function Step3() {
  const router = useRouter();
  const { profile, setProfile } = usePersonalize();

  const choices = [
    { key: 'offwhite',  label: 'Off-White',  color: '#F7F7F0' },
    { key: 'lightblue', label: 'Light Blue', color: '#D2E6FF' },
    { key: 'sepia',     label: 'Sepia',      color: '#F3E2C7' },
  ];

  // use store value if present
  const [selectedKey, setSelectedKey] = useState(profile.background?.key ?? null);

  const selected = useMemo(
    () => choices.find(c => c.key === selectedKey) || null,
    [selectedKey]
  );

  const previewStyle = useMemo(() => {
    const bg = selected?.color ?? '#FFFFFF';
    return {
      backgroundColor: bg,
      color: '#111827',
      fontFamily:
        profile?.font === 'OpenDyslexic'
          ? 'var(--font-open-dyslexic), var(--font-sans), system-ui'
          : 'var(--font-sans), system-ui',
    };
  }, [selected, profile?.font]);

  const choose = (c) => {
    setSelectedKey(c.key);
    setProfile({ background: c });
  };

  const nextEnabled = !!selected;

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
            <h2 className="text-2xl font-semibold">Let’s find the background that feels best for your eyes</h2>
            <SpeakerButton text="What background feels easier to read?" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {choices.map((c) => (
              <PageColor
                key={c.key}
                label={c.label}
                color={c.color}
                selected={selectedKey === c.key}
                onClick={() => choose(c)}
              />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/90">Preview</p>
            <div className="rounded-2xl p-5 shadow-sm transition-all leading-7" style={previewStyle}>
              Background comfort can reduce eye strain and increase reading speed.
              Try Off-White for neutral contrast, Light Blue for reduced glare, or Sepia for a warm page feel.
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-white/80">
              <span>○</span><span>○</span><span>●</span><span>○</span><span>○</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  router.push('/personalize/step2');
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
                  router.push('/personalize/step4');
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
          Tip: Your background choice will be used on reading pages and text-to-speech highlights.
        </p>
      </div>
    </main>
  );
}
