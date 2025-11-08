export const speak = (text, onStart, onEnd) => {
  if (typeof window === 'undefined') return; 
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.lang = 'en-US';
  utterance.onstart = onStart;
  utterance.onend = onEnd;

  synth.cancel();
  synth.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (synth && synth.speaking) synth.cancel();
};


export const isSpeaking = () => {
  if (typeof window === 'undefined') return false;
  const synth = window.speechSynthesis;
  return synth ? synth.speaking : false;
};