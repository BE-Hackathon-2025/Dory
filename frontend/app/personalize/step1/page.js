'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonalize } from '@/lib/personalizeStore';
import { speak, stopSpeech, isSpeaking } from '@/lib/speech';

function Pill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-4 py-2 rounded-full border transition text-center outline-offset-2
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
    if (isSpeaking() || active) {
      stopSpeech();
      setActive(false);
    } else {
      speak(text, () => setActive(true), () => setActive(false));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-1.5 rounded-full transition ${
        active ? 'bg-white/30' : 'hover:bg-white/20'
      }`}
      aria-label="Read aloud"
      title="Read aloud"
    >
      {active ? '⏹️' : '🔊'}
    </button>
  );
}

/* ------------------ Main Page Component ------------------ */
export default function Step1() {
  const router = useRouter();
  const { profile, setProfile } = usePersonalize();

  const nextEnabled =
    !!profile.ageGroup && !!profile.gradeLevel && !!profile.learningNeed;

  const Progress = () => (
    <div className="flex items-center gap-2 text-white/80">
      <span>●</span><span>○</span><span>○</span><span>○</span><span>○</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-doryblue" />
            <h1 className="text-xl font-semibold text-gray-900">
              Personalization
            </h1>
          </div>
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/')}
          >
            Exit
          </button>
        </header>

        {/* Personalization Card */}
        <section className="bg-doryblue text-white rounded-3xl p-10 shadow-lg space-y-10">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Let’s personalize Dory for you
            </h2>
            <SpeakerButton text="Let's personalize Dory for you." />
          </div>

          {/* Question 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">How old are you?</p>
              <SpeakerButton text="How old are you?" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['8–10', '11–13', '14–17', '18+'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  selected={profile.ageGroup === opt}
                  onClick={() => setProfile({ ageGroup: opt })}
                />
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">What grade level are you in?</p>
              <SpeakerButton text="What grade level are you in?" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Elementary', 'Middle', 'High', 'College'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  selected={profile.gradeLevel === opt}
                  onClick={() => setProfile({ gradeLevel: opt })}
                />
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">
                Would you like Dory to support a learning difference?
              </p>
              <SpeakerButton text="Would you like Dory to support a learning difference?" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Dyslexia', 'ADHD', 'Autism', 'None / Not sure'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  selected={profile.learningNeed === opt}
                  onClick={() => setProfile({ learningNeed: opt })}
                />
              ))}
            </div>
          </div>

          {/* Footer (Progress + Nav Buttons) */}
          <div className="flex items-center justify-between pt-6">
            <Progress />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  router.back();
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
                  router.push('/personalize/step2');
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
          Tip: Use the speaker buttons to hear questions read aloud.
        </p>
      </div>
    </main>
  );
}
