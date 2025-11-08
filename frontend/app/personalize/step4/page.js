'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonalize } from '@/lib/personalizeStore';
import { speak, stopSpeech, isSpeaking } from '@/lib/speech';

/* ------------------ Small components ------------------ */
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

/* ------------------ Page ------------------ */
export default function Step4() {
  const router = useRouter();
  const { profile, setProfile } = usePersonalize();

  // local choice for this step: 'Yes' | 'No' | null
  const [answer, setAnswer] = useState(
    profile.reducedMotion === true ? 'Yes' :
    profile.reducedMotion === false ? 'No' : null
  );

  const choose = (opt) => {
    setAnswer(opt);
    setProfile({ reducedMotion: opt === 'Yes' });
  };

  const nextEnabled = !!answer;
  const motionOff = answer === 'Yes';

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
            <h2 className="text-2xl font-semibold">Do animations or scrolling bother you?</h2>
            <SpeakerButton text="Do animations or scrolling bother you?" />
          </div>

          {/* options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Yes', 'No'].map((opt) => (
              <Pill
                key={opt}
                label={opt}
                selected={answer === opt}
                onClick={() => choose(opt)}
              />
            ))}
          </div>

          {/* preview */}
          <div className="space-y-2">
            <p className="text-sm text-white/90">Preview</p>

            <div className="rounded-2xl bg-white/95 text-gray-900 p-5 shadow-sm">
              <div className="flex items-center gap-4">
                {/* animated vs calm dot */}
                <span
                  className={[
                    'h-4 w-4 rounded-full bg-blue-500 inline-block',
                    motionOff ? '' : 'animate-bounce',
                  ].join(' ')}
                  aria-hidden="true"
                />
                <p className="leading-7">
                  {motionOff
                    ? 'Motion is minimized. Elements won’t bounce or auto-scroll.'
                    : 'Motion is on. Some elements may bounce or scroll smoothly.'}
                </p>
              </div>

              {/* demo scroller */}
              <div
                className={`mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white`}
                style={{ height: 80 }}
              >
                <div
                  className={[
                    'whitespace-nowrap px-4 py-2 text-sm text-gray-700',
                    motionOff ? '' : 'animate-[scroll_6s_linear_infinite]',
                  ].join(' ')}
                  style={{
                    // keyframes fallback if not in globals: simple translate loop
                    display: 'inline-block',
                  }}
                >
                  <span className="mr-8">This is a short scrolling area…</span>
                  <span className="mr-8">In reduced motion, it stays still.</span>
                  <span className="mr-8">You can read at your own pace.</span>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between pt-4">
            {/* progress: step 4 of 5 */}
            <div className="flex items-center gap-2 text-white/80">
              <span>○</span><span>○</span><span>○</span><span>●</span><span>○</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  router.push('/personalize/step3');
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
                  router.push('/personalize/step5');
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
          Tip: If you choose “Yes,” Dory will avoid motion effects and auto-scrolling.
        </p>
      </div>

      {/* keyframes for the tiny scroller (scoped to this page) */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
